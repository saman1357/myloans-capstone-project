import {Link, useParams} from "react-router-dom";
import {Item, Loan, Person, UserWithoutPassword} from "../model/DataModels.ts";

type Props = {
    myId: string,
    loans: Loan[],
    items: Item[],
    persons: Person[],
    onDelete: (loanId: string) => void,
    user?: UserWithoutPassword
}

export default function LoanDetails(props: Props) {
    const urlParams = useParams();
    const loan: Loan | undefined = props.loans.find(loan => loan.id === urlParams.id)
    let lent = false;

    function handleDeleteButton() {
        if (urlParams.id) {
            props.onDelete(urlParams.id);
        } else {
            throw new Error('no id given!');
        }

    }

    if (!loan) {
        return <div>loan with id:
            <br/>
            {urlParams.id}
            <br/>
            not found.</div>
    }
    if (loan.lenderId === props.myId) lent = true;
    return (
        <div>
            <div className={"app-title"}>
                <div className={"back-div"}><Link to={"/"}><h1>⇦</h1></Link></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>{props.user?.username}</div>
            </div>
            <div className={"loan-details-container"}>
                <div className={"loan-details-header"}><h3>I{lent ? " lent" : " borrowed"}</h3></div>
                <div className={"loan-details-body"}>
                    <div className={"loan-details-label"}>amount:</div>
                    <div className={"loan-details"}>{loan.amount}</div>
                    <div className={"loan-details-label"}>item-type:</div>
                    <div className={"loan-details"}>{props.items.find(item => item.id === loan.itemId)?.type}</div>
                    <div className={"loan-details-label"}>description:</div>
                    <div className={"loan-details"}>({loan.description})</div>
                    <div className={"loan-details-label"}>other party:</div>
                    <div className={"loan-details"}>{lent ?
                        "to " + props.persons.find(person => person.id === loan.borrowerId)?.name
                        : "from " + props.persons.find(person => person.id === loan.lenderId)?.name}</div>
                    <div className={"loan-details-label"}>loan date:</div>
                    <div className={"loan-details"}>on {loan.loanDate}</div>
                    <div className={"loan-details-label"}>return date:</div>
                    <div className={"loan-details"}>until {loan.returnDate ? loan.returnDate : "undefined"}</div>
                </div>
            </div>
            <Link to={"/updateloan/" + urlParams.id}>
                <button>Edit</button>
            </Link>
            <button onClick={handleDeleteButton}>Delete</button>
        </div>
    )
}
