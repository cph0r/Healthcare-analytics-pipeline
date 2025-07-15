import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AnalyticsPlotsProps {
  analytics: {
    race: { labels: string[]; counts: number[] };
    gender: { labels: string[]; counts: number[] };
    age: { ages: (string | number)[] };
  };
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"];

const AnalyticsPlots: React.FC<AnalyticsPlotsProps> = ({ analytics }) => {
  // Prepare data for charts
  const raceData = analytics.race.labels.map((label: string, i: number) => ({ name: label, value: analytics.race.counts[i] }));
  const genderData = analytics.gender.labels.map((label: string, i: number) => ({ name: label, value: analytics.gender.counts[i] }));
  // For histogram, bin ages (assuming age is categorical or binned already)
  const ageCounts: Record<string, number> = {};
  analytics.age.ages.forEach((age: string | number) => {
    ageCounts[age as string] = (ageCounts[age as string] || 0) + 1;
  });
  const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Race Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={raceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2>Age Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsPlots; 