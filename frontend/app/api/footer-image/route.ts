import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    // Reverted back to the exact panoramic crop the user loved (media_1786433428557.png)
    const userImagePath = "C:/Users/vikur/.gemini/antigravity/brain/998cdfef-3e8f-40f2-be3a-b697310dfadc/.user_uploaded/media_1786433428557.png";
    const fallbackPath = "C:/Users/vikur/.gemini/antigravity/brain/998cdfef-3e8f-40f2-be3a-b697310dfadc/.user_uploaded/media_1786432480719.jpg";
    
    const targetPath = fs.existsSync(userImagePath) ? userImagePath : fallbackPath;

    if (fs.existsSync(targetPath)) {
      const fileBuffer = fs.readFileSync(targetPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }
    
    return new NextResponse("Image not found", { status: 404 });
  } catch (error) {
    return new NextResponse("Error reading image", { status: 500 });
  }
}
