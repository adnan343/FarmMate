import FarmCondition from '../models/farmCondition.model.js';
import User from '../models/user.model.js';
import Farm from '../models/farm.model.js';

// AI suggestion logic based on weather, soil, and plant status
const generateAISuggestions = (weatherType, soilType, plantStatus, additionalNotes = '') => {
  const suggestions = {
    recommendations: [],
    priority: 'medium',
    description: '',
    estimatedCost: 0,
    timeToImplement: 'within_week'
  };

  // Base recommendations based on plant status
  switch (plantStatus) {
    case 'healthy':
      suggestions.recommendations = ['fertilization'];
      suggestions.priority = 'low';
      suggestions.description = 'Plants appear healthy. Consider regular fertilization to maintain optimal growth.';
      suggestions.estimatedCost = 50;
      suggestions.timeToImplement = 'within_month';
      break;
    
    case 'stressed':
      suggestions.recommendations = ['irrigation', 'fertilization'];
      suggestions.priority = 'medium';
      suggestions.description = 'Plants show signs of stress. Increase irrigation and consider light fertilization.';
      suggestions.estimatedCost = 100;
      suggestions.timeToImplement = 'within_week';
      break;
    
    case 'diseased':
      suggestions.recommendations = ['disease_treatment', 'pruning'];
      suggestions.priority = 'high';
      suggestions.description = 'Disease detected. Immediate treatment and pruning of affected areas recommended.';
      suggestions.estimatedCost = 200;
      suggestions.timeToImplement = 'immediate';
      break;
    
    case 'pest_infested':
      suggestions.recommendations = ['pest_control'];
      suggestions.priority = 'high';
      suggestions.description = 'Pest infestation detected. Implement pest control measures immediately.';
      suggestions.estimatedCost = 150;
      suggestions.timeToImplement = 'immediate';
      break;
    
    case 'nutrient_deficient':
      suggestions.recommendations = ['fertilization', 'soil_amendment'];
      suggestions.priority = 'medium';
      suggestions.description = 'Nutrient deficiency observed. Apply appropriate fertilizers and consider soil amendments.';
      suggestions.estimatedCost = 120;
      suggestions.timeToImplement = 'within_week';
      break;
    
    case 'overwatered':
      suggestions.recommendations = ['irrigation'];
      suggestions.priority = 'medium';
      suggestions.description = 'Overwatering detected. Reduce irrigation frequency and improve drainage.';
      suggestions.estimatedCost = 80;
      suggestions.timeToImplement = 'immediate';
      break;
    
    case 'underwatered':
      suggestions.recommendations = ['irrigation'];
      suggestions.priority = 'high';
      suggestions.description = 'Underwatering detected. Increase irrigation frequency immediately.';
      suggestions.estimatedCost = 60;
      suggestions.timeToImplement = 'immediate';
      break;
  }

  // Adjust based on weather conditions
  if (weatherType === 'rainy' || weatherType === 'stormy') {
    if (suggestions.recommendations.includes('irrigation')) {
      suggestions.recommendations = suggestions.recommendations.filter(rec => rec !== 'irrigation');
    }
    if (plantStatus === 'overwatered') {
      suggestions.priority = 'urgent';
      suggestions.description += ' Heavy rainfall detected - urgent drainage improvement needed.';
      suggestions.estimatedCost += 100;
    }
  }

  if (weatherType === 'sunny' && plantStatus === 'underwatered') {
    suggestions.priority = 'urgent';
    suggestions.description += ' Hot weather detected - immediate irrigation critical.';
    suggestions.estimatedCost += 50;
  }

  // Adjust based on soil type
  if (soilType === 'clay' && plantStatus === 'overwatered') {
    suggestions.recommendations.push('soil_amendment');
    suggestions.description += ' Clay soil detected - consider adding organic matter for better drainage.';
    suggestions.estimatedCost += 80;
  }

  if (soilType === 'sandy' && plantStatus === 'underwatered') {
    suggestions.description += ' Sandy soil detected - may require more frequent irrigation.';
    suggestions.estimatedCost += 30;
  }

  // Check for urgent conditions
  if (plantStatus === 'diseased' || plantStatus === 'pest_infested') {
    suggestions.priority = 'urgent';
    suggestions.timeToImplement = 'immediate';
  }

  // Add harvesting recommendation if plants are healthy and weather is good
  if (plantStatus === 'healthy' && (weatherType === 'sunny' || weatherType === 'cloudy')) {
    suggestions.recommendations.push('harvesting');
    suggestions.description += ' Consider harvesting if crops are mature.';
  }

  return suggestions;
};

