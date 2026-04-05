  import React from "react";
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

  export default function ProjectEfficiencyGraph({ projects = [] }) {

    const data = projects.map((p) => {
      const deadline = new Date(p.deadline);
      const today = new Date();

      const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      let efficiency;

      if (p.status === "completed") {
        efficiency = 100;
      } else if (p.status === "overdue") {
        efficiency = 10;
      } else {
        // active → based on remaining days
        efficiency = Math.max(20, Math.min(100, diffDays * 5));
      }

      return {
        project: p.name,
        efficiency,
      };
    });

    return (
      <div className="p-6 bg-[#0C1A2B] text-[#B6FF3B] rounded-xl h-full">
        <h3 className="mb-4 font-semibold">Project Health Overview</h3>

        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#363d47" />
            <XAxis dataKey="project" stroke="#B6FF3B" />
            <YAxis stroke="#B6FF3B" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#B6FF3B"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }