import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';
import logo from "../../images/newLogoSmall.PNG";

const MarkAttendanceOut = () => {
  const history = useHistory()

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
                //for deployment, you should put your backend url / api
    // axios.post('/markAttendance', {image : imageSrc, empno: localStorage.getItem("MyUser")})
    // 	  .then(res => {

    //       // history.push("/login");
    //   	  // console.log(`response = ${res}`);
    //       // localStorage.setItem("MyUser", JSON.stringify({}));
    //       console.log( "markAtendnce flask says : ", res)

    //       // history.push("/login");
    //   	  // setName(res.data)
    // })
    // 	  .catch(error => {
    //   	  console.log(`error = ${error}`)
    // })
  
    fetch("/markAttendanceOut",
    {
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
          body:JSON.stringify( {image : imageSrc, empno: localStorage.getItem("MyUser")})
        }
    ).then((res) =>
    res.json().then((data) => {
        // Setting a data from api
        // setdata({
        //     name: data.Name,
        //     age: data.Age,
        //     date: data.Date,
        //     programming: data.programming,
        // });

        console.log("Huo getUser resp : ", data)

        if(data['login'] == 0) {
            
            alert("Please retry. Your attendance couldn't be made !!");
            localStorage.setItem("MyUser", JSON.stringify({}));
            history.push("/login");
            
        } 
        
        if(data['login'] == 2) {
            alert("Mark your in attendance first. ");
            // history.push("/employee");
            
        } 
        
        
        
        if(data['login'] == 1) {
          alert('Attendce made');
            // localStorage.setItem("MyUser", JSON.stringify({}));
            // history.push("/employee");
        }


    })
);

  
  }, 
   [webcamRef]
  );
  
  return ( <div className="webcamPageFull">
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
<h2> Click on the button given below to Mark your Out-time attendance </h2>

</div>

  <Webcam
    className="webcam"
    audio={false}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    videoConstraints={videoConstraints}
  />

  <button className="webcamButton" onClick={capture}>Mark Attendance - Out</button>

</div>
</div>
	);
  
};

export default MarkAttendanceOut;
