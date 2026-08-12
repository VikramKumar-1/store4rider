import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "./coupon.service";
import { ApiResponse } from "../../core/response/ApiResponse";
import { createCouponSchema, validateCouponSchema } from "@store4riders/shared-validation";

export class CouponController {
  static async validate(req: NextRequest) {
    const body = await req.json();
    const validatedData = validateCouponSchema.parse(body);
    // In a real app we'd fetch cart total from DB based on userId
    // For this route, we assume cartTotal is passed, or we just validate it exists.
    const cartTotal = body.cartTotal || 0; 
    
    const result = await CouponService.validateCoupon(validatedData.code, cartTotal);
    return ApiResponse.success(result, "Coupon applied");
  }

  static async create(req: NextRequest) {
    const body = await req.json();
    const validatedData = createCouponSchema.parse(body);
    const coupon = await CouponService.createCoupon({
      ...validatedData,
      expiryDate: new Date(validatedData.expiryDate),
    } as any);
    return ApiResponse.success(coupon, "Coupon created", 201);
  }
}
