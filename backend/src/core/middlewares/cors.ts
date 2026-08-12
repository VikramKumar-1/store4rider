import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://store4rider.vercel.app",
  "https://store4rider-frontend.vercel.app"
];

export const applyCors = (req: NextRequest, res: NextResponse): NextResponse => {
  const origin = req.headers.get("origin") || "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".vercel.app");
  
  res.headers.set("Access-Control-Allow-Origin", isAllowed ? origin : ALLOWED_ORIGINS[0]);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-request-id");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
};
