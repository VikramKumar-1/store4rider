import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddressId: z.string(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
