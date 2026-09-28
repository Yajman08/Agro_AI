import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Card from "../common/Card";
import type { RegenerativePractice } from "../../types";
import { clsx } from "../../lib/clsx";

export default function PracticeCard({ practice }: { practice: RegenerativePractice }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <h3 className="font-semibold text-ink font-display text-lg">{practice.practice}</h3>
      <p className="text-sm text-ink-soft mt-2">{practice.benefit}</p>

      <dl className="mt-4 text-sm">
        <dt className="text-ink-soft">When to use</dt>
        <dd className="text-ink font-medium mt-0.5">{practice.whenToUse}</dd>
      </dl>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
      >
        Learn more
        <ChevronDown className={clsx("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && <p className="text-sm text-ink-soft mt-3 pt-3 border-t border-line">{practice.detail}</p>}
    </Card>
  );
}
