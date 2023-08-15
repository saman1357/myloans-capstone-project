import {Item, Loan, LoanWithoutId, Person} from "../model/DataModels.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";

type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    onSubmit: (submittedLoanWithoutId: LoanWithoutId, loanId: string, isNewLoan: boolean) => void,
    myId: string,
    user?: string
}

export default function LoanForm(props: Props) {
    const urlParams = useParams();
    const loan = props.loans.find(loan => loan.id === urlParams.id);
    const [returnDateIsActive, setReturnDateIsActive] = useState<boolean>(false)
    const [lenderOrBorrower, setLenderOrBorrower] = useState<"lenderId" | "borrowerId">("lenderId");
    const [type, setType] = useState(urlParams.type)
    const [loanState, setLoanState] = useState<LoanWithoutId>({
        lenderId: "",
        borrowerId: "",
        itemId: "",
        description: "",
        amount: 0,
        loanDate: new Date().toJSON().slice(0, 10),
        returnDate: ""
    })
    const navigate = useNavigate();
    const location = useLocation();
    const navigateState = location.state || {};
    const stateData = navigateState.stateData;
    useEffect(initialState, [props.myId, urlParams.type, urlParams.id, loan, stateData]);

    function initialState() {
        if (urlParams.id && loan) {
            setLoanState((prevState) => ({
                ...prevState,
                lenderId: loan.lenderId,
                borrowerId: loan.borrowerId,
                itemId: loan.itemId,
                description: loan.description,
                amount: loan.amount,
                loanDate: loan.loanDate,
                returnDate: loan.returnDate
            }))

            if (loan.returnDate !== "") {
                setReturnDateIsActive(true);
            }
            if (loan.lenderId === props.myId) {
                setLenderOrBorrower("borrowerId");
                setType("lent");
            } else {
                setLenderOrBorrower("lenderId");
                setType("borrowed");
            }
        } else if (urlParams.type === "lent") {
            setType("lent");
            setLoanState((prevState) => ({
                ...prevState, lenderId: props.myId
            }));
            setLenderOrBorrower("borrowerId");
        } else if (urlParams.type === "borrowed") {
            setType("borrowed");
            setLoanState((prevState) => ({
                ...prevState, borrowerId: props.myId
            }));
            setLenderOrBorrower("lenderId");
        } else {
            throw new Error('Something went wrong! It seems that either no ID was given or it was not specified whether you are lending or borrowing.');
        }
        if (stateData) {
            setLoanState((prevState) => ({
                ...prevState,
                lenderId: stateData.lenderId,
                borrowerId: stateData.borrowerId,
                itemId: stateData.itemId,
                description: stateData.description,
                amount: stateData.amount,
                loanDate: stateData.loanDate,
                returnDate: stateData.returnDate
            }))
        }

    }

    function handleReturnDateActivator() {
        setReturnDateIsActive(!returnDateIsActive);
    }

    function handleEditPersons() {
        let editPersonLink: string;
        if (urlParams.id) {
            editPersonLink = "/updateloan/" + urlParams.id + "/person/";
        } else {
            editPersonLink = "/addloan/" + type + "/person/";
        }
        if (loanState[lenderOrBorrower]) {
            editPersonLink += loanState[lenderOrBorrower];
        } else {
            editPersonLink += "add";
        }
        navigate(editPersonLink, {state: {loanState}});
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (lenderOrBorrower === "borrowerId") {
            loanState.lenderId = props.myId
        } else {
            loanState.borrowerId = props.myId;
        }
        if (urlParams.id) {
            props.onSubmit(loanState, urlParams.id, false);
            navigate("/" + urlParams.id);
        } else {
            props.onSubmit(loanState, "new id", true);
            navigate("/");
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        setLoanState({...loanState, [event.target.name]: event.target.value});
    }

    function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        setLoanState({...loanState, [event.target.name]: event.target.value});
    }

    function handleBack() {
        if (urlParams.id) {
            navigate("/" + urlParams.id);
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <div className={"app-title"}>
                <div className={"back-div"} onClick={handleBack}><h1>⇦</h1></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>{props.user}</div>
            </div>

            <form className={"loan-form"} onSubmit={handleSubmit}>
                <h3>{urlParams.id ? "update loan" : "add new loan"}</h3>
                <div className={"form-details"}>
                    item {type}:
                    <div>
                        <input type={"radio"} id={"money"} name={"itemId"} value={"1001"}
                               checked={(loanState.itemId) === "1001"} onChange={handleChangeInput}/>
                        <label htmlFor={"money"}>money</label>
                        <input type={"radio"} id={"nonmoney"} name={"itemId"} value={"1002"}
                               checked={(loanState.itemId) === "1002"} onChange={handleChangeInput}/>
                        <label htmlFor={"nonmoney"}>nonmoney</label>
                    </div>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"description"}>description: </label>
                    <input type={"text"} id={"description"} name={"description"} value={loanState.description}
                           onChange={handleChangeInput}/>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"amount"}>amount: </label>
                    <input type={"text"} id={"amount"} name={"amount"} value={loanState.amount}
                           onChange={handleChangeInput}/>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"person"}>{lenderOrBorrower.slice(0, -2)} </label>
                    <div className={"test"}>
                        <select id="lenderOrBorrower" name={lenderOrBorrower} value={loanState[lenderOrBorrower]}
                                onChange={handleChangeSelect}>
                            <option value={"-1"}>{"select " + lenderOrBorrower.slice(0, -2)}</option>
                            {props.persons.map(person => {
                                return (<option key={person.id} value={person.id}>{person.name}</option>)
                            })}
                        </select>
                        <button type={"button"} id={"edit-persons-button"} onClick={handleEditPersons}>edit persons
                            list
                        </button>
                    </div>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"loan-date"}>loan date: </label>
                    <input type={"date"} id={"loanDate"} name={"loanDate"} value={loanState.loanDate}
                           onChange={handleChangeInput}/>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"activate-return-date"}>activate return date: </label>
                    <input type={"checkbox"} id={"activate-return-date"} name={"activate-return-date"}
                           onClick={handleReturnDateActivator}/>
                </div>

                <div className={"form-details"}>
                    <label htmlFor={"return-date"}>return date: </label>
                    <input type={"date"} id={"returnDate"} name={"returnDate"} value={loanState.returnDate}
                           onChange={handleChangeInput} disabled={!returnDateIsActive}/>
                </div>

                <button id={"loan-form-button"} type={"submit"}>save</button>
            </form>
        </>
    )
}
