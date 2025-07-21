import { useState, useEffect } from 'react';
import Dropzone from '../components/Dropzone';

function DashboardPage() {
  const [scanHistory, setScanHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('scanHistory')) || [];
    setScanHistory(stored);
  }, []);

  const handleScanComplete = (scanResult) => {
    const updated = [scanResult, ...scanHistory].slice(0, 5); // keep last 5
    setScanHistory(updated);
    localStorage.setItem('scanHistory', JSON.stringify(updated));
  };

  return (
    <section className='section'>
      <div className='container'>
        <h1>Upload Files</h1>
        <Dropzone onScanComplete={handleScanComplete} />
      </div>

      <h2>📜 Scan History (Last 5)</h2>
      <ul>
        {scanHistory.map((entry, index) => (
          <li key={index}>
            <strong>{entry.result}</strong> - {entry.fileName}
            <br />
            <small>{entry.time}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DashboardPage;
