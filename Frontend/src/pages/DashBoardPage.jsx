import Dropzone from '../components/Dropzone'
import Profile from "../components/Profile";


function DashBoardPage() {
  return (
    <div>
      <div className='container' ><Dropzone /></div>
      <div className='container'><Profile /></div>
    </div>
  );
}

export default DashBoardPage

