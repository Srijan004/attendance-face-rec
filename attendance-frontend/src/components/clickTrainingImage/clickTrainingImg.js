import React, { useState } from "react";
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";
import "./clickTraining.css";
import logo from "../../images/newLogoSmall.PNG";
import toast, { Toaster } from "react-hot-toast";

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
 
    fetch("/clickTrainingImg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageSrc,
        empno: localStorage.getItem("MyUser"),
      }),
    }).then((res) =>
      res.json().then((data) => {

        if (data["face_present"] == 0) {
          toast.error("Please click a clear image !!");
        }

        if (data["face_present"] == 2) {
          toast.error(
            "Your registration image must have a single person !! Click a solo picture of yours."
          );
        }

        if (data["face_present"] == 1) {
          localStorage.setItem("MyUser", JSON.stringify({}));

          toast.success("Registration Successful. The image is saved in the backend.");
        }
      })
    );
  }, [webcamRef]);

  return (
    <div className="webcamPageFull">
      <Toaster />

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
          <h2>
            You are almost there. Click your photo using the button below. This
            photo will be stored
          </h2>
          <h2>
            in the database and will be used for matching whenever you mark your
            attendance.{" "}
          </h2>
        </div>

        <Webcam
          className="webcam"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />

        <button className="webcamButton" onClick={capture}>
          Click regristration image
        </button>
      </div>
    </div>
  );
};

export default ClickTraining;
