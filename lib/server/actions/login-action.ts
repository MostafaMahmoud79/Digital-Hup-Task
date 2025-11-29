"use server";

import {
  LoginFormInputs,
  loginFormSchema,
} from "@/lib/validation/login-schema";
import { cookies } from "next/headers";

type SuccessRes = {
  status: "success";
  message: string;
  token: string;
  user: {
    email: string;
    role: "Admin" | "ProjectManager" | "Developer";
  };
};

type FailedRes = {
  status: "validationError" | "error";
  error: {
    status: number;
    message: string;
  };
};

type ActionResponse = Promise<SuccessRes | FailedRes>;

export async function loginAction(inputs: LoginFormInputs): ActionResponse {
  const result = loginFormSchema.safeParse(inputs);

  if (!result.success) {
    return {
      status: "validationError",
      error: {
        message: "Please provide valid email and password.",
        status: 400,
      },
    };
  }

  const data = result.data;

  try {
    let role: "Admin" | "ProjectManager" | "Developer" = "Developer";
    
    if (data.email.includes("admin")) {
      role = "Admin";
    } else if (data.email.includes("manager")) {
      role = "ProjectManager";
    }

    const fakeToken = `fake-jwt-${role}-${Date.now()}`;
    const userInfo = { email: data.email, role };

 
    const oneWeek = 60 * 60 * 24 * 7; 

    (await cookies()).set({
      name: "jwt",
      value: fakeToken,
      httpOnly: true,
      secure: true,
      maxAge: oneWeek,
    });

    (await cookies()).set({
      name: "userRole",
      value: role,
      httpOnly: true,
      secure: true,
      maxAge: oneWeek,
    });

    return {
      status: "success",
      message: "Successfully Logged In.",
      token: fakeToken,
      user: userInfo,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: {
        message: "Internal Server Error!",
        status: 500,
      },
    };
  }
}
