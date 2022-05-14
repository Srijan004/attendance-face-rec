import './App.css'
import Webcam from 'react-webcam';
import Homepage from "./homepage"
import Login from "./login"
import ClickTraining from './clickTrainingImg'
import Register from "./register"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import MarkAttendance from './markAttendance'
import BarChart from './mycharts';
import Report from './report';
import Employee from './employee';
import EmployeeProfile from './employeeProfille';
import AdminLogin from './AdminLogin';

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

          <Route path = "/clickTraining"> 
          
          <ClickTraining />

          </Route>

          <Route path="/markAttendance">

            <MarkAttendance/>


          </Route>

          <Route path="/mycharts">

            <BarChart />


          </Route>
          <Route path="/report">

<Report />


</Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;

