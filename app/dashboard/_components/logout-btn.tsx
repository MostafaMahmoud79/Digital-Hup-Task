"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/server/actions/logout-action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleLogout}
      className="bg-red-500 rounded-sm px-4 sm:px-8 py-2 text-white capitalize hover:bg-red-500/50 transition cursor-pointer w-full text-sm sm:text-base"
    >
      {isPending ? "logging out.." : "log out"}
    </Button>
  );
}