import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "../../core/storage/s3";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { AppError } from "../../core/errors/AppError";

export class UploadController {
  static async getPresignedUrl(req: NextRequest) {
    // Requires Auth
    extractUserFromAuth(req);

    const body = await req.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      throw new AppError("fileName and fileType are required", 400);
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(fileType)) {
      throw new AppError("Invalid file type. Only jpg, png, and webp are allowed.", 400);
    }

    const url = await getPresignedUrl(fileName, fileType);
    return ApiResponse.success({ url });
  }
}
