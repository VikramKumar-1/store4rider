import { NextRequest, NextResponse } from "next/server";
import { ProductController } from "./product.controller";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { checkAdmin } from "../../core/middlewares/admin";

export async function productRouter(req: NextRequest, routePath: string[]): Promise<NextResponse | null> {
  const method = req.method;
  const pathLen = routePath.length;

  // GET /api/products
  if (method === "GET" && pathLen === 0) {
    return await ProductController.list(req);
  }
  
  // POST /api/products (Admin)
  if (method === "POST" && pathLen === 0) {
    const userId = extractUserFromAuth(req);
    // Mock role fetch for now
    await checkAdmin(userId, async () => "admin"); 
    return await ProductController.create(req);
  }

  if (pathLen === 1) {
    const param = routePath[0];
    
    // GET /api/products/:slug
    if (method === "GET") {
      return await ProductController.getBySlug(req, param);
    }
    
    // PUT /api/products/:id (Admin)
    if (method === "PUT") {
      const userId = extractUserFromAuth(req);
      await checkAdmin(userId, async () => "admin");
      return await ProductController.update(req, param);
    }
    
    // DELETE /api/products/:id (Admin)
    if (method === "DELETE") {
      const userId = extractUserFromAuth(req);
      await checkAdmin(userId, async () => "admin");
      return await ProductController.delete(req, param);
    }
  }

  return null; // Route not matched
}
