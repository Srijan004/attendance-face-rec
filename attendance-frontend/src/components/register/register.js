import React, { useState} from "react";
import { useHistory } from "react-router-dom";
import "./register.css";
import logo from "../../images/newLogoSmall.PNG";
import employeeLogo from "../../images/addEmployeeRegPage0.png";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const regexExpForEmail =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  const regexExpForPw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

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
    if (
      name &&
      regexExpForPw.test(password) &&
      regexExpForEmail.test(email) &&
      password &&
      password === reEnterPassword &&
      empno
    ) {
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((res) =>
        res.json().then((data) => {
          if (data["unique_employee_number"] == 0) {
            toast.error(
              "An employee with this employee number already exists in the database. Employee Number is unique for an employee"
            );
          } else {
            localStorage.setItem("MyUser", JSON.stringify(user.empno));
            history.push("/clickTraining");
          }
        })
      );
    } else {
      if (!regexExpForPw.test(password)) {
        toast.error(
          "A password should have minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character"
        );
      }

      if (!regexExpForEmail.test(email)) {
        toast.error("Invalid Email !!");
      }

      if (password != reEnterPassword) {
        toast.error("Password confirmation failed.");
      }
    }
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

      <div className="registerEmployeeMain">
        <img src={employeeLogo} className="registerIcon" alt="" />

        <div className="passwordInstruction">
          <strong>*</strong>A password should have minimum six characters, at
          least one uppercase letter, one lowercase letter, one number and one
          special character.
        </div>
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
