import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useHistory } from 'react-router-dom';

const ClickTraining = () => {
  const history = useHistory()

  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width : 200,
    height : 200,
    facingMode: 'user'
  };
  const[name, setName] = useState('')
  const capture = React.useCallback(
  () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(`imageSrc = ${imageSrc}`)
                //for deployment, you should put your backend url / api
    axios.post('/clickTrainingImg', {image : imageSrc, empno: localStorage.getItem("MyUser")})
    	  .then(res => {

          // history.push("/login");
      	  console.log(`response = ${res}`);
          localStorage.setItem("MyUser", JSON.stringify({}));

          history.push("/");
      	  // setName(res.data)
    })
    	  .catch(error => {
      	  console.log(`error = ${error}`)
    })
  }, 
   [webcamRef]
  );
  
  return (
  <div>
    
    <Webcam
   audio = {false}
	 height = {300}
	 ref = {webcamRef}
	 screenshotFormat = "image/jpeg"
	 width = {350}
	 videoConstraints = {videoConstraints}
	/>

    <button onClick={capture}>Click Me!</button>
	<h2>{name}</h2>
  </div>
	);
  
};

export default ClickTraining;
