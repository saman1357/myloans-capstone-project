import {Link} from "react-router-dom";
import {Item, Loan, Person} from "../model/DataModels.ts";
import {useEffect, useState} from "react";
type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    myId: string,
}
export default function LoanList(props: Props){
    const [loanSum, setLoanSum]=useState<{ lent: number, borrowed: number }>({lent: 0,borrowed:0})

    useEffect(calculateSums, [props]);



    function calculateSums() {
        let lentSum= 0;
        let borrowedSum=0;
        if (props.loans) {
            props.loans.filter(loan => (loan.itemId === "1001" && loan.lenderId === props.myId)).forEach(loan => {
                lentSum += loan.amount;
            })

            props.loans.filter(loan => (loan.itemId === "1001" && loan.borrowerId === props.myId)).forEach(loan => {
                borrowedSum += loan.amount;
            })
            setLoanSum({lent:lentSum, borrowed:borrowedSum});
        }
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
                <div>{loanType} to:</div>
                <div><Link to={"/addloan/"+loanType}><button>Add</button></Link></div>
            </div>
            <hr/>
            <div className={"loan-table-div"}>
                {props.loans.filter(loan => loan[lenderOrBorrower] === props.myId).map((loan) => {
                    return <div className={"loan-table-row-div"} key={loan.id}>
                        <div
                            className={"loan-party-item"}>{props.persons.find(person => person.id === loan[otherLoanParty])?.name}</div>
                        <div className={"amount-item"}>{loan.amount}</div>
                        <div className={"item-item"}>{props.items.find(item => item.id === loan.itemId)?.type}</div>
                        <div className={"description-item"}>{loan.description}</div>

                    </div>
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

    return (
        <>
            {loanWindow("lent")}
            {loanWindow("borrowed")}
    <div className={"loan-balance-div"}>
        loan balance (for
        money): {loanSum.lent - loanSum.borrowed} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
    </div>
</>
)

}