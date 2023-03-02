import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Signup.css'

type States = {
    setLoggedInUser: ((loggedInUser: string) => void);
    setUserBalance: ((userBalance: number) => void);
}

function Signup(props : States) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [serverResponse, setServerResponse] = useState("");

    function createAccount() {
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
        fetch('http://localhost:3000/signup', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (myJson.token) {
                    localStorage.setItem("token", myJson.token);
                    props.setLoggedInUser(myJson.user.username);
                    props.setUserBalance(myJson.user.balance);
                    setServerResponse("Account created!");
                }
            });
    }

    return (
        <div className="container">
            <div className="loginForm">
                <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                <button className="submit" onClick={createAccount}>Submit</button>
            </div>
            <p>{serverResponse}</p>
        </div>
    );

}

export default Signup
