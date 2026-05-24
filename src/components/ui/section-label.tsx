import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone shadow-sm",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </span>
  );
}
