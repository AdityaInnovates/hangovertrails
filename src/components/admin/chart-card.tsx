"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type SeriesPoint = {
  label: string;
  value: number;
};

const colors = ["#1f4f3d", "#d98745", "#2f7a55", "#c17a22", "#b84a3a"];

export function ChartCard({ title, type, data }: { title: string; type: "line" | "bar" | "pie"; data: SeriesPoint[] }) {
  return (
    <article className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="#ded7cb" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1f4f3d" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          ) : type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid stroke="#ded7cb" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#1f4f3d" radius={[12, 12, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip />
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={95} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}