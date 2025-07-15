import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AdmissionPatternsPlotsProps {
  patterns: {
    admissionType: { labels: string[]; counts: number[] };
    admissionSource: { labels: string[]; counts: number[] };
    dischargeDisposition: { labels: string[]; counts: number[] };
  };
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"];

const AdmissionPatternsPlots: React.FC<AdmissionPatternsPlotsProps> = ({ patterns }) => {
  const admissionTypeData = patterns.admissionType.labels.map((label: string, i: number) => ({ name: label, value: patterns.admissionType.counts[i] }));
  const admissionSourceData = patterns.admissionSource.labels.map((label: string, i: number) => ({ name: label, value: patterns.admissionSource.counts[i] }));
  const dischargeDispositionData = patterns.dischargeDisposition.labels.map((label: string, i: number) => ({ name: label, value: patterns.dischargeDisposition.counts[i] }));

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
        Admission Patterns
      </h2>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Admission Type</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={admissionTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Admission Source</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={admissionSourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 10, fontSize: "1.2rem" }}>Discharge Disposition</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dischargeDispositionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPatternsPlots; 