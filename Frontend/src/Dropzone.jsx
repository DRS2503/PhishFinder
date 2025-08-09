import {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

export default function Dropzone(props) {
  const [files, setFiles] = useState()
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'message/rfc822': ['.eml']
    }, 
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    
    <li key={file.name}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));


useEffect(() => {
  if (acceptedFiles.length === 0) return;

  const file = acceptedFiles[0];
  const formData = new FormData();
  formData.append('file', file);

  setIsLoading(true);
  setResults(null);

  fetch('http://127.0.0.1:5000/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      console.log('Prediction result:', data);
      setResults(data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Upload failed:', err);
      setResults({ error: 'Upload failed. Please try again.' });
      setIsLoading(false);
    });
}, [acceptedFiles]);

  return (
    <section className="container">
      <h1>File Upload</h1>
      <div {...getRootProps({ className: 'dropzone', style: {backgroundColor: 'white', padding: '10px'} })}>
        <input {...getInputProps()} />
        <p style={{color: 'black' }}>Drag 'n' drop some files here, or click to select files</p>
        <em style={{color:'black', fontSize: '12px'}}>(Only *.eml and *.txt images will be accepted)</em>
      </div>
      <div>
        <h2>Accepted files</h2>
        <ul style={{ padding: '0px'}}>{acceptedFileItems}</ul>
        <h2>Rejected files</h2>
        <ul style={{ padding: '0px'}}>{fileRejectionItems}</ul>
      </div>

      {isLoading && (
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '20px', 
          borderRadius: '8px', 
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#333' }}>🔍 Analyzing file...</h3>
          <p style={{ color: '#666' }}>Please wait while we scan your file for threats.</p>
        </div>
      )}

      {results && !isLoading && (
        <div style={{ 
          backgroundColor: results.result === 'Phishing' ? '#ffe6e6' : '#e6ffe6', 
          padding: '20px', 
          borderRadius: '8px', 
          margin: '20px 0',
          border: `2px solid ${results.result === 'Phishing' ? '#ff4444' : '#44aa44'}`
        }}>
          <h2 style={{ 
            color: results.result === 'Phishing' ? '#cc0000' : '#006600',
            margin: '0 0 10px 0'
          }}>
            {results.result === 'Phishing' ? '⚠️ PHISHING DETECTED' : '✅ FILE IS SAFE'}
          </h2>
          
          {results.filename && (
            <p style={{ color: '#333', margin: '5px 0' }}>
              <strong>File:</strong> {results.filename}
            </p>
          )}
          
          {results.confidence && (
            <p style={{ color: '#333', margin: '5px 0' }}>
              <strong>Confidence:</strong> {results.confidence}
            </p>
          )}
          
          {results.message && (
            <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '14px' }}>
              {results.message}
            </p>
          )}

          {results.error && (
            <p style={{ color: '#cc0000', margin: '5px 0' }}>
              <strong>Error:</strong> {results.error}
            </p>
          )}

          {results.details && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#333', margin: '10px 0' }}>Detailed Results:</h4>
              {results.details.map((detail, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'rgba(255,255,255,0.5)', 
                  padding: '10px', 
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <strong>{detail.file}:</strong> {detail.result} 
                  {detail.confidence && <span> ({detail.confidence})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
