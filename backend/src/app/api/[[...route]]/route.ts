import { NextRequest, NextResponse } from "next/server";
import { centralRouter } from "@/router";
import { applyCors } from "@/core/middlewares/cors";
import { applySecurityHeaders } from "@/core/middlewares/security";
import { applyRequestId } from "@/core/middlewares/requestId";
import { errorHandler } from "@/core/middlewares/errorHandler";
import { connectToDatabase } from "@/core/database/connection";

const applyHeaders = (response: NextResponse, req: NextRequest): NextResponse => {
  applyCors(response);
  applySecurityHeaders(response);
  applyRequestId(req, response);
  return response;
};

const handleRequest = async (
  req: NextRequest, 
  props: { params: Promise<{ route?: string[] }> }
) => {
  try {
    await connectToDatabase();
    
    const resolvedParams = await props.params;
    const routePath = resolvedParams?.route || [];
    
    // Handle OPTIONS (Preflight)
    if (req.method === "OPTIONS") {
      const res = new NextResponse(null, { status: 204 });
      return applyHeaders(res, req);
    }
    
    // Route to Central Router
    let res = await centralRouter(req, routePath);
    
    if (!res) {
      res = NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return applyHeaders(res, req);
  } catch (error) {
    const errorRes = errorHandler(error);
    return applyHeaders(errorRes, req);
  }
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
