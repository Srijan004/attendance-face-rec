import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import "./DataByDate.css";
import toast, { Toaster } from "react-hot-toast";

const DataByDate = () => {
  var [table_content, setTableContent] = useState([]);
  const [chosenDate, setChosenDate] = useState(null);

  const bydate = () => {
    fetch("/reportForGraph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) =>
      res.json().then((data) => {
        var tableContent_temp = [];
        if (data["message"]) {
          toast.error(data["message"]);
          return;
        }

        var date_under_consideration = getFormattedDate(chosenDate);

        let array_of_dates = Object.keys(data);
        for (var x = 0; x < array_of_dates.length; x++) {
          if (data[array_of_dates[x]][date_under_consideration])
            tableContent_temp.push([
              array_of_dates[x],
              data[array_of_dates[x]][date_under_consideration],
            ]);
        }

        setTableContent(tableContent_temp);
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
      <Toaster />
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

      {table_content && table_content.length == 0 && (
        <div className="noData">No data available for this date</div>
      )}

      {chosenDate && table_content.length ? (
        <div>
          <table className="marginBottom">
            <tr>
              <th>EmpNo</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Duration</th>
            </tr>

            {table_content.map((row) => (
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
