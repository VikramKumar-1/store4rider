import { NextRequest, NextResponse } from "next/server";
import { OrderController } from "./order.controller";

export async function orderRouter(req: NextRequest, routePath: string[]): Promise<NextResponse | null> {
  const method = req.method;
  const pathLen = routePath.length;

  if (method === "POST" && pathLen === 0) {
    return await OrderController.create(req);
  }

  if (method === "POST" && pathLen === 1 && routePath[0] === "verify") {
    return await OrderController.verify(req);
  }

  if (method === "GET" && pathLen === 1 && routePath[0] === "me") {
    return await OrderController.myOrders(req);
  }

  if (method === "GET" && pathLen === 1) {
    return await OrderController.getById(req, routePath[0]);
  }

  return null;
}
