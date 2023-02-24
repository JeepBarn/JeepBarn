import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';
import Login from './Login';

function App() {
  const [page, setPage] = useState("Login");
  const [loggedInUser, setLoggedInUser] = useState("");

  function updateLoggedInUser(loggedInUser : string) {
    setLoggedInUser(loggedInUser);
  }

  function logout() {
    localStorage.removeItem("token");
    setLoggedInUser("");
  }

  return (
    <div className="App">
      <div className="welcome">
        {!(loggedInUser==="") && "Hello, " + loggedInUser || ""}
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
      {(page === "Login" && <Login setLoggedInUser={updateLoggedInUser} />)}
      {(page === "Signup" && <Signup setLoggedInUser={updateLoggedInUser} />)}
      {(page === "Reservations" && <Calendar />)}
    </div>
  )
}

export default App
