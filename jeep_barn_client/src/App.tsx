import { useEffect, useState } from 'react'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';
import Login from './Login';
import Account from './Account';
import Management from './Management';
import Lojack from './Lojack';

type userDetails = {
  id: number,
  username : string,
  clerk : boolean,
  manager : boolean,
}

function App() {
  const [page, setPage] = useState("Login");
  const [loggedInUser, setLoggedInUser] = useState<userDetails>({id: -1, username: "", clerk: false, manager : false});
  const [userBalance, setUserBalance] = useState(0);

  function logout() {
    localStorage.removeItem("token");
    setLoggedInUser({id: -1, username: "", clerk: false, manager : false});
    setPage("Login");
  }

  return (
    <div className="App">
      <div className="welcome">
        {!(loggedInUser.username==="") && <button className="navButton">{loggedInUser.username + " ($" + userBalance +")"}</button>}
      </div>
      <div className="logout">
        {!(loggedInUser.username==="") && <button className="logoutButton" onClick={logout}>Logout</button>}
      </div>
      <nav>
        <div className="navigation">
          {(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Login")}>Login</button>}
          {(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Signup")}>Signup</button>}
          {!(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Reservations")}>Reservations</button>}
          {!(loggedInUser.username==="") && <button className="navButton" onClick={() => setPage("Account")}>Account</button>}
          {loggedInUser.manager && <button className="navButton" onClick={() => setPage("Management")}>Managment</button>}
          {loggedInUser.clerk && <button className="navButton" onClick={() => setPage("Lojack")}>Lojack</button>}
        </div>
      </nav>
      {(page === "Login" && <Login setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Signup" && <Signup setLoggedInUser={setLoggedInUser} setUserBalance={setUserBalance} />)}
      {(page === "Reservations" && <Calendar setUserBalance={setUserBalance} />)}
      {(page === "Account" && <Account setUserBalance={setUserBalance} userId={loggedInUser.id}/>)}
      {(page === "Management" && <Management/>)}
      {(page === "Lojack" && <Lojack/>)}
    </div>
  )
}

export default App
