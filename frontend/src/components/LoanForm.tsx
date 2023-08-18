import {Item, Loan, LoanWithoutId, Person, UserWithoutPassword} from "../model/DataModels.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css'
import {toast, ToastContainer} from "react-toastify";


type Props = {
    loans: Loan[],
    items: Item[],
    persons: Person[],
    onSubmit: (submittedLoanWithoutId: LoanWithoutId, loanId: string, isNewLoan: boolean) => void,
    myId: string,
    user?: UserWithoutPassword,
    onLogout: ()=>void
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
        amount: 1,
        loanDate: new Date().toJSON().slice(0, 10),
        returnDate: ""
    })
    const [validationMessage, setValidationMessage] = useState({
        lenderOrBorrower: "Please choose a person as other party of the loan. You can also add new persons",
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
    useEffect(initialState, [props.myId, urlParams.type, urlParams.id, loan, stateData]);

    function initialState() {
        if (loan) {
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

            validate("itemId", loan.itemId);
            validate("description", loan.description);
            validate("amount", loan.amount.toString());
            validate("loanDate", loan.loanDate);
            if (loan.returnDate === "") {
                setValidationMessage(prevState => ({...prevState, returnDate: ""}));
            } else {
                validate("returnDate", loan.returnDate);
                setReturnDateIsActive(true);
            }
            if (loan.lenderId === props.myId) {
                validate("lenderOrBorrower", loan.borrowerId);
                setLenderOrBorrower("borrowerId");
                setType("lent");
            } else {
                validate("lenderOrBorrower", loan.lenderId);
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
            }));
            validate("itemId", stateData.itemId);
            validate("description", stateData.description);
            validate("amount", stateData.amount.toString());
            validate("loanDate", stateData.loanDate);
            if (stateData.returnDate === "") {
                setValidationMessage(prevState => ({...prevState, returnDate: ""}));
            } else {
                validate("returnDate", stateData.returnDate);
            }
            if (stateData.lenderId === props.myId) {
                validate("lenderOrBorrower", stateData.borrowerId);
            } else {

                validate("lenderOrBorrower", stateData.lenderId);
            }

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
        validate("lenderOrBorrower", event.target.value);

    }

    function validate(name: string, value: string) {
        const dateRegEx = /^((19|20)\d{2}(-|\/|.)(0[1-9]|1[1,2])(-|\/|.)(0[1-9]|[12][0-9]|3[01]))|((0[1-9]|[12][0-9]|3[01])(-|\/|.)(0[1-9]|1[1,2])(-|\/|.)(19|20)\d{2})/;
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
            case "lenderOrBorrower": {
                if (value !== "-1" && value.length > 0) {
                    setValidationMessage(prevState => ({...prevState, lenderOrBorrower: ""}));
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
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={"app-title"}>
                <div className={"back-div"} onClick={handleBack}><h1>⇦</h1></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>
                    {props.user?.username}
                    <br/>
                    <button onClick={props.onLogout}>logout</button>
                </div>
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
                <div className={"validation-message"}>{validationMessage.lenderOrBorrower}</div>


                <div className={"form-details"}>
                    <label htmlFor={"loan-date"}>loan date: </label>
                    <input type={"date"} id={"loanDate"} name={"loanDate"} value={loanState.loanDate}
                           onChange={handleChangeInput}/>
                </div>
                <div className={"validation-message"}>{validationMessage.loanDate}</div>


                <div className={"form-details"}>
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
