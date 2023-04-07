import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'


type States = {
    setUserBalance: ((userBalance: number) => void);
}

function Account(props : States) {

    const [userBalance, setUserBalance] = useState();
    const [reservedDays, setReservedDays] = useState<number[]>();


    


   

    return (
        <div className="container">
            <div>
                <h3>Add money to account</h3>
                <input type="text" placeholder="Amount of money" />
               
            </div>
            <div>
                <h3>Current Reservations</h3>
            </div>
            <div>
                <h3>Delete Reservation</h3>
                
            </div>
            
              
        </div>
    )
}

export default Account