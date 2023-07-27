import './App.css'
import {useEffect, useState} from "react";
import {Item, Loan, Person} from "./model/DataModels.ts";
import axios from "axios";

export default function App() {
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();
    const [lentSum, setLentSum] = useState<number>(0);
    const [borrowedSum, setBorrowedSum] = useState<number>(0);

    const myId = "0001";

    useEffect(getMyLoansData, []);
    useEffect(calculateSums, [loans]);

    function getMyLoansData() {
        axios.get("api/myloans")
            .then(response => {
                setLoans(response.data.loans);
                setItems(response.data.items);
                setPersons(response.data.persons);
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    function calculateSums() {
        let sum = 0;
        if (loans) {
            loans.filter(loan => (loan.itemId === "1001" && loan.lenderId === myId)).forEach(loan => {
                sum += loan.amount;
            })
            setLentSum(sum);

            sum = 0;
            loans.filter(loan => (loan.itemId === "1001" && loan.borrowerId === myId)).forEach(loan => {
                sum += loan.amount;
            })
            setBorrowedSum(sum);
        }
    }

    if (!(loans && items && persons)) {
        return <h1>... loading ...</h1>
    }

    return (
        <>
            <div>
                <div className={"app-title"}>
                    <img src={"dist/myLoansTransparent.jpg"} alt={"myLoans Logo"} width={"100"}/>
                </div>
                <div className={"lent-div"}>
                    <div className={"lent-header-div"}>
                        lent to:
                        <hr/>
                    </div>
                    <div className={"lent-table-div"}>
                        {loans.filter(loan => loan.lenderId === myId).map((loan, i) => {
                            return <div className={"lent-table-row-div"} key={i}>
                                <div
                                    className={"borrower-item"}>{persons.find(person => person.id === loan.borrowerId)?.name}</div>
                                <div className={"amount-item"}>{loan.amount}</div>
                                <div className={"item-item"}>{items.find(item => item.id === loan.itemId)?.type}</div>
                                <div className={"description-item"}>{loan.description}</div>

                            </div>
                        })
                        }
                    </div>
                    <div className={"lent-footer-div"}>
                        <hr/>
                        sum (for money): {lentSum} {items.find(item => item.id === "1001")?.type.charAt(0)}
                    </div>
                </div>


                <div className={"borrowed-div"}>
                    <div className={"borrowed-header-div"}>
                        borrowed from:
                        <hr/>
                    </div>
                    <div className={"borrowed-table-div"}>
                        {loans.filter(loan => loan.borrowerId === myId).map((loan, i) => {
                            return <div className={"borrowed-table-row-div"} key={i}>
                                <div
                                    className={"lender-item"}>{persons.find(person => person.id === loan.lenderId)?.name}</div>
                                <div className={"amount-item"}>{loan.amount}</div>
                                <div className={"item-item"}>{items.find(item => item.id === loan.itemId)?.type}</div>
                                <div className={"description-item"}>{loan.description}</div>

                            </div>
                        })
                        }
                    </div>
                    <div className={"borrowed-footer-div"}>
                        <hr/>
                        sum (for money): {borrowedSum} {items.find(item => item.id === "1001")?.type.charAt(0)}
                    </div>
                </div>

                <div className={"loan-balance-div"}>
                    loan balance (for
                    money): {lentSum - borrowedSum} {items.find(item => item.id === "1001")?.type.charAt(0)}
                </div>

            </div>
        </>
    )
}

