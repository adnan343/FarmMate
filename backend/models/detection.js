import mongoose from "mongoose";

const DetectionSchema = new mongoose.Schema(
  {
    pest: { type: String, required: true },
    remedies: [{ type: String }],
    treatment: { type: String, required: true },
    image: { type: String }, // store image path
  },
  { timestamps: true }
);

export default mongoose.model("Detection", DetectionSchema);
