import React from "react"
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Homepage = () => {

    const history = useHistory();
    return (
        
        <div className="homepage">

            <div className="navbar">  
                <h3>Services</h3>
                <h3>About Me</h3>
                <h3>How to use</h3>
            
            </div>

            <h1 >PG FINDER WELCOMES YOU</h1>

            <div className="homeOptions">
 
                <button className="loginEmployee homeOpts" onClick={ () => history.push("/login")}>
                    Login as employee
                </button>

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