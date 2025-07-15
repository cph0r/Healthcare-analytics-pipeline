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
    <div style={{
      marginTop: "2rem",
      background: "#232323",
      borderRadius: 16,
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.4)",
      padding: "2rem 1.5rem 2.5rem 1.5rem",
      maxWidth: 1200,
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "2rem", fontSize: "2rem", letterSpacing: 1 }}>
        Demographics Analysis
      </h2>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Race Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={raceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Gender Distribution</div>
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
        </div>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Age Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPlots; 