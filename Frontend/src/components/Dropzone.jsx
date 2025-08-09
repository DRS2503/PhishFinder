import {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

export default function Dropzone(props) {
  const [files, setFiles] = useState()

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

  fetch('http://127.0.0.1:5000/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      console.log('Prediction result:', data);

    })
    .catch(err => {
      console.error('Upload failed:', err);
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
    </section>
  );
}
