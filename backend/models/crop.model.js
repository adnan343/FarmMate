import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    variety: {
        type: String,
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    area: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['acres', 'hectares', 'square_meters'],
        default: 'acres'
    },
    plantingDate: {
        type: Date,
        required: true
    },
    expectedHarvestDate: {
        type: Date,
        required: true
    },
    stage: {
        type: String,
        required: true,
        enum: ['planning', 'planting', 'growing', 'flowering', 'fruiting', 'harvest', 'harvested'],
        default: 'planning'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed'],
        default: 'active'
    },
    notes: {
        type: String,
        default: ''
    },
    estimatedYield: {
        type: Number,
        min: 0
    },
    yieldUnit: {
        type: String,
        enum: ['kg', 'lb', 'tons', 'bushels'],
        default: 'kg'
    },
    isHarvested: {
        type: Boolean,
        default: false
    },
    harvestDate: {
        type: Date
    },
    actualYield: {
        type: Number,
        min: 0
    },
    // Original suggestion snapshot (if crop was created from AI suggestion)
    acceptedSuggestion: {
        cropName: String,
        expectedYield: String,
        plantingWindow: String,
        reason: String
    },
    // Timeline of recommended tasks throughout the crop cycle
    timeline: [
        {
            title: { type: String, required: true },
            category: {
                type: String,
                enum: [
                    'soil_preparation',
                    'planting',
                    'watering',
                    'irrigation',
                    'fertilizing',
                    'weeding',
                    'pest_control',
                    'monitoring',
                    'pruning',
                    'harvest',
                    'other'
                ],
                default: 'other'
            },
            description: { type: String, default: '' },
            startDate: { type: Date },
            endDate: { type: Date },
            dueDate: { type: Date },
            frequency: { type: String, default: '' },
            completed: { type: Boolean, default: false },
            notes: { type: String, default: '' }
        }
    ],
    // Total cost for this crop (inputs, labor, etc.) recorded at harvest
    totalCost: {
        type: Number,
        min: 0,
        default: 0
    },
    // AI predicted yield generated from available information (e.g., crop, area, farm location)
    predictedYield: {
        type: Number,
        min: 0
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, {
    timestamps: true
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop; 