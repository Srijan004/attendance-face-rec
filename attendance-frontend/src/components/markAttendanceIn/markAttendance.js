import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';
import logo from "../../images/newLogoSmall.PNG";
import Login from '../loginEmployee/login';
import AccessDenied from '../AccessDenied/AccessDenied';

const MarkAttendance = () => {
  const history = useHistory()
  const loginCheck =  JSON.parse(localStorage.getItem("userDetail"));

  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 700,
    height: 400,
    facingMode: 'user'
  };
  const[name, setName] = useState('')
  const capture = React.useCallback(
  () => {
    
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(`imageSrc = ${imageSrc}`)
  
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

        console.log("Huo getUser resp : ", data)
        
        if(data['attendance_made'] == 2) {
          alert("You're already in. ");
        }

        if(data['attendance_made'] == 0) {
            
            alert("Please retry. Your attendance couldn't be made !!");
            localStorage.setItem("MyUser", JSON.stringify({}));
            history.push("/login");
            
        } if(data['attendance_made'] == 1) {
          alert(`Attendce made !! You have been identified with ${data['percent_accuracy']}% accuracy`);
        }


    })
);

  
  }, 
   [webcamRef]
  );
  
  return (
<>
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
