import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Signup.css'

type userDetails = {
    username : string,
    clerk : boolean,
    manager : boolean,
}

type States = {
    setLoggedInUser: ((userDetails: userDetails) => void);
    setUserBalance: ((userBalance: number) => void);
}

function Signup(props : States) {

    const handleChange = (event : React.ChangeEvent<HTMLSelectElement>) => {

        setusertype(event.currentTarget.value);

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
                    props.setLoggedInUser({
                        username : myJson.user.username,
                        clerk : myJson.user.permissions.clerk,
                        manager: myJson.user.permissions.manager
                    });
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
                    <select className="roles" name="usertype" id="1" value={usertype} onChange={handleChange}>
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
