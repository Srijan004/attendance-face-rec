import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./report.css";
import ByDate from "../DataByDate/DataByDate";
import logo from "../../images/newLogoSmall.PNG";
import AdminLogin from "../loginAdmin/AdminLogin";
import SearchByUser from "../SearchByUser/SearchByUser";
import AccessDenied from "../AccessDenied/AccessDenied";

function Tabs() {
  const adminCheck = JSON.parse(localStorage.getItem("Admin"));

  const [toggleState, setToggleState] = useState(1);
  const history = useHistory();
  const toggleTab = (index) => {
    setToggleState(index);
  };

  return adminCheck && adminCheck.admin ? (
    <>
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
            localStorage.setItem("Admin", JSON.stringify({}));
            history.push("/");
          }}
        >
          Logout
        </div>
      </div>

      <div className="reportHead">
        <h1>Hello Admin, Get the summarized report </h1>
        <h1> related to the attendance of the employees </h1>
      </div>

      <div className="container">
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            Search By User
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            Search by Date
          </button>
        </div>

        <div className="content-tabs">
          <div
            className={
              toggleState === 1 ? "content  active-content" : "content"
            }
          >
            <SearchByUser />
          </div>

          <div
            className={
              toggleState === 2 ? "content  active-content" : "content"
            }
          >
            <ByDate />
          </div>
        </div>
      </div>
    </>
  ) : (
    <AccessDenied />
  );
}

export default Tabs;
