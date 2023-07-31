import {useNavigate, useParams} from "react-router-dom";
import {LoanWithoutId, Person} from "../model/DataModels.ts";
import React, {FormEvent, useState} from "react";

type Props = {
    persons: Person[]
    onSave: (newLoan: LoanWithoutId) => void
    myId: string;
}
export default function (props: Props) {
    const urlParams = useParams();
    const [returnDateIsActive, setReturnDateIsActive] = useState<boolean>(false)
    const [newLoan, setNewLoan] = useState<LoanWithoutId>({
        lenderId: "",
        borrowerId: "",
        itemId: "",
        description: "",
        amount: 0,
        loanDate: new Date().toJSON().slice(0, 10),
        returnDate: ""
    })
    const navigate = useNavigate();

    let lenderOrBorrower: "lenderId" | "borrowerId";
    urlParams.type==="lent"? lenderOrBorrower = "borrowerId" : lenderOrBorrower = "lenderId"

    function handleReturnDateActivator() {
        setReturnDateIsActive(!returnDateIsActive);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        urlParams.type==="lent"? newLoan.lenderId=props.myId : newLoan.borrowerId=props.myId;
        props.onSave(newLoan);
        navigate("/")
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>){
        setNewLoan({...newLoan, [event.target.name] :event.target.value});
        console.log(event.target.name+": "+event.target.value);
    }
    function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>){
        setNewLoan({...newLoan, [event.target.name] :event.target.value});
        console.log(event.target.name+": "+event.target.value);
    }

    return (
        <>
            <form className={"new-loan-form"} onSubmit={handleSubmit}>
                item to {urlParams.type}:
                <input type={"radio"} id={"money"} name={"itemId"} value={"1001"} checked={(newLoan.itemId)==="1001"? true : false} onChange={handleChangeInput}/>
                <label htmlFor={"money"}>money</label>
                <input type={"radio"} id={"nonmoney"} name={"itemId"} value={"1002"} checked={(newLoan.itemId)==="1002"? true : false} onChange={handleChangeInput}/>
                <label htmlFor={"nonmoney"}>nonmoney</label>
                <br/>
                <br/>
                <label htmlFor={"description"}>description: </label>
                <input type={"text"} id={"description"} name={"description"} value={newLoan.description} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"amount"}>amount: </label>
                <input type={"text"} id={"amount"} name={"amount"} value={newLoan.amount} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"person"}>{lenderOrBorrower.slice(0,-2)} </label>
                <select id={lenderOrBorrower} name={lenderOrBorrower} value={newLoan.borrowerId} onChange={handleChangeSelect}>
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
                <input type={"date"} id={"loanDate"} name={"loanDate"} value={newLoan.loanDate} onChange={handleChangeInput}/>
                <br/>
                <br/>
                <label htmlFor={"activate-return-date"}>activate return date: </label>
                <input type={"checkbox"} id={"activate-return-date"} name={"activate-return-date"}
                       onClick={handleReturnDateActivator}/>
                <br/>
                <label htmlFor={"return-date"}>return date: </label>
                <input type={"date"} id={"returnDate"} name={"returnDate"} value={newLoan.returnDate} onChange={handleChangeInput} disabled={!returnDateIsActive}/>
                <br/>
                <br/>
                <button type={"submit"}>save</button>
            </form>
        </>
    )
}