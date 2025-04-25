import mongoose, { Schema } from "mongoose";

const ListSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("List", ListSchema);
