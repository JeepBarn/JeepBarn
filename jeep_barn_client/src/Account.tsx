import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'
//import './Account.css'

type States = {
    userId: Number;
    setUserBalance: ((userBalance: number) => void);
}

type Reservation = {
    id: number,
    jeepModel: string,
    reservationDate: string,
    lojacked: false
}

function Account(props : States) {
    const [moneyVal, setMoneyVal] = useState("");
    const [reservedDays, setReservedDays] = useState<Reservation[]>([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        }
        fetch('http://localhost:3000/res/' + props.userId, options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                setReservedDays(myJson);
            }
        );

        setReservedDays(reservedDays);
    }, []);

    function cancelReservation(id : number) {
        const data = {
            id
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/jeeps/cancel', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                props.setUserBalance(myJson.balance);
            });
    }

    async function updateMoneyVal() {
        const data = {
            userId: props.userId,
            money: Number(moneyVal)
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',                
                'Authorization': `bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/money', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                props.setUserBalance(myJson.user.balance);
            }
        );

        setMoneyVal("");
    }

    return (
        <div className="container">
            <div>
                <h3>Add money</h3>
                <input type="number" placeholder="Amount of money" onChange={(e)=>{setMoneyVal(e.target.value)}} className='input' value={moneyVal}/>
                <button className="addMoney" onClick={updateMoneyVal}>Add Money</button>
            </div>
            <div>
                <h3>Current Reservations</h3>
                {
                    reservedDays.map((day, index) => (
                        <div key={day.id} className='grouping'>
                            <div className='toptobottom'>
                                <div className='sidetoside'>
                                    <div className='padright'>Jeep Model: { day.jeepModel.substring(0, 4).toUpperCase() } { day.jeepModel.substring(4) } {day.lojacked ? "(Insured)" : ""}</div>
                                    <div>
                                        <button className="trashcanbutton" onClick={() => {
                                            cancelReservation(day.id);
                                            reservedDays.splice(index, 1);
                                            setReservedDays([...reservedDays]);
                                        }}><svg width="20" height="16" viewBox="0 0 1024 1024">
                                            <path d="M192 1024h640l64-704h-768zM640 128v-128h-256v128h-320v192l64-64h768l64 64v-192h-320zM576 
                                            128h-128v-64h128v64z"></path></svg></button>
                                    </div>
                                </div>
                                <div>
                                    Reservation Date: { day.reservationDate.substring(5, 10) }-{ day.reservationDate.substring(0, 4) }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Account