import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  pest: { type: String, required: true },
  remedies: { type: [String], default: [] },
  treatment: { type: String, default: "" },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Detection = mongoose.model("Detection", detectionSchema);
