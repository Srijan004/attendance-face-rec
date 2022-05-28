import Webcam from "react-webcam";
import Homepage from "./components/homepage/homepage";
import Login from "./components/loginEmployee/login";
import ClickTraining from "./components/clickTrainingImage/clickTrainingImg";
import Register from "./components/register/register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import MarkAttendance from "./components/markAttendanceIn/markAttendance";
import Report from "./components/report/report";
import Employee from "./components/employeeDashboard/employee";
import EmployeeProfile from "./components/employeeProfile/employeeProfile";
import AdminLogin from "./components/loginAdmin/AdminLogin";
import MarkAttendanceOut from "./components/markAttendanceOut/markAttendanceOut";
import DataByDate from "./components/DataByDate/DataByDate";
import Tabs from "./components/report/report";

import "./App.css";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>

          <Route exact path="/employee">
            <Employee />
          </Route>

          <Route exact path="/adminLogin">
            <AdminLogin />
          </Route>

          <Route exact path="/employeeProfile">
            <EmployeeProfile />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/clickTraining">
            <ClickTraining />
          </Route>

          <Route path="/markAttendance">
            <MarkAttendance />
          </Route>

          <Route path="/markAttendanceOut">
            <MarkAttendanceOut />
          </Route>

          <Route path="/report">
            <Tabs />
          </Route>


        </Switch>
      </Router>
    </div>
  );
}

export default App;
