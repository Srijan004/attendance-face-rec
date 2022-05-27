import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./register.css";

import logo from "../../images/newLogoSmall.PNG";
import employeeLogo from "../../images/addEmployeeRegPage0.png";
const Register = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    name: "",
    empno: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    const { name, empno, email, password, reEnterPassword } = user;
    if (name && email && password && password === reEnterPassword && empno) {
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((res) =>
        res.json().then((data) => {
          if (data["unique_employee_number"] == 0) {
            alert(
              "An employee with this employee number already exists in the database. Employee Number is unique for an employee"
            );

            setUser({});

            window.location.reload();
          } else {
            localStorage.setItem("MyUser", JSON.stringify(user.empno));
            history.push("/clickTraining");
          }
        })
      );
    } else alert("Please enter valid data !!");
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

      <div className="registerEmployeeMain">
        <img src={employeeLogo} className="registerIcon" alt="" />
        <div className="register">
          <h1>Register a new Employee</h1>
          <input
            type="text"
            name="name"
            value={user.name}
            placeholder="Your Name"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="empno"
            value={user.empno}
            placeholder="Employee number"
            onChange={handleChange}
          ></input>
          <input
            type="text"
            name="email"
            value={user.email}
            placeholder="Your Email"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Your Password"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            name="reEnterPassword"
            value={user.reEnterPassword}
            placeholder="Re-enter Password"
            onChange={handleChange}
          ></input>
          <div className="button" onClick={register}>
            Register
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
