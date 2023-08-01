import {useParams} from "react-router-dom";
import {Item, Loan, Person} from "../model/DataModels.ts";

type Props = {
    myId: string,
    loans: Loan[],
    items: Item[],
    persons: Person[]
}

export default function LoanDetails(props: Props) {
    const urlParams = useParams();
    const loan: Loan | undefined = props.loans.find(loan => loan.id === urlParams.id)
    let lent = false;
    if (loan) {
        if (loan.lenderId === props.myId) lent = true;
        return (
            <div>
                <div className={"loan-details-container"}>
                    <div className={"loan-details-header"}>{lent ? "lent" : "borrowed"}</div>
                    <div className={"loan-details"}>{loan.amount}</div>
                    <div className={"loan-details"}>{props.items.find(item => item.id === loan.itemId)?.type}</div>
                    <div className={"loan-details"}>({loan.description})</div>
                    <div className={"loan-details"}>{lent ?
                        "to " + props.persons.find(person => person.id === loan.borrowerId)?.name
                        : "from " + props.persons.find(person => person.id === loan.lenderId)?.name}</div>
                    <div className={"loan-details"}>on {loan.loanDate}</div>
                    <div className={"loan-details"}>until {loan.returnDate ? loan.returnDate : "undefined"}</div>
                </div>
                <button>Edit</button>
            </div>
        )
    } else {
        return <div>loan with id:
            <br/>
            {urlParams.id}
            <br/>
            not found.</div>
    }
}