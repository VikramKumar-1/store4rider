import { NextResponse } from "next/server";

export const applySecurityHeaders = (res: NextResponse): NextResponse => {
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return res;
};
