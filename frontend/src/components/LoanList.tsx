import {Link} from "react-router-dom";
import {Item, Loan, Person} from "../model/DataModels.ts";
import React, {useEffect, useState} from "react";
type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    myId: string,
}
export default function LoanList(props: Props){
    const [loanSum, setLoanSum]=useState<{ lent: number, borrowed: number }>({lent: 0,borrowed:0})
    const [filter, setFilter]=useState("-1");
    const [filteredLoans, setFilteredLoans]=useState(props.loans);

    useEffect(filterAndCalculation, [props, filter, filteredLoans]);



    function filterAndCalculation() {
        if (filter==="-1"){
            setFilteredLoans(props.loans);
        } else {
            setFilteredLoans(props.loans.filter(loan=>(loan.lenderId===filter || loan.borrowerId===filter)));
        }
        let lentSum= 0;
        let borrowedSum=0;
        if (filteredLoans) {
            filteredLoans.filter(loan => (loan.itemId === "1001" && loan.lenderId === props.myId)).forEach(loan => {
                lentSum += loan.amount;
            })

            filteredLoans.filter(loan => (loan.itemId === "1001" && loan.borrowerId === props.myId)).forEach(loan => {
                borrowedSum += loan.amount;
            })
            setLoanSum({lent:lentSum, borrowed:borrowedSum});
        }
    }

    function handleChangeFilter(event: React.ChangeEvent<HTMLSelectElement>){
        setFilter(event.target.value);
    }

    function loanWindow(loanType:"lent"|"borrowed"){
        let lenderOrBorrower : "lenderId" | "borrowerId";
        let otherLoanParty : "borrowerId" | "lenderId";
        if (loanType==="lent"){
            lenderOrBorrower="lenderId";
            otherLoanParty="borrowerId";
        } else {
            lenderOrBorrower="borrowerId";
            otherLoanParty="lenderId";
        }
        return(
            <div className={"loan-div"}>
            <div className={"loan-header-div"}>
                <div>{loanType==="lent"? "lent to: " : "borrowed from: "}</div>
                <div><Link to={"/addloan/"+loanType}><button>Add</button></Link></div>
            </div>
            <hr/>
            <div className={"loan-table-div"}>
                {filteredLoans.filter(loan => loan[lenderOrBorrower] === props.myId).map((loan) => {
                    return <Link to={"/"+loan.id} key={loan.id}><div className={"loan-table-row-div"}>
                        <div className={"loan-party-item"}>{props.persons.find(person => person.id === loan[otherLoanParty])?.name}</div>
                        <div className={"amount-item"}>{loan.amount}</div>
                        <div className={"item-item"}>{props.items.find(item => item.id === loan.itemId)?.type}</div>
                        <div className={"description-item"}>{loan.description}</div>

                    </div></Link>
                })
                }
            </div>
            <div className={"loan-footer-div"}>
                <hr/>
                sum of monetary {lenderOrBorrower.slice(0,-4)}ings: {loanSum[loanType]} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
            </div>
        </div>
        )
    }
if(filteredLoans) {
    return (
        <>
            <div>
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
}
else {
    return <h1>loading...</h1>
}
}
