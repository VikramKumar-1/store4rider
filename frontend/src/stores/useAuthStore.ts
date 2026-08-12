import { create } from "zustand";
import { IUser } from "@store4riders/shared-types";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  login: (user?: any, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: (user = { id: "1", email: "user@store4riders.com", firstName: "Rider", lastName: "User" }, token?: string) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
