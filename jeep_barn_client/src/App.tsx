import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';
import Login from './Login';
import Account from './Account';

type userDetails = {
  username : string,
  payroll : boolean,
}

function App() {
  const [page, setPage] = useState("Login");
  const [loggedInUser, setLoggedInUser] = useState<userDetails>({username: "", payroll: false});
  const [userBalance, setUserBalance] = useState(0);

  function logout() {
    localStorage.removeItem("token");
    setLoggedInUser({username: "", payroll: false});
  }

  return (
    <div className="App">
      <div className="welcome">
        <div>
          {!(loggedInUser.username==="") && "Hello, " + loggedInUser.username || ""}
        </div>
        <div>
          {!(loggedInUser.username==="") && `Money: $${userBalance}` || ""}
        </div>
      </div>
      <div className="logout">
        <button className="logoutButton" onClick={logout}>Logout</button>
      </div>
      <nav>
        <div>
        </div>
        <div className="navigation">
          <button className="navButton" onClick={() => setPage("Login")}>Login</button>
          <button className="navButton" onClick={() => setPage("Signup")}>Signup</button>
          <button className="navButton" onClick={() => setPage("Reservations")}>Reservations</button>
          {loggedInUser.payroll && <button className="navButton" onClick={() => setPage("Account")}>Account</button>}
          <button className="navButton" onClick={() => setPage("Other")}>Other</button>
        </div>
      </nav>
      {(page === "Login" && <Login setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Signup" && <Signup setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Reservations" && <Calendar setUserBalance={setUserBalance} />)}
      {(page === "Account" && <Account setUserBalance={setUserBalance} />)}

    </div>
  )
}

export default App
