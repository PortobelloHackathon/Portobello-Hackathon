import mongoose from 'mongoose';

const KpiSnapshotSchema = new mongoose.Schema(
  {
    yieldPct:   { type: Number, min: 0, max: 100, required: true },
    scrapPct:   { type: Number, min: 0, max: 100, required: true },
    onTimePct:  { type: Number, min: 0, max: 100, required: true },
    at:         { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('KpiSnapshot', KpiSnapshotSchema);