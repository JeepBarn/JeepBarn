import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';
import Login from './Login';

function App() {
  const [page, setPage] = useState("Login");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  function logout() {
    localStorage.removeItem("token");
    setLoggedInUser("");
  }

  return (
    <div className="App">
      <div className="welcome">
        <div>
          {!(loggedInUser==="") && "Hello, " + loggedInUser || ""}
        </div>
        <div>
          {!(loggedInUser==="") && `Money: $${userBalance}` || ""}
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
          <button className="navButton" onClick={() => setPage("Other")}>Other</button>
        </div>
      </nav>
      {(page === "Login" && <Login setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Signup" && <Signup setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Reservations" && <Calendar setUserBalance={setUserBalance} />)}
    </div>
  )
}

export default App
