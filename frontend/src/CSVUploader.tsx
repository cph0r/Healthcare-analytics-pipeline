import React, { useState } from "react";

const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setSuccess(false);
    setError(null);
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
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload CSV
      </button>
      {success && (
        <div style={{ color: 'limegreen', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✓ Uploaded successfully!
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CSVUploader; 