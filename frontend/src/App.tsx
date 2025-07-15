import React from 'react';
import CSVUploader from './CSVUploader';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#222',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '2rem' }}>
          Health Care Analyser 🩺📊
        </h1>
        <CSVUploader />
      </div>
    </div>
  );
}

export default App;
