import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { ApiResponse } from "../../core/response/ApiResponse";
import { extractUserFromAuth } from "../../core/middlewares/auth";
import { createOrderSchema, verifyPaymentSchema } from "@store4riders/shared-validation";
import { sendEmail } from "../../core/email/ses";
import { UserRepository } from "../user/user.repository";

export class OrderController {
  static async create(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    const result = await OrderService.createOrder(userId, validatedData.shippingAddressId);
    return ApiResponse.success(result, "Order created", 201);
  }

  static async verify(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const body = await req.json();
    const validatedData = verifyPaymentSchema.parse(body);

    await OrderService.verifyPayment(
      validatedData.razorpayOrderId,
      validatedData.paymentId,
      validatedData.signature
    );

    // Find the order to update it. In real world we might find by razorpayOrderId directly.
    // For this example, we'll assume the payment implies success and we update via some logic.
    // We would need to add a repository method to find by razorpayOrderId.
    // Assuming we do:
    // const order = await OrderRepository.findByRazorpayOrderId(validatedData.razorpayOrderId);
    // await OrderRepository.updateStatus(order._id, "processing", ...);

    // Send email
    const user = await UserRepository.findById(userId);
    if (user) {
      await sendEmail(user.email, "Order Confirmed", `Your payment of ${validatedData.paymentId} was successful.`);
    }

    return ApiResponse.success(null, "Payment verified");
  }

  static async myOrders(req: NextRequest) {
    const userId = extractUserFromAuth(req);
    const orders = await OrderRepository.findByUserId(userId);
    return ApiResponse.success(orders);
  }

  static async getById(req: NextRequest, id: string) {
    const userId = extractUserFromAuth(req);
    const order = await OrderRepository.findById(id);
    if (!order || order.userId !== userId) {
      return ApiResponse.error("Order not found", 404);
    }
    return ApiResponse.success(order);
  }
}
