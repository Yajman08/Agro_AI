import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { WeatherDay } from "../../types";

export default function ForecastChart({ forecast }: { forecast: WeatherDay[] }) {
  const data = forecast.map((d) => ({
    name: d.label,
    High: d.highC,
    Low: d.lowC,
    Rain: d.rainProbabilityPct,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EDEAE0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#565F4E" }}
            axisLine={{ stroke: "#DEDAC8" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fontSize: 12, fill: "#565F4E" }}
            axisLine={false}
            tickLine={false}
            width={32}
            unit="°"
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fontSize: 12, fill: "#565F4E" }}
            axisLine={false}
            tickLine={false}
            width={36}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #DEDAC8",
              fontSize: 13,
            }}
          />
          <Bar yAxisId="rain" dataKey="Rain" fill="#DCE7F0" radius={[6, 6, 0, 0]} barSize={18} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="High"
            stroke="#B5652F"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="Low"
            stroke="#3A7048"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}