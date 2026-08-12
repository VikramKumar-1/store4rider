import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { registerSchema, loginSchema } from "@store4riders/shared-validation";

const isProd = process.env.NODE_ENV === "production";

const setCookies = (res: NextResponse, accessToken: string, refreshToken: string) => {
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60, // 15 mins
  });
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
};

const clearCookies = (res: NextResponse) => {
  res.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
  res.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });
};

export class AuthController {
  static async register(req: NextRequest) {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);
    const tokens = await AuthService.register(validatedData);
    
    const res = ApiResponse.success(null, "Registered successfully", 201);
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    return res;
  }

  static async login(req: NextRequest) {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const tokens = await AuthService.login(validatedData);

    const res = ApiResponse.success(null, "Logged in successfully");
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    return res;
  }

  static async refresh(req: NextRequest) {
    const oldRefreshToken = req.cookies.get("refreshToken")?.value;
    if (!oldRefreshToken) return ApiResponse.error("No refresh token", 401);

    const tokens = await AuthService.refreshToken(oldRefreshToken);
    
    const res = ApiResponse.success(null, "Token refreshed");
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    return res;
  }

  static async logout(req: NextRequest) {
    // Note: We'd extract userId if we're blacklisting
    const res = ApiResponse.success(null, "Logged out successfully");
    clearCookies(res);
    return res;
  }
}
