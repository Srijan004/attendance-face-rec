import React, { useMemo } from "react";
import { useTable } from "react-table";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { format } from "date-fns";
import logo from "../../images/newLogoSmall.PNG";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./employeeProfile.css";
import { Profiler } from "react/cjs/react.production.min";
import Login from "../loginEmployee/login";
import AccessDenied from "../AccessDenied/AccessDenied";

<Chart type="line" />;

const BarChart = () => {
  const loginCheck = JSON.parse(localStorage.getItem("userDetail"));
  const history = useHistory();
  console.log(JSON.parse(localStorage.getItem("userDetail")));
  var detail = JSON.parse(localStorage.getItem("userDetail"));

  if(detail) {var imgsrc = "data:image/png;base64," + detail.photo;}
  var [dar, setdar] = useState([]);

  const [labels, setLabels] = useState(null);
  const [datavals, setDatavals] = useState([]);

  var [MOCK_DATA, setMD] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [empNo, setEmpNo] = useState("tvo-2801");

  const [arr_in, setAin] = useState([]);
  const [arr_out, setAout] = useState([]);

  const [final, setFinal] = useState([]);
  var obf = [];

  const reporter = () => {
    fetch("/reportForGraph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        console.log("hash data from flask : ", data);

        var myHash = {};
        var mymd = [];

        var currUser = data[detail.empno];
        var dtArr = getDaysArray(startDate, endDate);
        for (var i = 0; i < dtArr.length; i++) {
          var MyDate = dtArr[i];

          var MyDateString =
            ("0" + (MyDate.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + MyDate.getDate()).slice(-2) +
            "/" +
            MyDate.getFullYear();

          if (currUser[MyDateString])
            myHash[MyDateString] = currUser[MyDateString][2];
          else myHash[MyDateString] = 0;

          let v = currUser[MyDateString];

          if (currUser[MyDateString]) {
            mymd.push({
              date: MyDateString,
              Attendance: "Present",
              "in-time": v[0],
              "out-time": v[1],
              duration: v[2],
            });
          } else {
            mymd.push({
              date: MyDateString,
              Attendance: "Absent",
              "in-time": "-",
              "out-time": "-",
              duration: "-",
            });
          }
        }

        setMD(mymd);
        console.log("MYMD:", mymd);

        console.log("my hash table : ", myHash);

        setLabels(Object.keys(myHash));
        setDatavals(Object.values(myHash));
        console.log("akm : ", labels, datavals);
      })
    );
  };

  var getDaysArray = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  return (
    <>
      {loginCheck && loginCheck.empno ? (
        <div>
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
                localStorage.setItem("userDetail", JSON.stringify({}));

                history.push("/");
              }}
            >
              Logout
            </div>
          </div>

          <div className="employeeDetail">
            <div className="empDetailText">
              <div className="detailLabels">
                Name of the employee - {detail.name}
              </div>
              <div className="detailLabels">Email Id - {detail.email}</div>
              <div className="detailLabels">
                Employee Number- {detail.empno}
              </div>
              <div className="detailLabels">Date of Joining - {detail.doj}</div>
            </div>
            <div className="profileImageDiv">
              <img src={imgsrc} className="profileImage" alt="" />
              <h4>Profile Image</h4>
            </div>
          </div>
          <div className="profilehead">View Attendance Report</div>

          <div className="datepickerDiv">
            <div className="datepickerDivInside">
              <h3>Choose Start Date</h3>

              <div>
                <DatePicker
                  className="datepicker"
                  placeholderText="Start Date"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
            </div>

            <div className="datepickerDivInside">
              <h3>Choose End Date</h3>

              <div>
                <DatePicker
                  className="datepicker"
                  placeholderText="End Date"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
            </div>

            <button className="reportButton" onClick={reporter}>
              Get Attendance Report
            </button>
          </div>

          {startDate && endDate && MOCK_DATA.length && (
            <div className="employeeTable">
              <table>
                <tr>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>In-Time</th>
                  <th>Out-Time</th>
                  <th>Duration</th>
                </tr>

                {MOCK_DATA.map((row) => (
                  <>
                    <tr>
                      <td> {row["date"]} </td>
                      <td> {row["Attendance"]} </td>
                      <td> {row["in-time"]} </td>
                      <td> {row["out-time"]} </td>
                      <td> {row["duration"]} </td>
                    </tr>
                  </>
                ))}
              </table>
            </div>
          )}

          <br />

          {startDate && endDate && MOCK_DATA.length && (
            <div className="barchart">
              <Bar
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "No of working hours",
                      data: datavals,
                      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                    },
                  ],
                }}
                height={400}
                width={600}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontSize: 25,
                    },
                  },
                }}
              />
            </div>
          )}

          <div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default BarChart;
