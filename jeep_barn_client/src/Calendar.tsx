import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Calendar.css'

function Calendar() {

    // Array to convert integers to month names
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Currently selected reservation date
    const [serverResponse, setServerResponse] = useState("");
    const [monthIndex, setMonthIndex] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [day, setDay] = useState<number>(new Date().getDay());
    const [reservedDays, setReservedDays] = useState<number[]>();

    // Updates reserved dates on month change
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY3NzE4MjA4MH0.HGE_79Ey6ESG3emQryAujSHLYrCBuS6_8KUbwyGY5Qs'
            },
        }
        fetch('http://localhost:3000/jeeps/'+year+'/'+monthIndex, options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                setReservedDays(myJson);
                setServerResponse(myJson);
            });
    }, [monthIndex, year]);
    
    // Calculates days to display
    function daysInMonth() {
        return (new Date(year, monthIndex+1, 0)).getDate();
    }

    // Sends PUT request to server to reserve date
    function reserveDate() {
        const jeepModel = "jeepjeep";
        const reservationDate = new Date(year, monthIndex+1, day).toISOString();
        const data = {
            jeepModel,
            reservationDate,
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization' : 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY3NzE4MjA4MH0.HGE_79Ey6ESG3emQryAujSHLYrCBuS6_8KUbwyGY5Qs'
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/jeeps/reserve', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (reservedDays)
                setReservedDays([...reservedDays, day]);
                setServerResponse(JSON.stringify(myJson));
            });
    }

    function firstOfMonth() {
        const updatedDate = new Date(year, monthIndex+1, day);
        updatedDate.setDate(1);
        return updatedDate.getDay();
    }

    // Changes the selected reservation date
    function changeDay(newDay: number) {
        setDay(newDay);
    }

    function changeMonth(onChangeEvent : ChangeEvent<HTMLSelectElement>) {
        const newMonth = Number(onChangeEvent.currentTarget.value);
        setMonthIndex(newMonth);
    }

    function changeYear(onChangeEvent : ChangeEvent<HTMLSelectElement>) {
        const newYear = Number(onChangeEvent.currentTarget.value);
        setYear(newYear);
    }

    return (
        <div className="container">
            <div>
                <select className="select" value={monthIndex} onChange={changeMonth}>
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
                <h1 className="title">{months[monthIndex]}</h1>
                <div className="grid">
                    <div className="cell" style={{gridColumnStart:firstOfMonth()+1}}>
                        <button className={reservedDays?.includes(1) && "reservedButton" || "button"} onClick={() => {
                            changeDay(1);
                        }}>1</button>
                    </div>
                        {Array.apply(0, Array(daysInMonth()-1)).map(function (x, i) {
                            const day = i+2;
                            return (
                                <div className="cell">
                                    <button className={reservedDays?.includes(day) && "reservedButton" || "button"} onClick={() => changeDay(day)}>{day}</button>
                                </div>
                            )
                        })}
                </div>
                <button className="reserve" onClick={reserveDate}>Reserve: {new Date(year, monthIndex, day).toDateString()}</button>
                <h2>Server Response: {serverResponse}</h2>
            </div>
        </div>
    )
}

export default Calendar
