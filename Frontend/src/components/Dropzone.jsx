import { useDropzone } from 'react-dropzone';

function Dropzone({ onScanComplete }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/zip': ['.zip'] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if(!file) return;
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5173/upload',{
          method: 'Post',
          body: formData, 
        });

        const data = await response.json();

        if (onScanComplete && data.result) {
          onScanComplete({
            fileName: file.name,
            result: data.result,
            time: new Date().toLocaleString(),
          });
        } else if (data.error) {
          alert(`Scan failed: ${data.error}`);
        }
      } catch (error) {
        alert('Failed to scan file: ' + error.message);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px solid black',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? '#f0f8ff' : '#f9f9f9'
      }}
    >
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p className='dropbox-text'>Drop the .zip file here...</p>
          : <p className='dropbox-text'>Drag-n-drop a .zip file here, or click to select one</p>
      }
    </div>
  );
}

export default Dropzone;
