import {Item, Loan, LoanWithoutId, Person, UserWithoutPassword} from "../model/DataModels.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css'
import {toast} from "react-toastify";
import ToastifyContainer from "./ToastifyContainer.tsx";

type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    onSubmit: (submittedLoanWithoutId: LoanWithoutId, loanId: string, isNewLoan: boolean) => void,
    user?: UserWithoutPassword,
    onLogout: ()=>void
}

export default function LoanForm(props: Props) {
    const urlParams = useParams();
    const loan = props.loans.find(loan => loan.id === urlParams.id);
    const [returnDateIsActive, setReturnDateIsActive] = useState<boolean>(false)
    const [loanState, setLoanState] = useState<LoanWithoutId>({
        type: "",
        otherPartyId: "",
        itemId: "",
        description: "",
        amount: 1,
        loanDate: new Date().toJSON().slice(0, 10),
        returnDate: ""
    })
    const [validationMessage, setValidationMessage] = useState({
        otherParty: "Please choose a person as other party of the loan. You can also add new persons",
        itemId: "Please choose whether the item is of type money or nonmoney.",
        description: "",
        amount: "",
        loanDate: "",
        returnDate: ""
    })
    const navigate = useNavigate();
    const location = useLocation();
    const navigateState = location.state || {};
    const stateData = navigateState.stateData;
    useEffect(initialState, [props.user, urlParams.type, urlParams.id, loan, stateData]);

    function initialState() {
        if (loan) {
            setLoanState((prevState) => ({
                ...prevState,
                type: loan.type,
                otherPartyId: loan.otherPartyId,
                itemId: loan.itemId,
                description: loan.description,
                amount: loan.amount,
                loanDate: loan.loanDate,
                returnDate: loan.returnDate
            }))
            validate("itemId", loan.itemId);
            validate("description", loan.description);
            validate("amount", loan.amount.toString());
            validate("loanDate", loan.loanDate);
            if (loan.returnDate && loan.returnDate !== "") {
                validate("returnDate", loan.returnDate);
                setReturnDateIsActive(true);
            }
            validate("otherParty", loan.otherPartyId);
        } else if (urlParams.type) {
            setLoanState((prevState) => ({
                ...prevState, type: urlParams.type as string
            }));
        } else {
            throw new Error('Something went wrong! It seems that either no ID was given or it was not specified whether you are lending or borrowing.');
        }
        if (stateData) {
            setLoanState((prevState) => ({
                ...prevState,
                type: stateData.type,
                otherPartyId: stateData.lenderId,
                itemId: stateData.itemId,
                description: stateData.description,
                amount: stateData.amount,
                loanDate: stateData.loanDate,
                returnDate: stateData.returnDate
            }));
            validate("itemId", stateData.itemId);
            validate("description", stateData.description);
            validate("amount", stateData.amount.toString());
            validate("loanDate", stateData.loanDate);
            if (stateData.returnDate && stateData.returnDate !== "") {
                validate("returnDate", stateData.returnDate);
            }
            validate("otherPartyId", stateData.otherPartyId);
        }
    }

    function handleReturnDateActivator() {

        if (!returnDateIsActive) {
            validate("returnDate", loanState.returnDate);
        } else {
            setLoanState({...loanState, returnDate: ""});
            setValidationMessage(prevState => ({...prevState, returnDate: ""}));
        }
        setReturnDateIsActive(!returnDateIsActive);
    }

    function handleEditPersons() {
        let editPersonLink: string;
        if (urlParams.id) {
            editPersonLink = "/updateloan/" + urlParams.id + "/person/";
        } else {
            editPersonLink = "/addloan/" + loanState.type + "/person/";
        }
            editPersonLink += (loanState["otherPartyId"] || "add");
        navigate(editPersonLink, {state: {loanState}});
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (Object.values(validationMessage).every(message => {return message === "";})) {
            if (urlParams.id) {
                props.onSubmit(loanState, urlParams.id, false);
                navigate("/" + urlParams.id);
            } else {
                props.onSubmit(loanState, "new id", true);
                navigate("/");
            }
        } else {
            toast.warn("Some data entry are not valid!");
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        setLoanState({...loanState, [event.target.name]: event.target.value});
        validate(event.target.name, event.target.value);
    }

    function handleChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        setLoanState({...loanState, [event.target.name]: event.target.value});
        validate("otherParty", event.target.value);

    }

    function validate(name: string, value: string) {
        const dateRegEx = /^((19|2\d)\d{2})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/;
        switch (name) {
            case "itemId": {
                if (value === "1001" || value === "1002") {
                    setValidationMessage(prevState => ({...prevState, itemId: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        itemId: "Please choose whether the item is of type money or nonmoney."
                    });
                }
                break;
            }
            case "amount": {
                if (parseFloat(value) > 0) {
                    setValidationMessage(prevState => ({...prevState, amount: ""}));
                } else {

                    setValidationMessage(prevState => ({
                        ...prevState,
                        amount: "Should be an number greater than 0."
                    }));
                }
                break;
            }
            case "otherParty": {
                if (value !== "-1" && value.length > 0) {
                    setValidationMessage(prevState => ({...prevState, otherParty: ""}));
                } else {
                    setValidationMessage(prevState => ({
                        ...prevState,
                        lenderOrBorrower: "Please choose a person as other party of the loan. You can also add new persons."
                    }));
                }
                break;
            }
            case "loanDate": {
                if (dateRegEx.test(value)) {
                    setValidationMessage(prevState => ({...prevState, loanDate: ""}));
                } else {
                    setValidationMessage(prevState => ({
                        ...prevState,
                        loanDate: "Should be a valid date."
                    }));
                }
                break;
            }
            case "returnDate": {
                if (dateRegEx.test(value)) {
                    setValidationMessage(prevState => ({...prevState, returnDate: ""}));
                } else {
                    setValidationMessage(prevState => ({
                        ...prevState,
                        returnDate: "Should be a valid date or deactivated."
                    }));
                }

                break;
            }
        }
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
            <ToastifyContainer/>
            <div className={"app-title"}>
                <div className={"back-div"} onClick={handleBack}><h1>⇦</h1></div>
                <Link to={"/"}><img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/></Link>
                <div>
                    {props.user?.username}
                    <br/>
                    <button onClick={props.onLogout}>logout</button>
                </div>
            </div>

            <form className={"loan-form"} onSubmit={handleSubmit}>
                <h3>{urlParams.id ? "update loan" : "add new loan"}</h3>
                <div className={"form-details"}>
                    item {loanState.type}:
                    <div>
                        <input type={"radio"} id={"money"} name={"itemId"} value={"1001"}
                               checked={(loanState.itemId) === "1001"} onChange={handleChangeInput}/>
                        <label htmlFor={"money"}>money</label>
                        <input type={"radio"} id={"nonmoney"} name={"itemId"} value={"1002"}
                               checked={(loanState.itemId) === "1002"} onChange={handleChangeInput}/>
                        <label htmlFor={"nonmoney"}>nonmoney</label>
                    </div>
                </div>
                <div className={"validation-message"}>{validationMessage.itemId}</div>


                <div className={"form-details"}>
                    <label htmlFor={"description"}>description: </label>
                    <input type={"text"} id={"description"} name={"description"} value={loanState.description}
                           onChange={handleChangeInput}/>
                </div>
                <div className={"validation-message"}>{validationMessage.description}</div>


                <div className={"form-details"}>
                    <label htmlFor={"amount"}>amount: </label>
                    <input type={"number"} id={"amount"} name={"amount"} value={loanState.amount}
                           onChange={handleChangeInput}/>
                </div>
                <div className={"validation-message"}>{validationMessage.amount}</div>


                <div className={"form-details"}>
                    <label htmlFor={"person"}>{loanState.type==="lent"? "lender" : "borrower"} </label>
                    <div>
                        <select id="otherPartyId" name={"otherPartyId"} value={loanState.otherPartyId}
                                onChange={handleChangeSelect}>
                            <option value={"-1"}>{"select " + (loanState.type==="lent"? "lender" : "borrower")}</option>
                            {props.persons.map(person => {
                                return (<option key={person.id} value={person.id}>{person.name}</option>)
                            })}
                        </select>
                        <br/>
                        <button type={"button"} id={"edit-persons-button"} onClick={handleEditPersons}>edit persons
                            list
                        </button>
                    </div>
                </div>
                <div className={"validation-message"}>{validationMessage.otherParty}</div>


                <div className={"form-details"}>
                    <label htmlFor={"loan-date"}>loan date: </label>
                    <input type={"date"} id={"loanDate"} name={"loanDate"} value={loanState.loanDate}
                           onChange={handleChangeInput}/>
                </div>
                <div className={"validation-message"}>{validationMessage.loanDate}</div>


                <div className={"form-details-merged"}>
                    <label htmlFor={"activate-return-date"}>activate return date: </label>
                    <input type={"checkbox"} id={"activate-return-date"} name={"activate-return-date"}
                           onChange={handleReturnDateActivator} checked={returnDateIsActive}/>
                </div>

                <div className={"form-details-sm"}>
                    <label htmlFor={"return-date"}>return date: </label>
                    <input type={"date"} id={"returnDate"} name={"returnDate"} value={loanState.returnDate}
                           onChange={handleChangeInput} disabled={!returnDateIsActive}/>
                </div>
                <div className={"validation-message"}>{validationMessage.returnDate}</div>


                <button id={"loan-form-button"} type={"submit"}>save</button>
            </form>
        </>
    )
}
