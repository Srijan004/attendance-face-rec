import React, {useState} from "react"
import Webcam from 'react-webcam';

import axios from "axios"
import { useHistory } from "react-router-dom"

const Login = ({ updateUser}) => {

    

    const history = useHistory()

    const [ user, setUser] = useState({
        empno:"",
        password:""
    })



    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })

        console.log(user);
    }

    // const login = () => {
    //     axios.post("/login", user)
    //     .then(res => {
    //         console.log(res);
    //         // history.push("/")
    //     })
    // }

    const login = () => {

        fetch("/login",
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

            if(data['poss'] == 0) {
                
                alert("invalid credentials")

                setUser({});

                window.location.reload();

            } else {
                localStorage.setItem("MyUser", JSON.stringify(user.empno));
                history.push("/employee");
            }


        })
    );


    }
    return (
        
        <div className="login">
            {/* <Webcam />  */}
            <h1>Login</h1>
            <input type="text" name="empno" value={user.empno} onChange={handleChange} placeholder="Enter your employee number"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" ></input>
            <div className="button" onClick={login}>Login</div>
            <div>or</div>
            <div className="button" onClick={() => history.push("/register")}>Register</div>
        </div>
    )
}

export default Login