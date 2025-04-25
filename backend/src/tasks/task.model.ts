import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    dueDate: { type: Date, required: true },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: false,
    },
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
      required: true,
    },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, listId: 1 });

export default mongoose.model("Task", TaskSchema);
