import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "./product.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { createProductSchema, updateProductSchema } from "@store4riders/shared-validation";

export class ProductController {
  static async list(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categoryId = searchParams.get("category");
    
    const filters: Record<string, unknown> = {};
    if (categoryId) filters.categoryId = categoryId;

    const { items, totalCount } = await ProductService.getProducts(filters, page, limit);
    return ApiResponse.paginated(items, totalCount, page, limit);
  }

  static async getBySlug(req: NextRequest, slug: string) {
    const product = await ProductService.getProductBySlug(slug);
    return ApiResponse.success(product);
  }

  static async create(req: NextRequest) {
    const body = await req.json();
    const validatedData = createProductSchema.parse(body);
    const product = await ProductService.createProduct(validatedData as any);
    return ApiResponse.success(product, "Product created successfully", 201);
  }

  static async update(req: NextRequest, id: string) {
    const body = await req.json();
    const validatedData = updateProductSchema.parse(body);
    const product = await ProductService.updateProduct(id, validatedData as any);
    return ApiResponse.success(product, "Product updated successfully");
  }

  static async delete(req: NextRequest, id: string) {
    await ProductService.deleteProduct(id);
    return ApiResponse.success(null, "Product deleted successfully");
  }
}
