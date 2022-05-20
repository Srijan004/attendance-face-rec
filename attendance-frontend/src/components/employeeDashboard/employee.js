import { useHistory } from "react-router-dom";
import "./employeeDashboard.css";
import logo from "../../images/newLogoSmall.PNG";
import entryIcon from "../../images/employeeEntering.png";
import exitIcon from "../../images/employeeExiting.png";
import viewProfile from "../../images/profileIcon.png";

const Employee = () => {
  const history = useHistory();

  return (
    <div className="employeeDashboardFull">
      <div className="employeeDashboardNavbar">
        <img
          src={logo}
          alt=""
          className="employeeDashboardProjectLogo"
          onClick={() => history.push("/")}
        />
        <div
          className="employeeLogoutOnDashboard"
          onClick={() => {
            localStorage.setItem("MyUser", JSON.stringify({}));
            history.push("/");
          }}
        >
          {" "}
          Logout
        </div>
      </div>

      <div className="employeeOptions">
        <div
          className="employeeDashboardOptions"
          onClick={() => history.push("/markAttendance")}
        >
          <div className="imgEmpDashboard">
            <img src={entryIcon} className="employeeDashboardImage" alt="" />
          </div>

          <div className="employeeDashboardLabel">Mark attendance In </div>
        </div>
        <div
          className="employeeDashboardOptions"
          onClick={() => history.push("/employeeProfile")}
        >
          <div className="imgEmpDashboard">
            <img src={viewProfile} className="employeeDashboardImage" alt="" />
          </div>
          <div className="employeeDashboardLabel">View Profile</div>
        </div>
        <div
          className="employeeDashboardOptions"
          onClick={() => history.push("/markAttendanceOut")}
        >
          <div className="imgEmpDashboard">
            <img src={exitIcon} className="employeeDashboardImage" alt="" />
          </div>
          <div className="employeeDashboardLabel">Mark attendance Out</div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
