import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';
import Login from './Login';
import Account from './Account';
import Management from './Management';

type userDetails = {
  username : string,
  clerk : boolean,
  manager : boolean,
}

function App() {
  const [page, setPage] = useState("Login");
  const [loggedInUser, setLoggedInUser] = useState<userDetails>({username: "", clerk: false, manager : false});
  const [userBalance, setUserBalance] = useState(0);

  function logout() {
    localStorage.removeItem("token");
    setLoggedInUser({username: "", clerk: false, manager : false});
  }

  return (
    <div className="App">
      <div className="welcome">
        <div>
          {!(loggedInUser.username==="") && "Hello, " + loggedInUser.username}
        </div>
        <div>
          {!(loggedInUser.username==="") && `Money: $${userBalance}`}
        </div>
      </div>
      <div className="logout">
        {!(loggedInUser.username==="") && <button className="logoutButton" onClick={logout}>Logout</button>}
      </div>
      <nav>
        <div>
        </div>
        <div className="navigation">
          {(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Login")}>Login</button>}
          {(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Signup")}>Signup</button>}
          {!(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Reservations")}>Reservations</button>}
          {!(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Account")}>Account</button>}
          {loggedInUser.manager && <button className="navButton" onClick={() => setPage("Management")}>Managment</button>}
        </div>
      </nav>
      {(page === "Login" && <Login setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Signup" && <Signup setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Reservations" && <Calendar setUserBalance={setUserBalance} />)}
      {(page === "Account" && <Account setUserBalance={setUserBalance} />)}
      {(page === "Management" && <Management/>)}

    </div>
  )
}

export default App
