import Farm from "../models/farm.model.js";
import mongoose from "mongoose";

export const getFarms = async (req, res) => {
    try {
        const farms = await Farm.find({});
        res.status(200).json({success: true, data: farms});
    } catch (err) {
        console.log("error in fetching farms", err.message);
        res.status(500).json({success: false, message: "Server error"});
    }
}

export const addFarm = async (req, res) => {
    const farm = req.body; //user will send this data


    if (!farm.name || !farm.location || !farm.soilType || !farm.landSize || !farm.mapView) {
        return res.status(400).json({success: false, message: 'Provide all the inputs'});
    }

    const newFarm = new Farm(farm);

    try {
        await newFarm.save();
        res.status(201).json({success: true, farm: newFarm});
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
        await Farm.findByIdAndDelete(id);
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