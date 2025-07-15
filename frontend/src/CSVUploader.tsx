import React, { useState } from "react";
import AnalyticsPlots from "./AnalyticsPlots";
import AdmissionPatternsPlots from "./AdmissionPatternsPlots";

const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [admissionPatterns, setAdmissionPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError(null);
    setAnalytics(null);
    setAdmissionPatterns(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setSuccess(false);
    setError(null);
    setAnalytics(null);
    setAdmissionPatterns(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload-csv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        // Fetch analytics data after successful upload
        const [race, gender, age, admissionType, admissionSource, dischargeDisposition] = await Promise.all([
          fetch("http://localhost:8000/api/analytics/race-distribution").then(r => r.json()),
          fetch("http://localhost:8000/api/analytics/gender-distribution").then(r => r.json()),
          fetch("http://localhost:8000/api/analytics/age-distribution").then(r => r.json()),
          fetch("http://localhost:8000/api/analytics/admission-type-distribution").then(r => r.json()),
          fetch("http://localhost:8000/api/analytics/admission-source-distribution").then(r => r.json()),
          fetch("http://localhost:8000/api/analytics/discharge-disposition-distribution").then(r => r.json()),
        ]);
        setAnalytics({ race, gender, age });
        setAdmissionPatterns({ admissionType, admissionSource, dischargeDisposition });
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        Upload CSV
      </button>
      {loading && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: 60,
            height: 60,
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #8884d8',
            borderRadius: '50%',
            animation: 'spinnyBoi 1s linear infinite',
            marginBottom: 10
          }} />
          <div style={{ fontWeight: 'bold', color: '#8884d8', fontSize: '1.1rem' }}>
            Crunching numbers and wrangling data... Please wait! 🦾📊
          </div>
          <style>{`
            @keyframes spinnyBoi {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {success && !loading && (
        <div style={{ color: 'limegreen', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✓ Uploaded successfully!
        </div>
      )}
      {error && !loading && (
        <div style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          {error}
        </div>
      )}
      {analytics && !loading && <AnalyticsPlots analytics={analytics} />}
      {admissionPatterns && !loading && <AdmissionPatternsPlots patterns={admissionPatterns} />}
    </div>
  );
};

export default CSVUploader; 