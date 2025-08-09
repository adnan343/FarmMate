import Farm from "../models/farm.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getFarms = async (req, res) => {
    try {
        const farms = await Farm.find({}).populate('farmer', 'name email');
        res.status(200).json({success: true, data: farms});
    } catch (err) {
        console.log("error in fetching farms", err.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const getFarmsByFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(farmerId)) {
            return res.status(400).json({ success: false, message: 'Invalid farmer ID' });
        }

        const farms = await Farm.find({ farmer: farmerId }).populate('farmer', 'name email');
        res.status(200).json({success: true, data: farms});
    } catch (err) {
        console.log("error in fetching farms by farmer", err.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const addFarm = async (req, res) => {
    const farm = req.body; //user will send this data

    if (!farm.name || !farm.location || !farm.soilType || !farm.landSize || !farm.mapView || !farm.farmer) {
        return res.status(400).json({success: false, message: 'Provide all the inputs'});
    }

    const newFarm = new Farm(farm);

    try {
        await newFarm.save();
        
        // Add the farm to the user's farms array
        await User.findByIdAndUpdate(
            farm.farmer,
            { $push: { farms: newFarm._id } }
        );
        
        const populatedFarm = await Farm.findById(newFarm._id).populate('farmer', 'name email');
        res.status(201).json({success: true, farm: populatedFarm});
    } catch (err) {
        console.error("Error creating farm", err.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const deleteFarm = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: 'Farm not found'});
    }

    try {
        // Get the farm first to find the farmer
        const farm = await Farm.findById(id);
        if (!farm) {
            return res.status(404).json({success: false, message: 'Farm not found'});
        }
        
        // Delete the farm
        await Farm.findByIdAndDelete(id);
        
        // Remove the farm from the user's farms array
        await User.findByIdAndUpdate(
            farm.farmer,
            { $pull: { farms: id } }
        );
        
        res.status(200).json({success: true, message: 'Farm deleted successfully'});
    } catch (error) {
        console.error("Error deleting farm", error.message);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export const updateFarm = async (req, res) => {
    const {id} = req.params;

    const farm = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: 'Farm not found'});
    }

    try{
        const updatedFarm = await Farm.findByIdAndUpdate(id, farm, {new:true})
        res.status(200).json({success: true, data: updatedFarm});
    } catch {
        res.status(500).json({success: false, message: "Server error"});
    }
}