import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./login.css";
import logo from "../../images/newLogoSmall.PNG";
import adminLogo from "../../images/adminLogoBig.jpg";
import toast, { Toaster } from "react-hot-toast";

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
  };

  const login = () => {
    fetch("/adminlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) =>
      res.json().then((data) => {

        if (data["login_successful"] == 0) {
          toast.error("Not an admin !!");
        } else {
          const admin = {
            admin: 5,
          };

          localStorage.setItem("Admin", JSON.stringify(admin));

          history.push("/report");
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
