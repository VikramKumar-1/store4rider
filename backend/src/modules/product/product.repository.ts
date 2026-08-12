/**
 * @fileoverview Product Repository — Database Access Layer
 *
 * Handles all direct MongoDB/Mongoose operations for the Product entity.
 * This is the ONLY layer that should contain database-specific queries.
 * Services call this layer — controllers NEVER call this directly.
 *
 * @module modules/product
 * @layer Repository (Data Access)
 */

import { ProductModel } from "./product.model";
import { IProduct } from "@store4riders/shared-types";

export class ProductRepository {
  /**
   * Retrieves a paginated list of products.
   * @param filters - Query filters (categoryId, etc)
   * @param skip - Number of documents to skip
   * @param limit - Maximum number of documents to return
   * @returns Array of plain product objects
   */
  static async findAll(filters: Record<string, unknown>, skip: number, limit: number): Promise<IProduct[]> {
    return ProductModel.find(filters).skip(skip).limit(limit).lean().exec() as unknown as IProduct[];
  }

  /**
   * Counts total products for given filters.
   */
  static async count(filters: Record<string, unknown>): Promise<number> {
    return ProductModel.countDocuments(filters).exec();
  }

  /**
   * Finds a product by its unique slug.
   */
  static async findBySlug(slug: string): Promise<IProduct | null> {
    return ProductModel.findOne({ slug }).lean().exec() as unknown as IProduct | null;
  }

  /**
   * Finds a product by its ID.
   */
  static async findById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id).lean().exec() as unknown as IProduct | null;
  }

  /**
   * Creates a new product.
   */
  static async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(data);
    return (await product.save()).toObject() as IProduct;
  }

  /**
   * Updates an existing product.
   */
  static async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).lean().exec() as unknown as IProduct | null;
  }

  /**
   * Deletes a product.
   */
  static async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id).exec();
  }
}
