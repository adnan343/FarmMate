import Crop from "../models/crop.model.js";
import Farm from "../models/farm.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
        const { stage, notes } = req.body;

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

        // If stage is 'harvested', set harvest date and isHarvested flag, and create a product
        if (stage === 'harvested') {
            updateData.isHarvested = true;
            updateData.harvestDate = new Date();
            updateData.status = 'completed';

            // Get the crop to access farm information
            const crop = await Crop.findById(cropId).populate('farm');
            if (crop) {
                // Create a product from the harvested crop
                const newProduct = new Product({
                    name: `${crop.name} - ${crop.variety}`,
                    description: `${crop.name} variety ${crop.variety} harvested from ${crop.farm.name}`,
                    price: 0, // Will be set by farmer later
                    category: 'vegetables', // Default category
                    stock: crop.actualYield || crop.estimatedYield || 0,
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

        console.log("4. Initializing Gemini AI...");
        console.log("5. API Key present:", !!process.env.GEMINI_API);
        
        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        console.log("6. Gemini AI instance created");
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("7. Model initialized");

        // Create the prompt
        const prompt = `Give me suggestions on what crops should I plant on my farm based on the following data:

Location: ${farm.location}
Land area: ${farm.area}

Your output should be a JSON array containing objects with the following structure:
{
  "cropName": "name of the crop",
  "expectedYield": "expected yield with unit",
  "plantingWindow": "best time to plant",
  "reason": "brief explanation why this crop is suitable"
}

Please provide 3-5 crop suggestions that would be suitable for this farm location and size. Return only the JSON array, no additional text.`;

        console.log("8. Making API call to Gemini...");
        // Generate content using Gemini
        const result = await model.generateContent(prompt);
        console.log("9. Got result from Gemini");
        
        const response = await result.response;
        console.log("10. Got response object");
        
        let text = response.text();
        console.log("11. Response text length:", text.length);

        try {
            console.log("12. Processing response text...");
            // Clean the response by removing markdown code blocks if present
            if (text.includes('```json')) {
                text = text.replace(/```json\n?/g, '').replace(/\n?```/g, '');
            } else if (text.includes('```')) {
                text = text.replace(/```\n?/g, '').replace(/\n?```/g, '');
            }
            
            // Trim any extra whitespace
            text = text.trim();
            console.log("13. Cleaned text, attempting JSON parse...");
            
            // Parse the JSON response from Gemini
            const suggestions = JSON.parse(text);
            console.log("14. JSON parsed successfully, suggestions count:", suggestions.length);
            
            res.status(200).json({ 
                success: true, 
                data: suggestions,
                farmInfo: {
                    location: farm.location,
                    area: farm.area
                }
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