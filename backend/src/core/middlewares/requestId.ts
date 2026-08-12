import { NextRequest, NextResponse } from "next/server";

export const applyRequestId = (req: NextRequest, res: NextResponse): NextResponse => {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  res.headers.set("x-request-id", reqId);
  return res;
};
