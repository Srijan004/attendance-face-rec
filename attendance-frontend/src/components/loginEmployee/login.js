import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./login.css";
import logo from "../../images/newLogoSmall.PNG";
import employeeLogo from "../../images/employeeLogo.png";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
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

  };

  const login = () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) =>
      res.json().then((data) => {

        if (data["login_successful"] == 0) {
          toast.error("invalid credentials");
        } else {
          localStorage.setItem("MyUser", JSON.stringify(user.empno));
          localStorage.setItem(
            "userDetail",
            JSON.stringify(data["employeeDetail"])
          );

          history.push("/employee");
        }
      })
    );
  };
  return (
    <div className="admLogFull">
      <Toaster />
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
          <input
            type="text"
            name="empno"
            value={user.empno}
            onChange={handleChange}
            placeholder="Enter employee number"
          ></input>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter your Password"
          ></input>
          <div className="button" onClick={login}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
