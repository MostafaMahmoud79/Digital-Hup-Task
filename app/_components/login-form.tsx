"use client";

import { useForm } from "react-hook-form";
import { Mail, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/server/actions/login-action";
import { Form } from "@/components/ui/form";
import clsx from "clsx";
import CustomInputField from "./custom-input-field";
import { useAuthStore } from "@/store/auth-store";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  
  const form = useForm<FormValues>({
    defaultValues: {
      email: "admin@example.com",
      password: "123456",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await loginAction(values);
    if (response.status === "success") {
      console.log("User data:", response.user);
      

      setUser(response.user);
      
      router.replace("/dashboard");
    } else {
      alert(response.error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 w-full">
        <div className="space-y-5">
          <CustomInputField
            control={form.control}
            name="email"
            placeholder="email (try: admin@example.com)"
            icon={<Mail className="size-6 text-[#1A1A1E]" />}
          />
          <CustomInputField
            type="password"
            control={form.control}
            name="password"
            placeholder="password"
            icon={<LockKeyhole className="size-6 text-[#1A1A1E]" />}
          />
        </div>

        <button
          type="submit"
          className={clsx(
            "rounded-[8px] text-white w-full py-3 px-5 capitalize bg-[#9414FF] hover:bg-[#7d0fe6] transition"
          )}
        >
          Login
        </button>
        
        <div className="text-xs text-center text-gray-500 mt-4">
          <p>Try: admin@example.com (Admin)</p>
          <p>manager@example.com (Project Manager)</p>
          <p>dev@example.com (Developer)</p>
        </div>
      </form>
    </Form>
  );
}