import { Bar } from "react-chartjs-2";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import "./searchByUser.css";
import toast, { Toaster } from 'react-hot-toast';

<Chart type="line" />;

const SearchByUser = () => {
 
  const [labels, setLabels] = useState([]);
  const [datavals, setDatavals] = useState([]);

  var [tableContent, setTableContent] = useState([]);
 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [empNo, setEmpNo] = useState("");

  const reporter = () => {
    fetch("/reportForGraph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        if(data['message']) {
          alert(data['message']);
          window.location.reload();
        }

        var myHash = {};
        var mymd = [];

        var currUser = data[empNo];
        if(currUser == undefined) {
          setTableContent([]);
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
            mymd.push({
              date: MyDateString,
              "Attendance": "Present",
              "in-time": v[0],
              "out-time": v[1],
              duration: v[2],
            });
          } else {
            mymd.push({
              date: MyDateString,
              "Attendance": "Absent",
              "in-time": "-",
              "out-time": "-",
              duration: "-",
            });
          }
        }

        setTableContent(mymd);
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
    <div className="searchByUser">
  
      <h2 className="dataByDateHead">
        Choose a Date to get the attendees and their details  of a particular
        date
      </h2>

      <div className="datepickerDivByUser">

        <div className="datepickerDivInsideByUser">

          <h3>Choose Start Date</h3>

          <div>
            <DatePicker
              className="datepickerByUser"
              placeholderText="Start Date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showYearDropdown
              scrollableMonthYearDropdown
            />
          </div>
        </div>

        <div className="datepickerDivInsideByUser">
          <h3>Choose End Date</h3>

          <div>
            <DatePicker
              className="datepickerByUser"
              placeholderText="End Date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showYearDropdown
              scrollableMonthYearDropdown
            />
          </div>
        </div>

        <div className="datepickerDivInside">
        <h3>Employee Number</h3>

            <input
              type="text"
              className="datepicker"
              placeholder="Enter Employee Number"
              value={empNo}
              onChange={(e) => setEmpNo(e.target.value)}
            />
          </div>
        <button className="reportButtonByUser" onClick={reporter}>
          Get Attendance Report
        </button>
      </div>

      {(startDate && endDate &&  tableContent.length) ? (
        <div className="employeeTableByUser">
          <table>
            <tr>
              <th>Date</th>
              <th>Attendance</th>
              <th>In-Time</th>
              <th>Out-Time</th>
              <th>Duration</th>
            </tr>

            {tableContent.map((row) => (
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
      (startDate && endDate && tableContent.length) ? (
        <div className="barchartByUser">
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
    <div className="noData">No data available !!</div>
    }
 
    </div>
  );
};

export default SearchByUser;
