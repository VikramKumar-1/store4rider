import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  const filePath = "C:\\Users\\vikur\\.gemini\\antigravity\\brain\\998cdfef-3e8f-40f2-be3a-b697310dfadc\\.user_uploaded\\media_1786437128656.png";
  
  try {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (e) {
    // Fallback
  }

  return NextResponse.redirect("https://images.unsplash.com/photo-1578632767115-351597cf2477?q=75&w=800&auto=format&fit=crop");
}
