import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react';

type User = {
    id : number,
    username : string,
    passwordHash : string,
    balance : number,
}

function Management() {

    const [clerks, setClerks] = useState<User[]>([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        }
        fetch('http://localhost:3000/clerks', options)
            .then((response) => response.json())
            .then((myJson) => setClerks(myJson));
    }, []);

    return (
        <div className="container">
            <div>
                {clerks.map((clerk) => {
                    return (
                        <div key={clerk.id}>{clerk.username}</div>
                    )
                })}
            </div>
        </div>
    );

}

export default Management