export const createFarmCondition = async (req, res) => {
  try {
    const { farmId, photoUrl, photoCaption, weatherType, soilType, plantStatus, additionalNotes } = req.body;
    const farmerId = req.user._id;

    // Validate required fields
    if (!farmId || !photoUrl || !weatherType || !soilType || !plantStatus) {
      return res.status(400).json({
        success: false,
        msg: 'Missing required fields: farmId, photoUrl, weatherType, soilType, plantStatus'
      });
    }

    // Verify farm belongs to farmer (for now, allow placeholder farm IDs for testing)
    if (farmId && !farmId.startsWith('507f1f77bcf86cd79943901')) {
      const farm = await Farm.findById(farmId);
      if (!farm) {
        return res.status(404).json({
          success: false,
          msg: 'Farm not found'
        });
      }

      if (farm.farmer.toString() !== farmerId.toString()) {
        return res.status(403).json({
          success: false,
          msg: 'You can only create reports for your own farms'
        });
      }
    }

    // Generate AI suggestions
    const aiSuggestions = generateAISuggestions(weatherType, soilType, plantStatus, additionalNotes);

    // Create farm condition report
    const farmCondition = new FarmCondition({
      farmer: farmerId,
      farm: farmId,
      photo: {
        url: photoUrl,
        caption: photoCaption || ''
      },
      weatherType,
      soilType,
      plantStatus,
      additionalNotes: additionalNotes || '',
      aiSuggestions
    });

    await farmCondition.save();

    // Populate farm and farmer details for response
    if (!farmId.startsWith('507f1f77bcf86cd79943901')) {
      await farmCondition.populate([
        { path: 'farm', select: 'name location' },
        { path: 'farmer', select: 'name email' }
      ]);
    } else {
      // For placeholder farm IDs, populate only farmer
      await farmCondition.populate([
        { path: 'farmer', select: 'name email' }
      ]);
    }

    res.status(201).json({
      success: true,
      msg: 'Farm condition report created successfully',
      data: farmCondition
    });
  } catch (error) {
    console.error('Error creating farm condition report:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};

export const getFarmerFarmConditions = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { farmer: farmerId };
    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { reportDate: -1 },
      populate: [
        { path: 'farm', select: 'name location' },
        { path: 'farmer', select: 'name email' }
      ]
    };

    const farmConditions = await FarmCondition.paginate(query, options);

    res.status(200).json({
      success: true,
      data: farmConditions
    });
  } catch (error) {
    console.error('Error fetching farm conditions:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};

export const getFarmCondition = async (req, res) => {
  try {
    const { reportId } = req.params;
    const farmerId = req.user._id;

    const farmCondition = await FarmCondition.findOne({
      _id: reportId,
      farmer: farmerId
    }).populate([
      { path: 'farm', select: 'name location' },
      { path: 'farmer', select: 'name email' }
    ]);

    if (!farmCondition) {
      return res.status(404).json({
        success: false,
        msg: 'Farm condition report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: farmCondition
    });
  } catch (error) {
    console.error('Error fetching farm condition:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};

export const updateFarmConditionStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const farmerId = req.user._id;

    if (!status) {
      return res.status(400).json({
        success: false,
        msg: 'Status is required'
      });
    }

    const farmCondition = await FarmCondition.findOneAndUpdate(
      {
        _id: reportId,
        farmer: farmerId
      },
      { status },
      { new: true }
    ).populate([
      { path: 'farm', select: 'name location' },
      { path: 'farmer', select: 'name email' }
    ]);

    if (!farmCondition) {
      return res.status(404).json({
        success: false,
        msg: 'Farm condition report not found'
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Status updated successfully',
      data: farmCondition
    });
  } catch (error) {
    console.error('Error updating farm condition status:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};

export const deleteFarmCondition = async (req, res) => {
  try {
    const { reportId } = req.params;
    const farmerId = req.user._id;

    const farmCondition = await FarmCondition.findOneAndDelete({
      _id: reportId,
      farmer: farmerId
    });

    if (!farmCondition) {
      return res.status(404).json({
        success: false,
        msg: 'Farm condition report not found'
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Farm condition report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting farm condition:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};

export const getFarmConditionStats = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const stats = await FarmCondition.aggregate([
      { $match: { farmer: farmerId } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          urgentReports: {
            $sum: { $cond: [{ $eq: ['$aiSuggestions.priority', 'urgent'] }, 1, 0] }
          },
          highPriorityReports: {
            $sum: { $cond: [{ $eq: ['$aiSuggestions.priority', 'high'] }, 1, 0] }
          },
          completedReports: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingReports: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const plantStatusDistribution = await FarmCondition.aggregate([
      { $match: { farmer: farmerId } },
      {
        $group: {
          _id: '$plantStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const weatherDistribution = await FarmCondition.aggregate([
      { $match: { farmer: farmerId } },
      {
        $group: {
          _id: '$weatherType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalReports: 0,
          urgentReports: 0,
          highPriorityReports: 0,
          completedReports: 0,
          pendingReports: 0
        },
        plantStatusDistribution,
        weatherDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching farm condition stats:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error'
    });
  }
};
