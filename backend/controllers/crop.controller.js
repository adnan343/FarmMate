import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Crop from "../models/crop.model.js";
import CropSuggestion from "../models/cropSuggestion.model.js";
import Farm from "../models/farm.model.js";
import Product from "../models/product.model.js";

// Helper: build Gemini client
function getGeminiModel() {
    const apiKey = process.env.GEMINI_API || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('Missing Gemini API key');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Internal helper to predict yield using Gemini
async function predictYieldWithGemini({
    cropName,
    variety,
    area,
    areaUnit,
    farmLocation,
    soilType,
    plantingDate,
    expectedHarvestDate,
    yieldUnit
}) {
    try {
        const apiKey = process.env.GEMINI_API || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return null;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an agronomy assistant. Predict the yield for the following crop.
Crop: ${cropName}
Variety: ${variety}
Area: ${area} ${areaUnit}
Farm location: ${farmLocation || "unknown"}
Soil type: ${soilType || "unknown"}
Planting date: ${plantingDate}
Expected harvest date: ${expectedHarvestDate}
Desired unit: ${yieldUnit}

Return ONLY a single positive number representing the predicted yield in ${yieldUnit}, with no unit text or extra commentary. If uncertain, provide your best estimate as a number.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = (response && typeof response.text === 'function') ? response.text() : '';
        if (!text) return null;
        // Clean code fencing if any
        if (text.includes('```')) {
            text = text.replace(/```[a-z]*\n?/gi, '').replace(/\n?```/g, '');
        }
        // Extract number
        const match = text.match(/\d+(?:\.\d+)?/);
        if (!match) return null;
        const value = parseFloat(match[0]);
        if (isNaN(value) || value < 0) return null;
        return value;
    } catch (_err) {
        return null;
    }
}

// Get all crops for a farmer
export const getCrops = async (req, res) => {
    try {
        const { farmerId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ success: false, message: 'Invalid farmer ID' });
        }

        const crops = await Crop.find({ farmer: farmerId })
            .populate('farm', 'name location')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: crops });
    } catch (err) {
        console.log("Error fetching crops", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get crops by farm
export const getCropsByFarm = async (req, res) => {
    try {
        const { farmId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(farmId)) {
            return res.status(400).json({ success: false, message: 'Invalid farm ID' });
        }

        const crops = await Crop.find({ farm: farmId })
            .populate('farm', 'name location')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: crops });
    } catch (err) {
        console.log("Error fetching crops by farm", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Add a new crop
export const addCrop = async (req, res) => {
    try {
        const cropData = req.body;

        // Validate required fields
        if (!cropData.name || !cropData.variety || !cropData.farm || !cropData.farmer || 
            !cropData.area || !cropData.plantingDate || !cropData.expectedHarvestDate) {
            return res.status(400).json({ success: false, message: 'Provide all required fields' });
        }

        // Validate farm exists and belongs to farmer
        const farm = await Farm.findById(cropData.farm);
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }

        if (farm.farmer.toString() !== cropData.farmer) {
            return res.status(403).json({ success: false, message: 'Farm does not belong to this farmer' });
        }

        // Normalize numeric fields
        if (cropData.estimatedYield !== undefined && cropData.estimatedYield !== null) {
            cropData.estimatedYield = Number(cropData.estimatedYield);
        }
        cropData.area = Number(cropData.area);

        // Attempt AI predicted yield
        const predicted = await predictYieldWithGemini({
            cropName: cropData.name,
            variety: cropData.variety,
            area: cropData.area,
            areaUnit: cropData.unit,
            farmLocation: farm.location,
            soilType: farm.soilType,
            plantingDate: cropData.plantingDate,
            expectedHarvestDate: cropData.expectedHarvestDate,
            yieldUnit: cropData.yieldUnit || 'kg'
        });

        if (predicted !== null) {
            cropData.predictedYield = predicted;
        }

        const newCrop = new Crop(cropData);
        await newCrop.save();

        const populatedCrop = await Crop.findById(newCrop._id).populate('farm', 'name location');

        res.status(201).json({ success: true, data: populatedCrop });
    } catch (err) {
        console.error("Error creating crop", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update crop stage
export const updateCropStage = async (req, res) => {
    try {
        const { cropId } = req.params;
        const { stage, notes, actualYield, totalCost } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }

        const validStages = ['planning', 'planting', 'growing', 'flowering', 'fruiting', 'harvest', 'harvested'];
        if (stage && !validStages.includes(stage)) {
            return res.status(400).json({ success: false, message: 'Invalid stage' });
        }

        const updateData = {};
        if (stage) updateData.stage = stage;
        if (notes !== undefined) updateData.notes = notes;

        // If stage is 'harvested', require actualYield, set harvest date and isHarvested flag, and create a product
        if (stage === 'harvested') {
            if (actualYield === undefined || actualYield === null || Number(actualYield) <= 0) {
                return res.status(400).json({ success: false, message: 'Please provide actualYield to mark as harvested' });
            }
            updateData.isHarvested = true;
            updateData.harvestDate = new Date();
            updateData.status = 'completed';
            updateData.actualYield = Number(actualYield);
            if (totalCost !== undefined && totalCost !== null) {
                const parsedCost = Number(totalCost);
                if (!isNaN(parsedCost) && parsedCost >= 0) {
                    updateData.totalCost = parsedCost;
                }
            }

            // Get the crop to access farm information
            const crop = await Crop.findById(cropId).populate('farm');
            if (crop) {
                // Create a product from the harvested crop
                const newProduct = new Product({
                    name: `${crop.name} - ${crop.variety}`,
                    description: `${crop.name} variety ${crop.variety} harvested from ${crop.farm.name}`,
                    price: 0, // Will be set by farmer later
                    category: 'vegetables', // Default category
                    stock: Number(actualYield) || crop.estimatedYield || 0,
                    unit: crop.yieldUnit || 'kg',
                    farmer: crop.farmer,
                    farm: crop.farm._id,
                    isAvailable: false, // Not published to marketplace yet
                    rating: 0,
                    reviewCount: 0
                });

                await newProduct.save();
                updateData.product = newProduct._id; // Link the product to the crop
            }
        }

        const updatedCrop = await Crop.findByIdAndUpdate(
            cropId, 
            updateData, 
            { new: true }
        ).populate('farm', 'name location');

        if (!updatedCrop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        res.status(200).json({ success: true, data: updatedCrop });
    } catch (err) {
        console.error("Error updating crop stage", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update crop
export const updateCrop = async (req, res) => {
    try {
        const { cropId } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }

        const updatedCrop = await Crop.findByIdAndUpdate(
            cropId, 
            updateData, 
            { new: true }
        ).populate('farm', 'name location');

        if (!updatedCrop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        res.status(200).json({ success: true, data: updatedCrop });
    } catch (err) {
        console.error("Error updating crop", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete crop
export const deleteCrop = async (req, res) => {
    try {
        const { cropId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }

        const deletedCrop = await Crop.findByIdAndDelete(cropId);

        if (!deletedCrop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        res.status(200).json({ success: true, message: 'Crop deleted successfully' });
    } catch (err) {
        console.error("Error deleting crop", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Harvest crop and create product
export const harvestCrop = async (req, res) => {
    try {
        const { cropId } = req.params;
        const { actualYield, price, description, category, unit } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }

        // Validate required fields for product creation
        if (!actualYield || !price || !description || !category || !unit) {
            return res.status(400).json({ success: false, message: 'Provide all required fields for product creation' });
        }

        const crop = await Crop.findById(cropId).populate('farm');
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found' });
        }

        // Update crop to harvested status
        crop.stage = 'harvested';
        crop.isHarvested = true;
        crop.harvestDate = new Date();
        crop.actualYield = actualYield;
        crop.status = 'completed';
        await crop.save();

        // Create product from harvested crop
        const product = new Product({
            name: `${crop.name} - ${crop.variety}`,
            description: description,
            price: price,
            category: category,
            stock: actualYield,
            unit: unit,
            farmer: crop.farmer,
            farm: crop.farm._id,
            isAvailable: true
        });

        await product.save();

        const populatedCrop = await Crop.findById(cropId).populate('farm', 'name location');

        res.status(200).json({ 
            success: true, 
            data: populatedCrop,
            product: product,
            message: 'Crop harvested and product created successfully'
        });
    } catch (err) {
        console.error("Error harvesting crop", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Suggest crops using Gemini AI
export const suggestCrops = async (req, res) => {
    console.log("=== suggestCrops function started ===");
    try {
        const { farmId } = req.params;
        console.log("1. Farm ID:", farmId);
        
        if (!mongoose.Types.ObjectId.isValid(farmId)) {
            console.log("Invalid farm ID");
            return res.status(400).json({ success: false, message: 'Invalid farm ID' });
        }

        console.log("2. Searching for farm...");
        const farm = await Farm.findById(farmId);
        console.log("3. Farm found:", !!farm);
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }

        // Check if suggestions already exist in database
        console.log("4. Checking for existing suggestions in database...");
        let existingSuggestion = await CropSuggestion.findOne({ farm: farmId });
        
        if (existingSuggestion) {
            console.log("5. Found existing suggestions in database");
            return res.status(200).json({ 
                success: true, 
                data: existingSuggestion.suggestions,
                farmInfo: existingSuggestion.farmInfo,
                fromCache: true
            });
        }

        console.log("6. No existing suggestions found, making API call to Gemini...");
        console.log("7. API Key present:", !!(process.env.GEMINI_API || process.env.GOOGLE_API_KEY));

        // Initialize Gemini AI
        let model;
        try {
            model = getGeminiModel();
        } catch (e) {
            console.log("Missing Gemini API key (GEMINI_API or GOOGLE_API_KEY)");
            return res.status(500).json({ success: false, message: 'Missing Gemini API key' });
        }
        console.log("9. Model initialized");

                       // Create the prompt
               const prompt = `Give me suggestions on what crops should I plant on my farm based on the following data:

Location: ${farm.location}
                Land area: ${farm.landSize}

Your output should be a JSON array containing objects with the following structure:
{
  "cropName": "name of the crop",
  "expectedYield": "expected yield with unit",
  "plantingWindow": "best time to plant",
  "reason": "brief explanation why this crop is suitable"
}

Please provide 3-5 crop suggestions that would be suitable for this farm location and size. Return ONLY the JSON array, no markdown formatting, no code blocks, no additional text or explanations.`;

        console.log("10. Making API call to Gemini...");
        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        console.log("11. Got result from Gemini");
        
        const response = await result.response;
        console.log("12. Got response object");
        
        let text = response.text();
        console.log("13. Response text length:", text.length);

        try {
            console.log("14. Processing response text...");
            console.log("Raw response:", text);
            
            // Clean the response by removing markdown code blocks if present
            if (text.includes('```json')) {
                text = text.replace(/```json\n?/g, '').replace(/\n?```/g, '');
            } else if (text.includes('```')) {
                text = text.replace(/```\n?/g, '').replace(/\n?```/g, '');
            }
            
            // Remove any leading/trailing whitespace and newlines
            text = text.trim();
            
            // Try to find JSON array in the response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                text = jsonMatch[0];
            }
            
            console.log("15. Cleaned text:", text);
            console.log("15. Cleaned text length:", text.length);
            
            // Parse the JSON response from Gemini
            const suggestions = JSON.parse(text);
            console.log("16. JSON parsed successfully, suggestions count:", suggestions.length);
            
            // Store suggestions in database
            console.log("17. Storing suggestions in database...");
            const newSuggestion = new CropSuggestion({
                farm: farmId,
                farmer: farm.farmer,
                suggestions: suggestions,
                farmInfo: {
                    location: farm.location,
                    area: farm.landSize
                }
            });
            
            await newSuggestion.save();
            console.log("18. Suggestions stored successfully");
            
            res.status(200).json({ 
                success: true, 
                data: suggestions,
                farmInfo: {
                    location: farm.location,
                    area: farm.landSize
                },
                fromCache: false
            });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError.message);
            console.error("Cleaned text:", text);
            res.status(500).json({ 
                success: false, 
                message: "Error processing AI response",
                rawResponse: text 
            });
        }

    } catch (err) {
        console.error("=== MAIN ERROR ===");
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        res.status(500).json({ success: false, message: "Server error", details: err.message });
    }
};

// Get stored crop suggestions for a farm
export const getStoredCropSuggestions = async (req, res) => {
    try {
        const { farmId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(farmId)) {
            return res.status(400).json({ success: false, message: 'Invalid farm ID' });
        }

        const suggestion = await CropSuggestion.findOne({ farm: farmId });
        
        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'No suggestions found for this farm' });
        }

        res.status(200).json({ 
            success: true, 
            data: suggestion.suggestions,
            farmInfo: suggestion.farmInfo,
            createdAt: suggestion.createdAt
        });
    } catch (err) {
        console.error("Error fetching stored crop suggestions", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Force refresh crop suggestions (delete existing and get new ones)
export const refreshCropSuggestions = async (req, res) => {
    try {
        const { farmId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(farmId)) {
            return res.status(400).json({ success: false, message: 'Invalid farm ID' });
        }

        // Delete existing suggestions
        await CropSuggestion.findOneAndDelete({ farm: farmId });
        
        // Call the suggestCrops function to get new suggestions
        req.params.farmId = farmId;
        return await suggestCrops(req, res);
        
    } catch (err) {
        console.error("Error refreshing crop suggestions", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Generate a crop timeline using Gemini for a given suggestion (without creating the crop yet)
export const generateCropTimeline = async (req, res) => {
    try {
        const { farmId } = req.params;
        const { suggestion, plantingStartDate } = req.body; // suggestion is an object as returned by suggestCrops

        if (!mongoose.Types.ObjectId.isValid(farmId)) {
            return res.status(400).json({ success: false, message: 'Invalid farm ID' });
        }

        const farm = await Farm.findById(farmId);
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }

        if (!suggestion || !suggestion.cropName) {
            return res.status(400).json({ success: false, message: 'Suggestion with cropName is required' });
        }

        let model;
        try {
            model = getGeminiModel();
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Missing Gemini API key' });
        }

        const startDateIso = plantingStartDate ? new Date(plantingStartDate).toISOString().split('T')[0] : 'unspecified';

        const prompt = `You are an agronomy assistant. Create a comprehensive farming task timeline for the crop "${suggestion.cropName}" for a farm with the following details:
Location: ${farm.location}
Land area: ${farm.landSize}
Soil type: ${farm.soilType}

If useful, consider this expected yield: ${suggestion.expectedYield || 'N/A'} and planting window: ${suggestion.plantingWindow || 'N/A'}.
Planting starts on ${startDateIso}. If date is 'unspecified', infer a reasonable start date from planting window.

IMPORTANT: Use the planting start date (${startDateIso}) as your reference point for calculating all task dates.
- Soil preparation tasks should happen BEFORE the planting start date
- Planting tasks should happen ON the planting start date
- All subsequent tasks (watering, fertilizing, etc.) should be calculated relative to the planting start date
- Use realistic intervals between tasks (e.g., watering every 2-3 days, fertilizing every 2-3 weeks)

Return a JSON array of timeline items. Each item must strictly match this schema:
{
  "title": string,
  "category": "soil_preparation" | "planting" | "watering" | "irrigation" | "fertilizing" | "weeding" | "pest_control" | "monitoring" | "pruning" | "harvest" | "other",
  "description": string,
  "startDate": "YYYY-MM-DD", // Calculate this relative to planting start date
  "endDate": "YYYY-MM-DD",   // Calculate this relative to planting start date
  "dueDate": "YYYY-MM-DD",   // For single-day tasks, calculate relative to planting start date
  "frequency": string,         // e.g., 'every 3 days', 'weekly', 'biweekly'
}
Make sure the JSON is valid and no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        if (text.includes('```')) {
            text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        }
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) text = jsonMatch[0];

        const timeline = JSON.parse(text);

        return res.status(200).json({ success: true, data: timeline });
    } catch (err) {
        console.error('Error generating crop timeline', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Accept a suggestion: create a crop entry with generated timeline
export const acceptCropSuggestion = async (req, res) => {
    try {
        const { farmId } = req.params;
        const { farmerId, suggestion, cropInput, timeline } = req.body;

        // cropInput can include: variety, area, unit, plantingDate, expectedHarvestDate, estimatedYield, yieldUnit, notes

        if (!mongoose.Types.ObjectId.isValid(farmId) || !mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }

        const farm = await Farm.findById(farmId);
        if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
        if (farm.farmer.toString() !== farmerId) {
            return res.status(403).json({ success: false, message: 'Farm does not belong to this farmer' });
        }

        if (!suggestion || !suggestion.cropName) {
            return res.status(400).json({ success: false, message: 'Suggestion with cropName is required' });
        }

        const cropData = {
            name: suggestion.cropName,
            variety: cropInput?.variety || 'General',
            farm: farmId,
            farmer: farmerId,
            area: Number(cropInput?.area || 1),
            unit: cropInput?.unit || 'acres',
            plantingDate: cropInput?.plantingDate ? new Date(cropInput.plantingDate) : new Date(),
            expectedHarvestDate: cropInput?.expectedHarvestDate ? new Date(cropInput.expectedHarvestDate) : new Date(Date.now() + 1000*60*60*24*120),
            stage: 'planning',
            status: 'active',
            estimatedYield: cropInput?.estimatedYield ? Number(cropInput.estimatedYield) : undefined,
            yieldUnit: cropInput?.yieldUnit || 'kg',
            notes: cropInput?.notes || '',
            acceptedSuggestion: {
                cropName: suggestion.cropName,
                expectedYield: suggestion.expectedYield || '',
                plantingWindow: suggestion.plantingWindow || '',
                reason: suggestion.reason || ''
            },
            timeline: Array.isArray(timeline) ? timeline.map(t => ({
                title: t.title,
                category: t.category || 'other',
                description: t.description || '',
                startDate: t.startDate ? new Date(t.startDate) : undefined,
                endDate: t.endDate ? new Date(t.endDate) : undefined,
                dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
                frequency: t.frequency || '',
                completed: !!t.completed,
                notes: t.notes || ''
            })) : []
        };

        const newCrop = new Crop(cropData);
        await newCrop.save();
        const populatedCrop = await Crop.findById(newCrop._id).populate('farm', 'name location');
        return res.status(201).json({ success: true, data: populatedCrop });
    } catch (err) {
        console.error('Error accepting crop suggestion', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Timeline CRUD for an existing crop
export const getCropTimeline = async (req, res) => {
    try {
        const { cropId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }
        const crop = await Crop.findById(cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        return res.status(200).json({ success: true, data: crop.timeline || [] });
    } catch (err) {
        console.error('Error fetching crop timeline', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const addTimelineItem = async (req, res) => {
    try {
        const { cropId } = req.params;
        const item = req.body;
        const crop = await Crop.findById(cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        crop.timeline.push({
            title: item.title,
            category: item.category || 'other',
            description: item.description || '',
            startDate: item.startDate ? new Date(item.startDate) : undefined,
            endDate: item.endDate ? new Date(item.endDate) : undefined,
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
            frequency: item.frequency || '',
            completed: !!item.completed,
            notes: item.notes || ''
        });
        await crop.save();
        return res.status(201).json({ success: true, data: crop.timeline });
    } catch (err) {
        console.error('Error adding timeline item', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateTimelineItem = async (req, res) => {
    try {
        const { cropId, index } = req.params;
        const i = parseInt(index, 10);
        const updates = req.body;
        const crop = await Crop.findById(cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        if (!crop.timeline || i < 0 || i >= crop.timeline.length) {
            return res.status(400).json({ success: false, message: 'Invalid timeline index' });
        }
        const current = crop.timeline[i];
        crop.timeline[i] = {
            ...current.toObject(),
            ...updates,
            startDate: updates.startDate ? new Date(updates.startDate) : current.startDate,
            endDate: updates.endDate ? new Date(updates.endDate) : current.endDate,
            dueDate: updates.dueDate ? new Date(updates.dueDate) : current.dueDate,
            completed: updates.completed !== undefined ? !!updates.completed : current.completed
        };
        await crop.save();
        return res.status(200).json({ success: true, data: crop.timeline });
    } catch (err) {
        console.error('Error updating timeline item', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteTimelineItem = async (req, res) => {
    try {
        const { cropId, index } = req.params;
        const i = parseInt(index, 10);
        const crop = await Crop.findById(cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        if (!crop.timeline || i < 0 || i >= crop.timeline.length) {
            return res.status(400).json({ success: false, message: 'Invalid timeline index' });
        }
        crop.timeline.splice(i, 1);
        await crop.save();
        return res.status(200).json({ success: true, data: crop.timeline });
    } catch (err) {
        console.error('Error deleting timeline item', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Generate and save a timeline for an existing crop based on its data
export const generateTimelineForCrop = async (req, res) => {
    try {
        const { cropId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cropId)) {
            return res.status(400).json({ success: false, message: 'Invalid crop ID' });
        }

        const crop = await Crop.findById(cropId).populate('farm');
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

        let model;
        try {
            model = getGeminiModel();
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Missing Gemini API key' });
        }

        const plantingIso = crop.plantingDate ? new Date(crop.plantingDate).toISOString().split('T')[0] : 'unspecified';
        const harvestIso = crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toISOString().split('T')[0] : 'unspecified';

        const prompt = `You are an agronomy assistant. Create a comprehensive farming task timeline for the crop "${crop.name}" (variety: ${crop.variety}) for the following farm:
Location: ${crop.farm.location}
Land area: ${crop.area} ${crop.unit}
Soil type: ${crop.farm.soilType}
Planting date: ${plantingIso}
Expected harvest: ${harvestIso}

IMPORTANT: Use the planting date (${plantingIso}) as your reference point for calculating all task dates. If the planting date is 'unspecified', infer todays date as the planting start date based on the expected harvest date and typical crop cycles.
- Soil preparation tasks should happen BEFORE the planting date
- Planting tasks should happen ON the planting date
- All subsequent tasks (watering, fertilizing, etc.) should be calculated relative to the planting date
- Use realistic intervals between tasks (e.g., watering every 2-3 days, fertilizing every 2-3 weeks)

Return a JSON array of timeline items with this exact schema:
{
  "title": string,
  "category": "soil_preparation" | "planting" | "watering" | "irrigation" | "fertilizing" | "weeding" | "pest_control" | "monitoring" | "pruning" | "harvest" | "other",
  "description": string,
  "startDate": "YYYY-MM-DD", // Calculate this relative to planting date
  "endDate": "YYYY-MM-DD",   // Calculate this relative to planting date
  "dueDate": "YYYY-MM-DD",   // For single-day tasks, calculate relative to planting date
  "frequency": string          // e.g., 'every 3 days', 'weekly', 'biweekly'
}
Return ONLY the JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        if (text.includes('```')) {
            text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        }
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) text = jsonMatch[0];

        const timeline = JSON.parse(text);

        crop.timeline = (timeline || []).map(t => ({
            title: t.title,
            category: t.category || 'other',
            description: t.description || '',
            startDate: t.startDate ? new Date(t.startDate) : undefined,
            endDate: t.endDate ? new Date(t.endDate) : undefined,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            frequency: t.frequency || '',
            completed: false,
            notes: ''
        }));
        await crop.save();
        return res.status(200).json({ success: true, data: crop.timeline });
    } catch (err) {
        console.error('Error generating timeline for crop', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};