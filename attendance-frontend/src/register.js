import React, { useState,useEffect } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"

const Register = () => {

    const history = useHistory()

    const [ user, setUser] = useState({
        name: "",
        empno:"",
        email:"",
        password:"",
        reEnterPassword: ""
    })

    const handleChange = e => {

        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const register = () => {


        const { name, empno, email, password, reEnterPassword } = user
        if( name && email && password && (password === reEnterPassword) && empno){

            fetch("/register",
            {
                        'method':'POST',
                         headers : {
                        'Content-Type':'application/json'
                  },
                  body:JSON.stringify(user)
                }
            ).then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                // setdata({
                //     name: data.Name,
                //     age: data.Age,
                //     date: data.Date,
                //     programming: data.programming,
                // });

                console.log("Huo getUser resp : ", data)

                if(data['empno'] == 0) {
                    
                    alert("same empno")

                    setUser({});

                    window.location.reload();

                } else {
                    localStorage.setItem("MyUser", JSON.stringify(user.empno));
                    history.push("/clickTraining");
                }


            })
        );
    }
        //     fetch(`/register`,{
        //         'method':'POST',
        //          headers : {
        //         'Content-Type':'application/json'
        //   },
        //   body:JSON.stringify(user)
        // })
        // .then((response) => {
            
        //      console.log("hi from flask", response) 
        //     // history.push("/login");
        //     response.json()
        // })
        // .catch(error => console.log(error))
        
    
            
    }

    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/getUser").then((res) =>
            res.json().then((data) => {
                // Setting a data from api
                // setdata({
                //     name: data.Name,
                //     age: data.Age,
                //     date: data.Date,
                //     programming: data.programming,
                // });

                console.log("Huo getUser resp : ", data['Age'])
            })
        );
    }, []);

    return (
        <div className="register">
            {console.log("User", user)}
            <h1>Register</h1>
            <input type="text" name="name" value={user.name} placeholder="Your Name" onChange={ handleChange }></input>
            <input type="empno" name="empno" value={user.empno} placeholder="Employee number" onChange={ handleChange }></input>
            <input type="text" name="email" value={user.email} placeholder="Your Email" onChange={ handleChange }></input>
            <input type="password" name="password" value={user.password} placeholder="Your Password" onChange={ handleChange }></input>
            <input type="password" name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={ handleChange }></input>
            <div className="button" onClick={register} >Register</div>
            <div>or</div>
            <div className="button" onClick={() => history.push("/login")}>Login</div>
        </div>
    )
}

export default Register