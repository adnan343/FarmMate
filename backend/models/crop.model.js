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