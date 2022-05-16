import React from "react"
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./homepage.css"

const Homepage = () => {

    const history = useHistory();
    return (
        
        <div className="homepage">

            {/* <div className="navbar">  
<img src={mylogo} width= {80} height={80} />
            </div> */}

            <div className="homeOptions">
 
                <div className="loginEmployee homeOpts" onClick={ () => history.push("/login")}>
                    Login as employee
                </div>

                <button className="loginAdmin homeOpts" onClick={ () => history.push("/adminLogin")}>
                    Login as admin
                </button>

                <button className="registerEmployee homeOpts" onClick={ () => history.push("/register")}>
                    Register new employee
                </button>

            </div>



        </div>
    )
}

export default Homepage