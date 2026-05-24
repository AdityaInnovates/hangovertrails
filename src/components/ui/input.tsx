import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export function Input({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const descriptionId = inputId ? `${inputId}-description` : undefined;

  return (
    <label
      className="grid gap-2 text-sm font-semibold text-foreground"
      htmlFor={inputId}
    >
      {label}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={cn(
          "h-11 rounded-2xl border border-line bg-surface px-4 text-sm text-foreground shadow-sm transition placeholder:text-stone/70 focus:border-sunrise focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      />
      {(error || helperText) && (
        <span
          id={descriptionId}
          className={cn(
            "text-xs font-medium",
            error ? "text-danger" : "text-stone",
          )}
        >
          {error ?? helperText}
        </span>
      )}
    </label>
  );
}
