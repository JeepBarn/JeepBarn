import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Signup.css'

type States = {
    setLoggedInUser: ((loggedInUser: string) => void);
    setUserBalance: ((userBalance: number) => void);
}

function Signup(props : States) {
    const [value, setValue] = useState("");

    const handleChange = (event) => {

    setValue(event.target.value);

    };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [serverResponse, setServerResponse] = useState("");
    const [usertype, setusertype] = useState("");

    function createAccount() {
        const data = {
            username,
            password,
            usertype,
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
                <label>
                    <select name="usertype" id="1" value={value} onChange={handleChange}>
                        <option value="customer">Customer</option>
                        <option value="clerk">Clerk</option>
                        <option value="manager">Manager</option>
                    </select>                    
                </label>
                
                                                
                <button className="submit" onClick={createAccount}>Submit</button>
            </div>
            <p>{serverResponse}</p>
        </div>
    );

}

export default Signup
