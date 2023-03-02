import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
import './Calendar.css'
import jeep50 from './assets/jeep50.png'
import jeep100 from './assets/jeep100.png'
import jeep150 from './assets/jeep150.png'

type States = {
    setUserBalance: ((userBalance: number) => void);
}

function Calendar(props : States) {

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
    const [jeepModel, setJeepModel] = useState("jeep50");
    const [jeepPrice, setJeepPrice] = useState(50);

    // Updates reserved dates on month change
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        }
        fetch('http://localhost:3000/jeeps/'+jeepModel+'/'+year+'/'+monthIndex, options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                setReservedDays(myJson);
            });
    }, [monthIndex, year, jeepModel]);
    
    // Calculates days to display
    function daysInMonth() {
        return (new Date(year, monthIndex+1, 0)).getDate();
    }

    // Sends PUT request to server to reserve date
    function reserveDate() {
        const reservationDate = new Date(year, monthIndex+1, day).toISOString();
        const data = {
            jeepModel,
            reservationDate,
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/jeeps/reserve', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                if (!(myJson.message)) {
                    if (reservedDays) {
                        setReservedDays([...reservedDays, day]);
                    }
                    props.setUserBalance(myJson.user.balance);
                    setServerResponse("Reserved!");
                } else {
                    setServerResponse(myJson.message);
                }
            });
    }

    function firstOfMonth() {
        const updatedDate = new Date(year, monthIndex, day);
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

    function selectJeepModels(model : string, price : number) {
        setJeepModel(model);
        setJeepPrice(price);
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
                            <option key={1000+i} value={currentYear+i}>{currentYear+i}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <button className="jeepButton" onClick={() => selectJeepModels("jeep50", 50)} >
                    <img src={jeep50} alt="jeep50" width="60em" height="60em" />
                    <div>50</div>
                </button>
                <button className="jeepButton" onClick={() => selectJeepModels("jeep100", 100)} >
                    <img src={jeep100} alt="jeep100" width="60em" height="60em" />
                    <div>100</div>
                </button>
                <button className="jeepButton" onClick={() => selectJeepModels("jeep150", 150)} >
                    <img src={jeep150} alt="jeep150" width="60em" height="60em" />
                    <div>150</div>
                </button>
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
                                <div key={2000+i} className="cell">
                                    <button className={reservedDays?.includes(day) && "reservedButton" || "button"} onClick={() => changeDay(day)}>{day}</button>
                                </div>
                            )
                        })}
                </div>
                <button className="reserve" onClick={reserveDate}>Reserve ${jeepPrice} Jeep for {`${months[monthIndex]} ${day}, ${year}`}</button>
                {serverResponse}
            </div>
        </div>
    )
}

export default Calendar
