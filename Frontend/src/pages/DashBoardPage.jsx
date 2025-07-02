import { useState } from 'react'
import Dropzone from '../components/Dropzone'


function DashBoardPage() {

  return (
    <section className='section'>
      <div className='container'>
        <h1>Upload Files</h1>
        <Dropzone className='dropzone'>Drop Here</Dropzone>
      </div>
      <h1>Files Preview</h1>
      <div className='placeholder'></div>
      <h1>Rejected files</h1>
    </section>
  )
}

export default DashBoardPage