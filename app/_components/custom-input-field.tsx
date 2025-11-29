import { Control, FieldPath, FieldValues } from "react-hook-form";

import { HTMLInputTypeAttribute, ReactNode } from "react";

import CustomInput from "./custom-input";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>;
  name: TName;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
  icon?: ReactNode;
  className?: string;
};
export default function CustomInputField<
  T extends FieldValues = FieldValues,
  K extends FieldPath<T> = FieldPath<T>
>({ control, name, placeholder, type, icon, className }: Props<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">{field.name}</FormLabel>
          <FormControl>
            <CustomInput
              className={cn("bg-white", className)}
              icon={icon}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
