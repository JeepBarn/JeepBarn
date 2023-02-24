import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Calendar from './Calendar';
import Signup from './Signup';

function App() {
  const [page, setPage] = useState("Reservations");

  return (
    <div className="App">
      <nav>
        <div className="navigation">
          <button className="navButton" onClick={() => setPage("Signup")}>Signup</button>
          <button className="navButton" onClick={() => setPage("Reservations")}>Reservations</button>
          <button className="navButton" onClick={() => setPage("Other")}>Other</button>
        </div>
      </nav>
      {(page === "Reservations" && <Calendar/>)}
      {(page === "Signup" && <Signup/>)}
    </div>
  )
}

export default App
