import accessDenied from "../../images/accessDenied.png";
import './AccessDenied.css'
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const AccessDenied = () => {
    
    const history = useHistory();
    return ( 
        
        <div className="accessDenied">

<img src={accessDenied} className='accessDeniedImg' alt="" srcset="" />

<Link to="/">
<button className="reportButton" >Go back to home page</button>
</Link>
        </div>



     );
}
 
export default AccessDenied;