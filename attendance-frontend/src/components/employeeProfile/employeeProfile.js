
import "./employeeProfile.css"; 

const EmployeeProfile = () => {
    return ( 
<>
{    (loginCheck.empno) ? 

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
          <div className="detailLabels">Employee Number- {detail.empno}</div>
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

      {startDate && endDate && (

        
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

      {startDate && endDate && (
        <div className="barchart">
          <Bar
            data={{
              labels: labels,
              datasets: [
                {
                  label: "No of working hours",
                  data: datavals,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)"
                  ],
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

    :

    <Login />
    
}
    </>

     );
}
 
export default EmployeeProfile;