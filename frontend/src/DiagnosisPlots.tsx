import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DiagnosisPlotsProps {
  diagnosis: {
    topDiagnoses: { labels: string[]; counts: number[] };
    readmissionByDiagnosis: { labels: string[]; readmission_percent: number[] };
  };
}

const DiagnosisPlots: React.FC<DiagnosisPlotsProps> = ({ diagnosis }) => {
  const topDiagData = diagnosis.topDiagnoses.labels.map((label: string, i: number) => ({ name: label, count: diagnosis.topDiagnoses.counts[i] }));
  const readmitData = diagnosis.readmissionByDiagnosis.labels.map((label: string, i: number) => ({ name: label, readmission: diagnosis.readmissionByDiagnosis.readmission_percent[i] }));

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
        Diagnosis & Treatment Analysis
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Top Diagnoses</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topDiagData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis type="number" stroke="#ccc" />
              <YAxis dataKey="name" type="category" stroke="#ccc" width={200} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Readmission % by Diagnosis</div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={readmitData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis type="number" stroke="#ccc" unit="%" />
              <YAxis dataKey="name" type="category" stroke="#ccc" width={200} />
              <Tooltip />
              <Legend />
              <Bar dataKey="readmission" fill="#82ca9d" name="Readmission %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPlots; 