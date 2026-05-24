import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export function Select({ className, label, error, helperText, id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  const descriptionId = selectId ? `${selectId}-description` : undefined;

  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground" htmlFor={selectId}>
      {label}
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={cn(
          "h-11 rounded-2xl border border-line bg-surface px-4 text-sm text-foreground shadow-sm transition focus:border-sunrise focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {(error || helperText) && (
        <span id={descriptionId} className={cn("text-xs font-medium", error ? "text-danger" : "text-stone")}>
          {error ?? helperText}
        </span>
      )}
    </label>
  );
}