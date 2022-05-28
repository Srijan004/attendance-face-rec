import React from "react";
import { useHistory } from "react-router-dom";
import "./homepage.css";
import BG from "../../images/newBGimg00.png";
import employee from "../../images/employee.png";
import admin from "../../images/admin.png";
import addEmployee from "../../images/addEmployee.png";

const Homepage = () => {
  const history = useHistory();
  return (
    <div className="homepage">
      <img src={BG} className="homePageBG" alt="" />

      <div className="homepageRight">
        <div className="homePageRightUp">
          <div className="welcome">Welcome</div>

          <div className="intro">
            Mark Attendance using the
            <br />
            latest face recognition technology
          </div>
        </div>

        <div className="homePageRightDn">
          <button className="homeOption" onClick={() => history.push("/login")}>
            <div className="homeOptionImage">
              <img src={employee} className="optionImage" />
            </div>
            Login as employee
          </button>

          <button
            className="homeOption"
            onClick={() => history.push("/adminLogin")}
          >
            <div className="homeOptionImage">
              <img src={admin} className="optionImage" />
            </div>
            Login as admin
          </button>

          <button
            className="homeOption"
            onClick={() => history.push("/register")}
          >
            <div className="homeOptionImage">
              <img src={addEmployee} className="optionImage" />
            </div>
            Register a new employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
