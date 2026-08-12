import { NextResponse } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const applyCors = (res: NextResponse): NextResponse => {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-request-id");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
};
