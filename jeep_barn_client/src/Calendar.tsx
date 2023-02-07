import { useState } from 'react'
import './Calendar.css'

function Calendar() {
    const [date, setDate] = useState<Date>(new Date("2023-02-01T00:00:00"))
    const [serverResponse, setServerResponse] = useState("")

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

    function changeDate(day: number) {
        if (day < 10) {
            setDate(new Date(`2023-02-0${day}T00:00:00`));
        } else {
            setDate(new Date(`2023-02-${day}T00:00:00`));
        }
    }

    return (
        <div>
            <div className="calendar">
                    <h1 className="title">February</h1>
                    <div className="grid">
                        <div className="cell" style={{gridColumnStart:4}}>
                            <button className="button" onClick={() => {
                                setDate(new Date("2023-02-01T00:00:00"));
                            }}>1</button>
                        </div>
                            {Array.apply(0, Array(27)).map(function (x, i) {
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
            <div>
            </div>
        </div>
    )
}

export default Calendar
