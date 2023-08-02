import {Item, Loan, LoanWithoutId, Person} from "../model/DataModels.ts";
import {useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";

type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[]
    onSubmit: (submittedLoanWithoutId: LoanWithoutId, loanId: string, isNewLoan: boolean) => void
    myId: string;
}

export default function LoanForm(props:Props){
    const urlParams = useParams();
    const loan = props.loans.find(loan => loan.id === urlParams.id);
    const [returnDateIsActive, setReturnDateIsActive] = useState<boolean>(false)
    const [loanState, setUpdatedLoan] = useState<LoanWithoutId>({
        lenderId: "",
        borrowerId: "",
        itemId: "",
        description: "",
        amount: 0,
        loanDate: "",
        returnDate: ""
    })
    const navigate = useNavigate();
    let lenderOrBorrower="";
    let type=urlParams.type;
    useEffect(initialState, []);

    if(urlParams.id){
        //loan = props.loans.find(loan => loan.id === urlParams.id);
        if(!loan){
            return <div>loan with id:
                <br/>
                {urlParams.id}
                <br/>
                not found.</div>
        }
        if (loan.lenderId === props.myId) {
            lenderOrBorrower = "borrowerId";
            type="lent";
        } else {
            lenderOrBorrower = "lenderId";
            type="borrowed";
        }
    } else if(urlParams.type==="lent"){
        lenderOrBorrower="borrowerId";
    } else if(urlParams.type==="borrowed"){
        lenderOrBorrower="lenderId";
    } else {
        return <div>something went wrong!</div>
    }
    function initialState(){
        if (urlParams.id && loan){
            setUpdatedLoan({
                ...loanState,
                lenderId: loan.lenderId,
                borrowerId: loan.borrowerId,
                itemId: loan.itemId,
                description: loan.description,
                amount: loan.amount,
                loanDate: loan.loanDate,
                returnDate: loan.returnDate
            })
            if (loan.returnDate!==""){
                setReturnDateIsActive(true);
            }
        }

    }

    function handleReturnDateActivator(){
        setReturnDateIsActive(!returnDateIsActive);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(lenderOrBorrower==="borrowerId") {
            loanState.lenderId = props.myId
        }else {
            loanState.borrowerId = props.myId;
        }
        if (urlParams.id) {
            props.onSubmit(loanState, urlParams.id, false);
            navigate("/" + urlParams.id);
        } else{
            props.onSubmit(loanState, "new id", true);
            navigate("/");
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>){
        setUpdatedLoan({...loanState, [event.target.name] :event.target.value});
    }

    function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>){
        setUpdatedLoan({...loanState, [event.target.name] :event.target.value});
    }

    return (
        <>
            <form className={"new-loan-form"} onSubmit={handleSubmit}>
                item {type}:
                <input type={"radio"} id={"money"} name={"itemId"} value={"1001"} checked={(loanState.itemId)==="1001"} onChange={handleChangeInput}/>
                <label htmlFor={"money"}>money</label>
                <input type={"radio"} id={"nonmoney"} name={"itemId"} value={"1002"} checked={(loanState.itemId)==="1002"} onChange={handleChangeInput}/>
                <label htmlFor={"nonmoney"}>nonmoney</label>
                <br/>
                <br/>
                <label htmlFor={"description"}>description: </label>
                <input type={"text"} id={"description"} name={"description"} value={loanState.description} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"amount"}>amount: </label>
                <input type={"text"} id={"amount"} name={"amount"} value={loanState.amount} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"person"}>{lenderOrBorrower.slice(0,-2)} </label>
                <select id={lenderOrBorrower} name={lenderOrBorrower} value={loanState.borrowerId} onChange={handleChangeSelect}>
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
                <input type={"date"} id={"loanDate"} name={"loanDate"} value={loanState.loanDate} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"activate-return-date"}>activate return date: </label>
                <input type={"checkbox"} id={"activate-return-date"} name={"activate-return-date"}
                       onClick={handleReturnDateActivator}/>
                <br/>
                <label htmlFor={"return-date"}>return date: </label>
                <input type={"date"} id={"returnDate"} name={"returnDate"} value={loanState.returnDate} onChange={handleChangeInput} disabled={!returnDateIsActive}/>
                <br/>
                <br/>
                <button type={"submit"}>save</button>
            </form>
        </>
    )




}