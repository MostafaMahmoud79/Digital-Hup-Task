"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "Admin" | "ProjectManager" | "Developer";

type AuthState = {
  user: {
    email: string;
    role: UserRole;
  } | null;
  setUser: (user: { email: string; role: UserRole } | null) => void;
  isAdmin: () => boolean;
  isProjectManager: () => boolean;
  isDeveloper: () => boolean;
  canEditProjects: () => boolean;
  canDeleteProjects: () => boolean;
  canManageTasks: () => boolean;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      isAdmin: () => get().user?.role === "Admin",

      isProjectManager: () => get().user?.role === "ProjectManager",

      isDeveloper: () => get().user?.role === "Developer",


      canEditProjects: () => {
        const role = get().user?.role;
        return role === "Admin" || role === "ProjectManager";
      },


      canDeleteProjects: () => get().user?.role === "Admin",


      canManageTasks: () => !!get().user,
    }),
    {
      name: "auth-storage",
    }
  )
);