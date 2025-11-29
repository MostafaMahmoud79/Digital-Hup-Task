"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    (await cookies()).delete("jwt");
    return { status: "ok" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to logout" };
  }
}
