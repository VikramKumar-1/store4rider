import mongoose, { Schema } from "mongoose";
import { ICategory } from "@store4riders/shared-types";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);
