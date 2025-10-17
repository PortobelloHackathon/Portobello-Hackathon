import mongoose from 'mongoose';

export const STAGES = ['Start', 'Press', 'Glaze', 'Kiln', 'Sort'];

const LossEventSchema = new mongoose.Schema(
  {
    stage: { type: String, enum: STAGES, required: true },
    kg: { type: Number, required: true, min: 0 },
    at: { type: Date, default: Date.now }, // when it occurred
  },
  { timestamps: true }
);

export default mongoose.model('LossEvent', LossEventSchema);