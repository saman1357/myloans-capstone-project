import {Link} from "react-router-dom";
import {Item, Loan, Person, UserWithoutPassword} from "../model/DataModels.ts";
import React, {useEffect, useState} from "react";

type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    user?: UserWithoutPassword,
    onLogout: ()=>void
}
export default function LoanList(props: Props) {
    const [loanSum, setLoanSum] = useState<{ lent: number, borrowed: number }>({lent: 0, borrowed: 0})
    const [filter, setFilter] = useState("-1");
    const [filteredLoans, setFilteredLoans] = useState(props.loans);

    useEffect(calculation, [filteredLoans, props.user?.id]);
    useEffect(filterLoans, [filter, props.loans])


    function filterLoans() {
        if (filter === "-1") {
            setFilteredLoans(props.loans);
        } else {
            setFilteredLoans(props.loans.filter(loan => loan.otherPartyId === filter));
        }
    }

    function calculation() {
        let lentSum = 0;
        let borrowedSum = 0;
        if (filteredLoans) {
            filteredLoans.filter(loan => (loan.itemId === "1001" && loan.type === "lent")).forEach(loan => {
                lentSum += loan.amount;
            })

            filteredLoans.filter(loan => (loan.itemId === "1001" && loan.type === "borrowed")).forEach(loan => {
                borrowedSum += loan.amount;
            })
            setLoanSum({lent: lentSum, borrowed: borrowedSum});
        }
    }

    function handleChangeFilter(event: React.ChangeEvent<HTMLSelectElement>) {
        setFilter(event.target.value);
    }

    function loanWindow(loanType: "lent" | "borrowed") {
        return (
            <div className={"loan-div"}>
                <div className={"loan-header-div"}>
                    <div>{loanType === "lent" ? "lent to: " : "borrowed from: "}</div>
                    <div><Link to={"/addloan/" + loanType}>
                        <button>Add</button>
                    </Link></div>
                </div>
                <hr/>
                <div className={"loan-table-div"}>
                    {filteredLoans.filter(loan => loan.type === loanType).map((loan) => {
                        return <Link to={"/" + loan.id} key={loan.id}>
                            <div className={"loan-table-row-div"}>
                                <div
                                    className={"loan-party-item"}>{props.persons.find(person => person.id === loan.otherPartyId)?.name}</div>
                                <div className={"amount-item"}>{loan.amount}</div>
                                <div
                                    className={"item-item"}>{props.items.find(item => item.id === loan.itemId)?.type.charAt(0)==="€"? "€" : "-"}</div>
                                <div className={"description-item"}>{loan.description}</div>

                            </div>
                        </Link>
                    })
                    }
                </div>
                <div className={"loan-footer-div"}>
                    <hr/>
                    sum of
                    monetary {loanType==="lent"? "lendings" : "borrowings"}: {loanSum[loanType]} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
                </div>
            </div>
        )
    }

    if (filteredLoans) {
        return (
            <>
                <div className={"app-title"}>
                    <div className={"back-div"}></div>
                    <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                    <div>
                        {props.user?.username}
                        <br/>
                        <button onClick={props.onLogout}>logout</button>
                    </div>
                </div>
                <div className={"loan-filter-div"}>
                    <label htmlFor={"person-filter"}>filter: </label>
                    <select id={"personId"} name={"personId"} value={filter}
                            onChange={handleChangeFilter}>
                        <option value={"-1"}>{"show all"}</option>
                        {props.persons.map(person => {
                            return (<option key={person.id} value={person.id}>{person.name}</option>)
                        })}
                    </select>
                </div>
                {loanWindow("lent")}
                {loanWindow("borrowed")}
                <div className={"loan-balance-div"}>
                    loan balance (for
                    money): {loanSum.lent - loanSum.borrowed} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
                </div>
            </>
        )
    } else {
        return <h1>loading...</h1>
    }
}
