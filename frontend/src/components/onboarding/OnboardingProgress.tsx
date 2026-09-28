import { Check } from "lucide-react";
import { clsx } from "../../lib/clsx";

export default function OnboardingProgress({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels: string[];
}) {
  return (
    <div className="flex items-center justify-between max-w-md mx-auto mb-10">
      {Array.from({ length: total }).map((_, i) => {
        const index = i + 1;
        const done = index < step;
        const active = index === step;
        return (
          <div key={index} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  done && "bg-forest-700 text-white",
                  active && "bg-forest-50 text-forest-700 ring-2 ring-forest-700",
                  !done && !active && "bg-black/5 text-ink-soft"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index}
              </span>
              <span className="text-[11px] text-ink-soft hidden sm:block whitespace-nowrap">
                {labels[i]}
              </span>
            </div>
            {index < total && (
              <span
                className={clsx(
                  "h-px flex-1 mx-2",
                  done ? "bg-forest-700" : "bg-line"
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
