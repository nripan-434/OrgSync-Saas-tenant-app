import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CircularProgress = ({ value }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  const data = [
    { name: "progress", value: safeValue },
    { name: "remaining", value: 100 - safeValue }
  ];

  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="#ffffff" />
            <Cell fill="#1f2937" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-[#B6FF3B]">{safeValue}%</p>
        <p className="text-xs text-gray-400">Efficiency</p>
      </div>
    </div>
  );
};

export default CircularProgress;