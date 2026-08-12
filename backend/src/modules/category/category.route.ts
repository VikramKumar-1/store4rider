import { NextRequest, NextResponse } from "next/server";
import { CategoryController } from "./category.controller";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { checkAdmin } from "../../core/middlewares/admin";

export async function categoryRouter(req: NextRequest, routePath: string[]): Promise<NextResponse | null> {
  const method = req.method;
  const pathLen = routePath.length;

  if (method === "GET" && pathLen === 1 && routePath[0] === "tree") {
    return await CategoryController.getTree(req);
  }

  if (method === "POST" && pathLen === 0) {
    const userId = extractUserFromAuth(req);
    await checkAdmin(userId, async () => "admin");
    return await CategoryController.create(req);
  }

  return null;
}
