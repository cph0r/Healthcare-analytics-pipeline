import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface ReadmissionPlotsProps {
  readmission: {
    readmissionDistribution: { labels: string[]; counts: number[] };
    readmissionByAge: { readmitted: (number | string)[]; not_readmitted: (number | string)[] };
    readmissionByDemographics: {
      race: { labels: string[]; not_readmitted: number[]; readmitted: number[] };
      gender: { labels: string[]; not_readmitted: number[]; readmitted: number[] };
    };
  };
}

const COLORS = ["#8884d8", "#82ca9d"];

const ReadmissionPlots: React.FC<ReadmissionPlotsProps> = ({ readmission }) => {
  // Pie chart data
  const pieData = readmission.readmissionDistribution.labels.map((label, i) => ({ name: label, value: readmission.readmissionDistribution.counts[i] }));

  // Age distribution (fallback to histogram if no box plot)
  const ageBins = ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"];
  function binAges(ages: (number | string)[]) {
    const bins = Array(ageBins.length).fill(0);
    ages.forEach(a => {
      let age = a;
      if (typeof age === "string" && age.includes("-")) {
        // If age is a range string like [70-80), take the midpoint
        const m = age.match(/(\d+)/g);
        if (m && m.length > 0) age = parseInt(m[0]);
      }
      age = Number(age);
      for (let i = 0; i < ageBins.length; i++) {
        const [low, high] = ageBins[i].split("-").map(Number);
        if (age >= low && age < high) {
          bins[i]++;
          break;
        }
      }
    });
    return bins;
  }
  const ageReadmit = binAges(readmission.readmissionByAge.readmitted);
  const ageNo = binAges(readmission.readmissionByAge.not_readmitted);
  const ageData = ageBins.map((bin, i) => ({ bin, Readmitted: ageReadmit[i], "Not Readmitted": ageNo[i] }));

  // Race bar chart data
  const raceData = readmission.readmissionByDemographics.race.labels.map((label, i) => ({
    name: label,
    "Not Readmitted": readmission.readmissionByDemographics.race.not_readmitted[i],
    Readmitted: readmission.readmissionByDemographics.race.readmitted[i],
  }));
  // Gender bar chart data
  const genderData = readmission.readmissionByDemographics.gender.labels.map((label, i) => ({
    name: label,
    "Not Readmitted": readmission.readmissionByDemographics.gender.not_readmitted[i],
    Readmitted: readmission.readmissionByDemographics.gender.readmitted[i],
  }));

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
        Readmission Risk Analytics
      </h2>
      <div style={{ display: "flex", flexDirection: "row", gap: "2.5rem", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission Distribution</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 2, minWidth: 350, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission by Age (Histogram)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="bin" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Readmitted" fill="#8884d8" />
              <Bar dataKey="Not Readmitted" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "2.5rem", flexWrap: "wrap", justifyContent: "space-between", marginTop: "2.5rem" }}>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission by Race</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={raceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Readmitted" fill="#8884d8" />
              <Bar dataKey="Not Readmitted" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission by Gender</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Readmitted" fill="#8884d8" />
              <Bar dataKey="Not Readmitted" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReadmissionPlots; 