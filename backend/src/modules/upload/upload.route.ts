import { NextRequest, NextResponse } from "next/server";
import { UploadController } from "./upload.controller";

export async function uploadRouter(req: NextRequest, routePath: string[]): Promise<NextResponse | null> {
  if (req.method === "POST" && routePath.length === 1 && routePath[0] === "presigned-url") {
    return await UploadController.getPresignedUrl(req);
  }

  return null;
}
