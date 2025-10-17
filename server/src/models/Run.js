// server/models/Run.js
import mongoose from 'mongoose';

const RunSchema = new mongoose.Schema({
  // raw fields
  datetime: Date,
  vol_start: Number,
  pressure_psi: Number,
  first_cycle: Number,
  vol_press_out: Number,
  recipe_id: Number,
  vol_glaze_out: Number,
  max_temp: Number,
  cooling_profile: Number,
  moisture_pct: Number,
  external_humidity: Number,
  air_flow_top_setting: Number,
  air_cooling: Number,
  thickness_mm: Number,
  vol_kiln_out: Number,
  vol_sort_out: Number,

  // derived
  stageLossKg: [Number],  // [start, press, glaze, kiln, sort]
  ratios: {
    press: Number, glaze: Number, kiln: Number, sort: Number
  },
  yield_total: Number,
  sort_flag: String
}, { timestamps: true });

export default mongoose.model('Run', RunSchema);