import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MedicationPlotsProps {
  medication: {
    medicationUsage: { medications: string[]; values: string[]; usage: Record<string, number[]> };
    medicationReadmission: { medications: string[]; values: string[]; readmission: Record<string, number[]> };
  };
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const MedicationPlots: React.FC<MedicationPlotsProps> = ({ medication }) => {
  // Stacked bar chart data for usage
  const usageData = medication.medicationUsage.medications.map((med, i) => {
    const entry: any = { name: med };
    medication.medicationUsage.values.forEach((v, j) => {
      entry[v] = medication.medicationUsage.usage[med][j];
    });
    return entry;
  });

  // Grouped bar chart data for readmission
  const readmitData = medication.medicationReadmission.medications.map((med, i) => {
    const entry: any = { name: med };
    medication.medicationReadmission.values.forEach((v, j) => {
      entry[v] = medication.medicationReadmission.readmission[med][j];
    });
    return entry;
  });

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
        Medication & Outcome
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Medication Usage (%)</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" unit="%" />
              <Tooltip />
              <Legend />
              {medication.medicationUsage.values.map((v, i) => (
                <Bar key={v} dataKey={v} stackId="a" fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission % by Medication</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={readmitData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" unit="%" />
              <Tooltip />
              <Legend />
              {medication.medicationReadmission.values.map((v, i) => (
                <Bar key={v} dataKey={v} fill={COLORS[i % COLORS.length]} name={v} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MedicationPlots; 