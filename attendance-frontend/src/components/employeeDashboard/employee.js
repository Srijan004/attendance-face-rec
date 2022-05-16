import { useHistory } from "react-router-dom"

const Employee = () => {

    const history = useHistory()

    return ( 

<div> 

<h1>Employee Dashboard</h1>

<div className="employeeOptions">

<button className="employeeOpts homeOpts" onClick={ () => history.push("/markAttendance")}>Mark attendance In </button>
<button className="employeeOpts homeOpts" onClick={ () => history.push("/markAttendanceOut")}>Mark attendance Out</button>
<button className="employeeOpts homeOpts" onClick={ () => history.push("/employeeProfile")}>View Profile</button>
<button className="employeeOpts homeOpts" onClick={ () => {
    
    localStorage.setItem("MyUser", JSON.stringify({}));
    history.push("/")}
    
    }>Logout</button>

</div>


</div>

     );
}
 
export default Employee;