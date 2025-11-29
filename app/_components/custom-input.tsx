import { cn } from "@/lib/utils";

import { ReactNode } from "react";

export default function CustomInput({
  className,
  type,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute start-4 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "p-4 rounded-[8px]  bg-[#FFFFFF66] file:text-foreground placeholder:capitalize placeholder:text-[#62626B] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-[#FFFFFF] border-[1px] flex h-[57px] w-full min-w-0 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
          icon ? "ps-[52px]" : "p-4"
        )}
        {...props}
      />
    </div>
  );
}
