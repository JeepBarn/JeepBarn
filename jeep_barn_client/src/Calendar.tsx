import { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react'
import './Calendar.css'

function Calendar() {

    // Array to convert integers to month names
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Currently selected reservation date
    const [date, setDate] = useState<Date>(new Date())
    const [serverResponse, setServerResponse] = useState("")
    const initialMonth = date.getMonth();

    // Calculates days to display
    function daysInMonth(date : Date) {
        return (new Date(date.getFullYear(), date.getMonth()+1, 0)).getDate();
    }

    // Sends PUT request to server to reserve date
    function reserveDate() {
        const data = {
            date,
        }
        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                setServerResponse(JSON.stringify(myJson));
            });
    }

    function firstOfMonth() {
        const updatedDate = new Date(date.getTime());
        updatedDate.setDate(1);
        return updatedDate.getDay();
    }

    // Changes the selected reservation date
    function changeDate(newDay: number) {
        const updatedDate = new Date(date.getTime());
        updatedDate.setDate(newDay);
        setDate(updatedDate);
    }

    function changeMonth(onChangeEvent : ChangeEvent<HTMLSelectElement>) {
        const newMonth = Number(onChangeEvent.currentTarget.value);
        const updatedDate = new Date(date.getTime());
        updatedDate.setMonth(newMonth);
        setDate(updatedDate);
    }

    function changeYear(onChangeEvent : ChangeEvent<HTMLSelectElement>) {
        const newYear = Number(onChangeEvent.currentTarget.value);
        const updatedDate = new Date(date.getTime());
        updatedDate.setFullYear(newYear);
        setDate(updatedDate);
    }

    return (
        <div className="container">
            <div>
                <select className="select" value={initialMonth} onChange={changeMonth}>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">Obtober</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>
                <select className="select" onChange={changeYear}>
                    {Array.apply(0, Array(11)).map(function (x, i) {
                        const currentYear = (new Date()).getFullYear();
                        return (
                            <option value={currentYear+i}>{currentYear+i}</option>
                        )
                    })}
                </select>
            </div>
            <div className="calendar">
                <h1 className="title">{months[date.getMonth()]}</h1>
                <div className="grid">
                    <div className="cell" style={{gridColumnStart:firstOfMonth()+1}}>
                        <button className="button" onClick={() => {
                            setDate(date);
                        }}>1</button>
                    </div>
                        {Array.apply(0, Array(daysInMonth(date)-1)).map(function (x, i) {
                            const day = i+2;
                            return (
                                <div className="cell">
                                    <button className="button" onClick={() => changeDate(day)}>{day}</button>
                                </div>
                            )
                        })}
                </div>
                <button className="reserve" onClick={reserveDate}>Reserve: {date.toDateString()}</button>
                <h2>Server Response: {serverResponse}</h2>
            </div>
        </div>
    )
}

export default Calendar
