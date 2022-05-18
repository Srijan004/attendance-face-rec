import React, { useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";
import "./clickTraining.css";
import logo from "../../images/newLogoSmall.PNG";

const ClickTraining = () => {
  const history = useHistory();

  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 700,
    height: 400,
    facingMode: "user",
  };
  const [name, setName] = useState("");
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(`imageSrc = ${imageSrc}`);

    fetch("/clickTrainingImg",
    {
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
          },
          body:JSON.stringify( {
            image: imageSrc,
            empno: localStorage.getItem("MyUser"),
          })
        }
    ).then((res) =>
    res.json().then((data) => {

        console.log("Huo getUser resp : ", data)

        if(data['face_present'] == 0) {
          alert("Please click a clear image !!");
        }
         if(data['face_present'] == 1) {
          localStorage.setItem("MyUser", JSON.stringify({}));
         alert("Image saved to the database")  ;
         history.push("/");
        }
    })
);

  }, [webcamRef]);

  return (
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
<h2>You are almost there. Click a photo of yours. This photo will be stored in the</h2>
<h2> database and will be used for matching whenever you mark your attendance. </h2>
</div>
  
      <Webcam
        className="webcam"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <button className="webcamButton" onClick={capture}>Click regristration image</button>
   
    </div>
</div>
  );
};

export default ClickTraining;
