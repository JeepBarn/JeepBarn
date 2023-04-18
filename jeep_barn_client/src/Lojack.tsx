import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react';

type Reservation = {
    id: number,
    jeepModel: string,
    reservationDate: string,
    lojacked: false
}

function Lojack() {

    const [lojackableReservations, setLojackableReservations] = useState<Reservation[]>([]);

    function removeReservation(id : number) {
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
        fetch('http://localhost:3000/jeeps/release', options)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                console.log(myJson);
            });
    }

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        }
        fetch('http://localhost:3000/lojacks', options)
            .then((response) => response.json())
            .then((myJson) => setLojackableReservations(myJson));
    }, []);

    return (
        <div className="container">
            <div>
                <h3>Jeeps to Lojack</h3>
                {
                    lojackableReservations.map((reservation, index) => (
                        <div key={reservation.id} className='grouping'>
                            <div className='toptobottom'>
                                <div>
                                    Reservation Date: { reservation.reservationDate.substring(5, 10) }-{ reservation.reservationDate.substring(0, 4) }
                                </div>
                                <div className='sidetoside'>
                                    <div className='padright'>Jeep Model: { reservation.jeepModel.substring(0, 4).toUpperCase() } { reservation.jeepModel.substring(4) }</div>
                                    <div>
                                        <button className="trashcanbutton" onClick={() => {
                                            removeReservation(reservation.id);
                                            lojackableReservations.splice(index, 1);
                                            setLojackableReservations([...lojackableReservations]);
                                        }}>Lojack</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}

export default Lojack