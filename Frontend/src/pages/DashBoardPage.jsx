import Dropzone from '../components/Dropzone'
import DashBoard from "../components/dashboard";


function DashBoardPage() {
  return (
    <div>
      <h1>File Upload</h1>
      <div className='container' style={{marginTop: '50px'}}><Dropzone /></div>
      <div className='container'><DashBoard /></div>
    </div>
  );
}

export default DashBoardPage

