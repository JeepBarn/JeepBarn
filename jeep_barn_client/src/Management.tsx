import { useState, useEffect, ChangeEventHandler, ChangeEvent, useReducer } from 'react';

type User = {
    id : number,
    username : string,
    passwordHash : string,
    balance : number,
}

function Management() {

    const [clerks, setClerks] = useState<User[]>([]);
    const [clerkPayments, setClerkPayments] = useState<Number[]>([]);

    async function updateMoneyVal(clerkId: number, money : number) {
        const data = {
            userId: clerkId,
            money,
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
                console.log(myJson);
            }
        );
    }

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
                {clerks.map((clerk, index) => {
                    return (
                        <div key={clerk.id}>
                            <h3>{clerk.username} - ${clerk.balance}</h3>
                            <input value={clerkPayments[index] ? clerkPayments[index].toString() : ""} onChange={
                                (e) => {
                                    clerkPayments[index] = Number(e.target.value);
                                    setClerkPayments([...clerkPayments]);
                                }
                            } type="number"/><button onClick={(e) => {
                                clerk.balance = clerk.balance + Number(clerkPayments[index]);
                                setClerks([...clerks]);
                                updateMoneyVal(clerk.id, Number(clerkPayments[index]));
                            }}>Pay</button>
                        </div>
                    )
                })}
            </div>
        </div>
    );

}

export default Management