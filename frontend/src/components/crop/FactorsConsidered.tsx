import { CheckCircle2 } from "lucide-react";
import type { CropFactor } from "../../types";

export default function FactorsConsidered({ factors }: { factors: CropFactor[] }) {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {factors.map((f) => (
        <li key={f.label} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3.5">
          <CheckCircle2 className="h-4.5 w-4.5 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-ink">{f.label}</p>
            <p className="text-xs text-ink-soft mt-0.5">{f.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
