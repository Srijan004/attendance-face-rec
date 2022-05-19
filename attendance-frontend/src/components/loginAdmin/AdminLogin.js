import React, { useState } from "react";
import Webcam from "react-webcam";

import axios from "axios";
import { useHistory } from "react-router-dom";
import "./login.css";
import logo from "../../images/newLogoSmall.PNG";
import adminLogo from "../../images/adminLogoBig.jpg";

const AdminLogin = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    empno: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    console.log(user);
  };

  // const login = () => {
  //     axios.post("/login", user)
  //     .then(res => {
  //         console.log(res);
  //         // history.push("/")
  //     })
  // }

  const login = () => {
    fetch("/adminlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) =>
      res.json().then((data) => {
        // Setting a data from api
        // setdata({
        //     name: data.Name,
        //     age: data.Age,
        //     date: data.Date,
        //     programming: data.programming,
        // });

        console.log("Huo getUser resp : ", data);

        if (data["ok"] == 0) {
          alert("Not an admin !!");

          // setUser({});

          window.location.reload();
        } else {
          // localStorage.setItem("MyUser", JSON.stringify(user.empno));
          history.push("/report");
        }
      })
    );
  };

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

      <div className="loginAdminMain">
        <img src={adminLogo} className="adminLogoLogin" alt="" />

        <div className="login">
          {/* <Webcam />  */}
          <h1>Admin Login</h1>
          <input
            type="text"
            name="empno"
            value={user.empno}
            onChange={handleChange}
            placeholder="Enter admin username"
          ></input>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter admin Password"
          ></input>
          <div className="button" onClick={login}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

/*

<img src={adminLogo} className="adminLogo" alt="" />
          <input
            type="text"
            className="adminUsername"
            name="empno"
            value={user.empno}
            onChange={handleChange}
            placeholder="Enter admin username"
          ></input>

          <input
            type="password"
            className="adminPassword"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter admin Password"
          ></input>

          <div className="loginButton" onClick={login}>
            Login
          </div>


*/
