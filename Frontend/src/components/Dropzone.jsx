import { useDropzone } from 'react-dropzone';

export default function Dropzone() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/zip': ['.zip'] },
    onDrop: (acceptedFiles) => {
      console.log('Dropped files:', acceptedFiles);
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px solidrgb(0, 0, 0)',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#f0f8ff' : '#f9f9f9'
      }}
    >
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p className='dropbox-text'>Drop the zip file here...</p>
          : <p className='dropbox-text'>Drag 'n' drop a .zip file here, or click to select one</p>
      }
    </div>
  );
}
