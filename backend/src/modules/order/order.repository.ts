import { OrderModel } from "./order.model";
import { IOrder } from "@store4riders/shared-types";

export class OrderRepository {
  static async create(data: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(data);
    return (await order.save()).toObject() as IOrder;
  }

  static async findByUserId(userId: string): Promise<IOrder[]> {
    return OrderModel.find({ userId }).sort({ createdAt: -1 }).lean().exec() as unknown as IOrder[];
  }

  static async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id).lean().exec() as unknown as IOrder | null;
  }

  static async updateStatus(id: string, status: string, razorpayData?: any): Promise<IOrder | null> {
    const update: any = { status };
    if (razorpayData) {
      update.paymentId = razorpayData.paymentId;
      update.paymentSignature = razorpayData.paymentSignature;
    }
    return OrderModel.findByIdAndUpdate(id, update, { new: true }).lean().exec() as unknown as IOrder | null;
  }
}
