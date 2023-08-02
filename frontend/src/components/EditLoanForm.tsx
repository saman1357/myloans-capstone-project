import {useNavigate, useParams} from "react-router-dom";
import {Item, Loan, LoanWithoutId, Person} from "../model/DataModels.ts";
import React, {FormEvent, useEffect, useState} from "react";

type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[]
    onUpdate: (newLoan: LoanWithoutId, loanId: string) => void
    myId: string;

}
export default function EditLoanForm(props: Props) {
    const urlParams = useParams();
    const loan: Loan | undefined = props.loans.find(loan => loan.id === urlParams.id)
    const [returnDateIsActive, setReturnDateIsActive] = useState<boolean>(false)
    const [updatedLoan, setUpdatedLoan] = useState<LoanWithoutId>({
        lenderId: "",
        borrowerId: "",
        itemId: "",
        description: "",
        amount: 0,
        loanDate: "",
        returnDate: ""
    })
    const navigate = useNavigate();
    let loanId:string;
    let lenderOrBorrower: "lenderId" | "borrowerId";

    useEffect(initialStateOfUpdatedLoan, []);

    if (urlParams.id) {
        loanId = urlParams.id;
    }else {
        return <div>No id given.</div>
    }

    if(!loan){
        return <div>loan with id:
            <br/>
            {loanId}
            <br/>
            not found.</div>
    }
    if (loan.lenderId === props.myId) {
        lenderOrBorrower = "borrowerId";
    } else {
        lenderOrBorrower = "lenderId";
    }
    function initialStateOfUpdatedLoan() {
        if (loan) {
            setUpdatedLoan({
                ...updatedLoan,
                lenderId: loan.lenderId,
                borrowerId: loan.borrowerId,
                itemId: loan.itemId,
                description: loan.description,
                amount: loan.amount,
                loanDate: loan.loanDate,
                returnDate: loan.returnDate
            })

            if (loan.returnDate !== "") {
                setReturnDateIsActive(true)
            }

        }
    }


    function handleReturnDateActivator() {
        setReturnDateIsActive(!returnDateIsActive);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(lenderOrBorrower==="borrowerId") {
            updatedLoan.lenderId = props.myId
        }else {
            updatedLoan.borrowerId = props.myId;
        }
        props.onUpdate(updatedLoan, loanId);
        navigate("/"+loanId)
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>){
        setUpdatedLoan({...updatedLoan, [event.target.name] :event.target.value});
        console.log(event.target.name+": "+event.target.value);
    }
    function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>){
        setUpdatedLoan({...updatedLoan, [event.target.name] :event.target.value});
        console.log(event.target.name+": "+event.target.value);
    }

    return (
        <>
            <form className={"new-loan-form"} onSubmit={handleSubmit}>
                item to {urlParams.type}:
                <input type={"radio"} id={"money"} name={"itemId"} value={"1001"} checked={(updatedLoan.itemId)==="1001"} onChange={handleChangeInput}/>
                <label htmlFor={"money"}>money</label>
                <input type={"radio"} id={"nonmoney"} name={"itemId"} value={"1002"} checked={(updatedLoan.itemId)==="1002"} onChange={handleChangeInput}/>
                <label htmlFor={"nonmoney"}>nonmoney</label>
                <br/>
                <br/>
                <label htmlFor={"description"}>description: </label>
                <input type={"text"} id={"description"} name={"description"} value={updatedLoan.description} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"amount"}>amount: </label>
                <input type={"text"} id={"amount"} name={"amount"} value={updatedLoan.amount} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"person"}>{lenderOrBorrower.slice(0,-2)} </label>
                <select id={lenderOrBorrower} name={lenderOrBorrower} value={updatedLoan.borrowerId} onChange={handleChangeSelect}>
                    <option value={"0"}>{"select "+lenderOrBorrower.slice(0,-2)}</option>
                    {props.persons.map(person => {
                        return (<option key={person.id} value={person.id}>{person.name}</option>)
                    })}
                </select>
                <br/>
                <button>add/edit person(s)</button>
                <br/>
                <br/>
                <label htmlFor={"loan-date"}>loan date: </label>
                <input type={"date"} id={"loanDate"} name={"loanDate"} value={updatedLoan.loanDate} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"activate-return-date"}>activate return date: </label>
                <input type={"checkbox"} id={"activate-return-date"} name={"activate-return-date"}
                       onClick={handleReturnDateActivator}/>
                <br/>
                <label htmlFor={"return-date"}>return date: </label>
                <input type={"date"} id={"returnDate"} name={"returnDate"} value={updatedLoan.returnDate} onChange={handleChangeInput} disabled={!returnDateIsActive}/>
                <br/>
                <br/>
                <button type={"submit"}>save</button>
            </form>
        </>
    )
}