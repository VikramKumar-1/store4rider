import { NextRequest } from "next/server";
import { UserService } from "./user.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { updateProfileSchema, addressSchema } from "@store4riders/shared-validation";
import { IUserAddress } from "@store4riders/shared-types";

export class UserController {
  static async getProfile(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const user = await UserService.getProfile(userId);
    return ApiResponse.success(user);
  }

  static async updateProfile(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);
    const user = await UserService.updateProfile(userId, validatedData);
    return ApiResponse.success(user, "Profile updated successfully");
  }

  static async addAddress(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = addressSchema.parse(body) as IUserAddress;
    const user = await UserService.addAddress(userId, validatedData);
    return ApiResponse.success(user, "Address added successfully");
  }
}
