import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema(
  {
    duration: { type: Number, required: true },
    protocol_type: { type: String, required: true },
    service: { type: String, required: true },
    flag: { type: String, required: true },
    src_bytes: { type: Number, required: true },
    dst_bytes: { type: Number, required: true },
    count: { type: Number, required: true },
    srv_count: { type: Number, required: true },
    dst_host_count: { type: Number, required: true },
    attack_label: { type: String, required: true },
    difficulty: { type: Number, required: true },
    classification: { type: String, enum: ['Normal Traffic', 'Attack'], required: true }
  },
  { timestamps: true }
);

export const Log = mongoose.model('Log', LogSchema);


