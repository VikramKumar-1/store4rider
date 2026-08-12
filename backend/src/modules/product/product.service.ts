import { ProductRepository } from "./product.repository";
import { IProduct } from "@store4riders/shared-types";
import { NotFoundError } from "../../core/errors/AppError";
import { indexProduct } from "../../core/search/meilisearch";
import { slugify } from "@store4riders/shared-utils";

export class ProductService {
  /**
   * Gets a paginated list of products.
   */
  static async getProducts(filters: Record<string, unknown>, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const items = await ProductRepository.findAll(filters, skip, limit);
    const totalCount = await ProductRepository.count(filters);
    return { items, totalCount };
  }

  /**
   * Gets a single product by slug.
   */
  static async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) throw new NotFoundError("Product");
    return product;
  }

  /**
   * Creates a new product and syncs it to Meilisearch.
   */
  static async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const slug = slugify(data.name || "");
    const productData = { ...data, slug };
    const product = await ProductRepository.create(productData);
    
    // Sync to search index
    await indexProduct(product);
    
    return product;
  }

  /**
   * Updates an existing product.
   */
  static async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct> {
    if (data.name) {
      data.slug = slugify(data.name);
    }
    const product = await ProductRepository.update(id, data);
    if (!product) throw new NotFoundError("Product");
    
    // Sync to search index
    await indexProduct(product);
    
    return product;
  }

  /**
   * Deletes a product.
   */
  static async deleteProduct(id: string): Promise<void> {
    const product = await ProductRepository.findById(id);
    if (!product) throw new NotFoundError("Product");
    await ProductRepository.delete(id);
  }
}
