import { brCountries } from "../../data/mockData";
import { ArrowDown } from "lucide-react";

const layers = [
  "Country agricultural data",
  "Common agricultural schema",
  "Interoperability layer",
  "AI services",
];

export default function BricsSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <p className="text-sm font-medium text-forest-700 mb-2">BRICS interoperability framework</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-4">
          Built for interoperable agriculture
        </h2>
        <p className="text-ink-soft leading-relaxed mb-6">
          AgriNexus AI is designed around a common agricultural data schema, so
          insights can eventually travel across borders — not just across
          fields. Today, live data and AI services run for India. The
          framework below shows how the same platform is structured to bring
          in other countries over time.
        </p>
        <ul className="flex flex-wrap gap-2">
          {brCountries.map((c) => (
            <li
              key={c.code}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm"
            >
              <span className="text-ink font-medium">{c.name}</span>
              <span
                className={`text-xs ${
                  c.status === "Connected" ? "text-forest-700" : "text-ink-soft"
                }`}
              >
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-2">
          {layers.map((layer, i) => (
            <div key={layer} className="w-full flex flex-col items-center gap-2">
              <div className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-center text-sm font-medium text-ink">
                {layer}
              </div>
              {i < layers.length - 1 && <ArrowDown className="h-4 w-4 text-ink-soft" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
