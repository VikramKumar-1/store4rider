import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "./category.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { createCategorySchema } from "@store4riders/shared-validation";

export class CategoryController {
  static async getTree(req: NextRequest) {
    const tree = await CategoryService.getCategoryTree();
    return ApiResponse.success(tree);
  }

  static async create(req: NextRequest) {
    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);
    const category = await CategoryService.createCategory(validatedData);
    return ApiResponse.success(category, "Category created", 201);
  }
}
