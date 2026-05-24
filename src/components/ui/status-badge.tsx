import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
};

const tones: Record<StatusTone, string> = {
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  danger: "bg-danger/10 text-danger ring-danger/20",
  neutral: "bg-stone/10 text-stone ring-stone/20",
};

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
