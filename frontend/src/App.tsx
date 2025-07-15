import React from 'react';
import CSVUploader from './CSVUploader';

function App() {
  return (
    <>
      <div style={{
        background: '#181c20', // dark background
        color: '#f8f8f8',      // light text
        padding: '12px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        letterSpacing: '1px',
        borderBottom: '2px solid #333', // subtle border
        marginBottom: '20px',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        🚀 Healthcare Analytics Pipeline by Chirag Phor - g24ai1018
      </div>
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#222',
        paddingTop: '60px' // To prevent content from being hidden under the fixed banner
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '2rem' }}>
            Health Care Analyser 🩺📊
          </h1>
          <CSVUploader />
        </div>
      </div>
    </>
  );
}

export default App;
