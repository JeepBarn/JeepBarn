import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react'


type States = {
    setUserBalance: ((userBalance: number) => void);
}

function Account(props : States) {

    const [userBalance, setUserBalance] = useState();


    


   

    return (
        <div className="container">
            <div>
                <h3>Add money to account</h3>
                <input type="text" placeholder="Amount of money" />
               
            </div>
            
              
        </div>
    )
}

export default Account