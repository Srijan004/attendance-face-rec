import React, {useState} from 'react';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';
import logo from "../../images/newLogoSmall.PNG";
import AccessDenied from '../AccessDenied/AccessDenied';
import toast, { Toaster } from 'react-hot-toast';

const MarkAttendance = () => {
  const history = useHistory()
  const loginCheck =  JSON.parse(localStorage.getItem("userDetail"));
  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 700,
    height: 400,
    facingMode: 'user'
  };
  const capture = React.useCallback(
  () => {
    
    const imageSrc = webcamRef.current.getScreenshot();
 
    fetch("/markAttendance",
    {
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
          body:JSON.stringify( {image : imageSrc, empno: localStorage.getItem("MyUser")})
        }
    ).then( (res) =>
    res.json().then((data) => {

        
        if(data['attendance_made'] == 2) {
          toast.error("You're already in. ");
        }

        if(data['attendance_made'] == 0) {
            
          toast.error("Please retry. Your attendance couldn't be made !!");
  
            
        } if(data['attendance_made'] == 1) {
          toast.success(`Attendance made !! You have been identified with ${data['percent_accuracy']}% accuracy`);
        }


    })
);

  
  }, 
   [webcamRef]
  );
  
  return (
<>
<Toaster />
{
  (loginCheck && loginCheck.empno) ? 
  <div className="webcamPageFull">
    <div className="adminLoginNavbar">
      <img
        src={logo}
        alt=""
        className="adminProjectLogo"
        onClick={() => history.push("/")}
      />
    </div>

<div className="webcamMain">

<div className="webcamInstruction">
<h2> Click on the button given below to Mark your Intime attendance </h2>
</div>

    <Webcam
      className="webcam"
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />

    <button className="webcamButton" onClick={capture}>Mark Attendance - In</button>
 
  </div>
</div>

:
<AccessDenied />

}

</>

	);
  
};

export default MarkAttendance;
