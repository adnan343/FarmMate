import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        landSize: {
            type: String,
            required: true,
        },
        soilType: {
            type: String,
            required: true,
        },
        mapView: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const Farm = mongoose.model('Farm', farmSchema);

export default Farm;