import React from "react";
import { Bar} from "react-chartjs-2";
import { useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import logo from "../../images/newLogoSmall.PNG";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./employeeProfile.css";
import AccessDenied from "../AccessDenied/AccessDenied";
import toast, { Toaster } from 'react-hot-toast';

<Chart type="line" />;

const BarChart = () => {
  const loginCheck = JSON.parse(localStorage.getItem("userDetail"));
  const history = useHistory();
  var detail = JSON.parse(localStorage.getItem("userDetail"));

  if(detail) {var imgsrc = "data:image/png;base64," + detail.photo;}
 
  const [labels, setLabels] = useState(null);
  const [datavals, setDatavals] = useState([]);

  var [contentTable, setContentTable] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const reporter = () => {
    fetch("/reportForGraph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        var myHash = {};
        var contentTable_temp = [];

        if(data['message']) {
          toast.error(data['message']);
          return;
        }
        var currUser = data[detail.empno];
       
        if(currUser == undefined) {
          setContentTable([]);
          return; 
        }

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
            contentTable_temp.push({
              date: MyDateString,
              Attendance: "Present",
              "in-time": v[0],
              "out-time": v[1],
              duration: v[2],
            });
          } else {
            contentTable_temp.push({
              date: MyDateString,
              Attendance: "Absent",
              "in-time": "-",
              "out-time": "-",
              duration: "-",
            });
          }
        }

        setContentTable(contentTable_temp);
        setLabels(Object.keys(myHash));
        setDatavals(Object.values(myHash));
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
    <Toaster/>
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

          {
          (startDate && endDate && contentTable.length) ? (
            <div className="employeeTable">
              <table>
                <tr>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>In-Time</th>
                  <th>Out-Time</th>
                  <th>Duration</th>
                </tr>

                {contentTable.map((row) => (
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
          )
        :
        <div></div>
        }

          <br />

          {
          
          (startDate && endDate && contentTable.length) ? (
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
          )
        :
<div className="noData margin_left">No data available !!</div>        }

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
