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
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const emailStr = reader.result
        console.log(emailStr)

      }
      reader.readAsText(file)
    })
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