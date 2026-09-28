export default function TextureChart({
  texture,
}: {
  texture: { sand: number; silt: number; clay: number };
}) {
  const segments = [
    { label: "Sand", value: texture.sand, color: "#D39A32" },
    { label: "Silt", value: texture.silt, color: "#7F9B6A" },
    { label: "Clay", value: texture.clay, color: "#B76F48" },
  ];

  return (
    <div>
      <div className="flex h-4 w-full rounded-full overflow-hidden">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.value}%`, backgroundColor: s.color }}
            title={`${s.label}: ${s.value}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-3">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-sm text-ink-soft">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} {s.value}%
          </div>
        ))}
      </div>
    </div>
  );
}
