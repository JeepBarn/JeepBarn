import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Signup.css'

type userDetails = {
    id: number,
    username : string,
    manager : boolean,
    clerk : boolean,
}

type States = {
    setLoggedInUser: ((userDetails: userDetails) => void);
    setUserBalance: ((userBalance: number) => void);
}

function Login(props : States) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [serverResponse, setServerResponse] = useState("");

    function loginAccount() {
        const data = {
            username,
            password,
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/login', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (myJson.token) {
                    localStorage.setItem("token", myJson.token);
                    props.setLoggedInUser({
                        id: myJson.user.id,
                        username : myJson.user.username,
                        clerk : myJson.user.permissions.clerk,
                        manager: myJson.user.permissions.manager
                    });
                    props.setUserBalance(myJson.user.balance);
                    setServerResponse("Logged in!");
                } else {
                    setServerResponse("Invalid username or password");
                }
            });
    }

    return (
        <div className="container">
            <div className="loginForm">
                <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                <button className="submit" onClick={loginAccount}>Submit</button>
            </div>
            <p>{serverResponse}</p>
        </div>
    );

}

export default Login
