import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const FarmConditionSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  photo: {
    url: {
      type: String,
      required: true
    },
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  weatherType: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy', 'windy'],
    required: true
  },
  soilType: {
    type: String,
    enum: ['sandy', 'loamy', 'clay', 'silt', 'chalky', 'peaty'],
    required: true
  },
  plantStatus: {
    type: String,
    enum: ['healthy', 'stressed', 'diseased', 'pest_infested', 'nutrient_deficient', 'overwatered', 'underwatered'],
    required: true
  },
  additionalNotes: {
    type: String,
    maxLength: 1000
  },
  aiSuggestions: {
    recommendations: [{
      type: String,
      enum: ['irrigation', 'fertilization', 'pest_control', 'disease_treatment', 'soil_amendment', 'pruning', 'harvesting', 'other']
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    description: String,
    estimatedCost: {
      type: Number,
      min: 0
    },
    timeToImplement: {
      type: String,
      enum: ['immediate', 'within_week', 'within_month', 'seasonal']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'ignored'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient querying
FarmConditionSchema.index({ farmer: 1, reportDate: -1 });
FarmConditionSchema.index({ farm: 1, reportDate: -1 });
FarmConditionSchema.index({ status: 1 });

// Add pagination plugin
FarmConditionSchema.plugin(mongoosePaginate);

const FarmCondition = mongoose.model('FarmCondition', FarmConditionSchema);

export default FarmCondition;
