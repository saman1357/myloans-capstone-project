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
    const [lentSum, setLentSum] = useState<number>(0);
    const [borrowedSum, setBorrowedSum] = useState<number>(0);

    useEffect(calculateSums, [props]);

    function calculateSums() {
        let sum = 0;
        if (props.loans) {
            props.loans.filter(loan => (loan.itemId === "1001" && loan.lenderId === props.myId)).forEach(loan => {
                sum += loan.amount;
            })
            setLentSum(sum);

            sum = 0;
            props.loans.filter(loan => (loan.itemId === "1001" && loan.borrowerId === props.myId)).forEach(loan => {
                sum += loan.amount;
            })
            setBorrowedSum(sum);
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
                sum of monetary {lenderOrBorrower.slice(0,-4)}ings: {eval((loanType+"Sum"))} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
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
        money): {lentSum - borrowedSum} {props.items.find(item => item.id === "1001")?.type.charAt(0)}
    </div>
</>
)

}