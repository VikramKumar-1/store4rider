import { UserRepository } from "./user.repository";
import { IUser, IUserAddress } from "@store4riders/shared-types";
import { NotFoundError } from "../../core/errors/AppError";

export class UserService {
  static async getProfile(userId: string): Promise<IUser> {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static async updateProfile(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await UserRepository.update(userId, data);
    if (!user) throw new NotFoundError("User");
    return user;
  }

  static async addAddress(userId: string, address: IUserAddress): Promise<IUser> {
    const user = await this.getProfile(userId);
    address.id = crypto.randomUUID();
    if (address.isDefault) {
      user.addresses.forEach(a => (a.isDefault = false));
    } else if (user.addresses.length === 0) {
      address.isDefault = true;
    }
    user.addresses.push(address);
    return await this.updateProfile(userId, { addresses: user.addresses });
  }

  static async removeAddress(userId: string, addressId: string): Promise<IUser> {
    const user = await this.getProfile(userId);
    user.addresses = user.addresses.filter(a => a.id !== addressId);
    return await this.updateProfile(userId, { addresses: user.addresses });
  }
}
