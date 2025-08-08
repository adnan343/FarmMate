import mongoose from 'mongoose';

const cropSuggestionSchema = new mongoose.Schema({
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
    suggestions: [{
        cropName: {
            type: String,
            required: true
        },
        expectedYield: {
            type: String,
            required: true
        },
        plantingWindow: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        }
    }],
    farmInfo: {
        location: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index to ensure one suggestion per farm
cropSuggestionSchema.index({ farm: 1 }, { unique: true });

const CropSuggestion = mongoose.model('CropSuggestion', cropSuggestionSchema);

export default CropSuggestion; 