import React, {useState} from "react"
import Webcam from 'react-webcam';

import axios from "axios"
import { useHistory } from "react-router-dom"
import './login.css'

import logo from "../../images/newLogoSmall.PNG";
import employeeLogo from "../../images/employeeLogo.png";
const Login = ({ updateUser}) => {

    

    const history = useHistory()

    const [ user, setUser] = useState({
        empno:"",
        password:""
    })



    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })

        console.log(user);
    }

    const login = () => {

        fetch("/login",
        {
                    'method':'POST',
                     headers : {
                    'Content-Type':'application/json'
              },
              body:JSON.stringify(user)
            }
        ).then((res) =>
        res.json().then((data) => {

            console.log("New Daata : ", data)

            console.log("-1",user,"-2", user.empno)

            if(data['login_successful'] == 0) {
                
                alert("invalid credentials")

                setUser({});

                window.location.reload();

            } else {
                localStorage.setItem("MyUser", JSON.stringify(user.empno));
                localStorage.setItem("userDetail", JSON.stringify(data['employeeDetail']));

                history.push("/employee");
            }


        })
    );


    }
    return (
        
        <div className="admLogFull">
        <div className="adminLoginNavbar">
          
          
          <img
            src={logo}
            alt=""
            className="adminProjectLogo"
            onClick={() => history.push("/")}
          />
        </div>
  
        <div className="loginEmployeeMain">
  
          <img src={employeeLogo} className="adminLogoLogin" alt="" />
  
        <div className="login">
          {/* <Webcam />  */}
          <h1>Employee Login</h1>
          <input type="text" name="empno" value={user.empno} onChange={handleChange} placeholder="Enter employee number"></input>
          <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" ></input>
          <div className="button" onClick={login}>Login</div> 
      </div>
        </div>
      </div>
    )
}

export default Login