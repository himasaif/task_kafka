
import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    action: { type: String, required: true },
    metadata: { type: Object, default: {} },
    processedAt: { type: Date },
  },
  { timestamps: true } 
);

userLogSchema.index({ userId: 1, createdAt: -1 });
userLogSchema.index({ action: 1, createdAt: -1 });

const UserLog = mongoose.model("UserLog", userLogSchema);

export default UserLog;
