import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem } from "@store4riders/shared-types";

const orderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  variantId: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    status: { type: String, required: true, default: "pending" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddressId: { type: String, required: true },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    paymentSignature: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
