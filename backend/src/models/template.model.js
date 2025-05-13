import mongoose from "mongoose";

const newSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model("Template", newSchema);
export default Template;
