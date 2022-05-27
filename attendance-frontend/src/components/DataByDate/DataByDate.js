import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import "./DataByDate.css";
const DataByDate = () => {
  var [dar, setdar] = useState([]);
  const [chosenDate, setChosenDate] = useState(null);

  const bydate = () => {
    fetch("/reportForGraph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        var darx = [];
        if(data['message']) {
          alert(data['message']);
          window.location.reload();
        }

        var dateUc = getFormattedDate(chosenDate);

        console.log("hash data from flask : ", data);
        let arx = Object.keys(data);
        for (var x = 0; x < arx.length; x++) {
          console.log(arx[x]);
          if (data[arx[x]][dateUc]) darx.push([arx[x], data[arx[x]][dateUc]]);
        }

        console.log("dar value :", darx);
        setdar(darx);
      })
    );
  };

  function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }
  return (
    <>
      <h2 className="dataByDateHead">
        Choose a Date to get the attendees and their details of a particular
        date
      </h2>

      <div className="dataByDateInputs">
        <DatePicker
          className="datepicker marginTop"
          placeholderText="Search By Date"
          selected={chosenDate}
          onChange={(date) => setChosenDate(date)}
          showYearDropdown
          scrollableMonthYearDropdown
        />
        <button className="reportButtonByDate" onClick={bydate}>
          Search for this date
        </button>
      </div>

      {dar && dar.length == 0 && (
        <div className="noData">No data available for this date</div>
      )}

      {chosenDate && dar.length ? (
        <div>
          <table className="marginBottom">
            <tr>
              <th>EmpNo</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Duration</th>
            </tr>

            {dar.map((row) => (
              <>
                <tr>
                  <td> {row[0]} </td>
                  <td> {row[1][0]} </td>
                  <td> {row[1][1]} </td>
                  <td> {row[1][2]} </td>
                </tr>
              </>
            ))}
          </table>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default DataByDate;
