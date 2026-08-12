import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.number().min(0),
  minPurchase: z.number().min(0).default(0),
  expiryDate: z.string().datetime(),
  isActive: z.boolean().default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().toUpperCase(),
});
