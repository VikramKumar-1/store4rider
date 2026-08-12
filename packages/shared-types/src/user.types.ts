export interface IUserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "admin";
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}
