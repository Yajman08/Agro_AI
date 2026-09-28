import ConfidenceBar from "../common/ConfidenceBar";
import Card from "../common/Card";
import type { CropOption } from "../../types";

export default function CropAlternative({ option }: { option: CropOption }) {
  return (
    <Card>
      <p className="font-semibold text-ink mb-3">{option.crop}</p>
      <ConfidenceBar value={option.confidencePct} tone="sienna" />
      <ul className="mt-3 space-y-1 text-sm text-ink-soft">
        {option.reasons.map((r) => (
          <li key={r} className="flex gap-2">
            <span className="text-forest-500">•</span>
            {r}
          </li>
        ))}
      </ul>
    </Card>
  );
}
