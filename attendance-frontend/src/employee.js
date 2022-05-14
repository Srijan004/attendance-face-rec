import { useHistory } from "react-router-dom"

const Employee = () => {

    const history = useHistory()

    return ( 

<div> 

<h1>Employee Dashboard</h1>

<div className="employeeOptions">

<button className="employeeOpts" onClick={ () => history.push("/markAttendance")}>Mark attendance</button>
<button className="employeeOpts" onClick={ () => history.push("/employeeProfile")}>View Profile</button>
<button className="employeeOpts" onClick={ () => {
    
    localStorage.setItem("MyUser", JSON.stringify({}));
    history.push("/")}
    
    }>Logout</button>

</div>


</div>

     );
}
 
export default Employee;