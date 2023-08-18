import {Loan, LoanWithoutId, Person, UserWithoutPassword} from "../model/DataModels.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import AlertDialogButton from "./AlertDialogButton.tsx";
import ToastifyContainer from "./ToastifyContainer.tsx";

type Props = {
    persons: Person[],
    loans: Loan[],
    onSubmit: (person: Person, action: string) => void,
    user?: UserWithoutPassword,
    onLogout: ()=>void
}

export default function PersonForm(props: Props) {
    const [personState, setPersonState] = useState<Person>({name: "", id: ""})
    const urlParams = useParams();
    const person = props.persons.find(person => person.id === urlParams.pid);
    const [action, setAction] = useState<"add" | "update" | "delete">("add");
    const navigate = useNavigate();
    const [backLink, setBackLink] = useState("/");
    const [validationMessage, setValidationMessage] = useState("Person's name must be at least 1 character!");
    const location = useLocation();
    const navigateState = location.state || {};
    const [stateData] = useState<LoanWithoutId>(navigateState.loanState);
    useEffect(initialState, [person, urlParams.pid, urlParams.id, urlParams.type]);

    function initialState() {
        if (urlParams.pid && person) {
            setAction("update");
            setPersonState(prevState => ({...prevState, name: person.name, id: urlParams.pid as string}))
            setValidationMessage("");
        }
        if (urlParams.id) {
            setBackLink(("/updateloan/") + urlParams.id);
        } else if (urlParams.type) {
            setBackLink("/addloan/" + urlParams.type);
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPersonState((prevState) => ({...prevState, name: event.target.value}));
        if (event.target.value.length<1) {
            setValidationMessage("Person's name must be at least 1 character!");
        } else {
            setValidationMessage("");
        }
    }

    function handleBack() {
        navigate(backLink, {state: {stateData}});
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validationMessage === "") {
            props.onSubmit(personState, action);
        } else {
            toast.warn("Person's name must be at least 1 character!");
        }
    }

    function handleSelectPerson(name: string, id: string) {
        setPersonState({name: name, id: id});
        setAction("update");
        setValidationMessage("");
    }

    function handleDeletePerson(name: string, id: string) {
        let possible = true;
        props.loans.forEach(loan => {
            if (loan.lenderId === id || loan.borrowerId === id) possible = false;
        })
        if (possible) {
            setPersonState({name: name, id: id})
            setAction("delete");
            props.onSubmit({name: name, id: id}, "delete");
            initialState()
        } else {
            toast.warn("Not possible to delete. Person is the other party in at least one loan.");
        }
    }

    function handleAddButton() {
        setAction("add")
        setPersonState(prevState => ({...prevState, id: "new id"}));
    }
    return (
        <>
            <ToastifyContainer/>
            <div className={"app-title"}>
                <div className={"back-div"} onClick={handleBack}><h1>⇦</h1></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>
                    {props.user?.username}
                    <br/>
                    <button onClick={props.onLogout}>logout</button>
                </div>
            </div>

            <div className={"person-form-title"}>
                <h3>{(action === "update") ? "update person" : "add new person"}</h3>
            </div>
            <form className={"person-form"} onSubmit={handleSubmit}>
                <label htmlFor={"person-name"}>full name of the Person: </label>
                <br/>
                <input type={"text"} id={"person-name"} name={"person-name"} value={personState.name}
                       onChange={handleChangeInput}/>
                <div className={"validation-message-person"}>{validationMessage}</div>
                <br/>
                <button>save</button>
                <div className={"person-div"}>
                    <div className={"person-header-div"}>
                        <div>persons:</div>
                        <div className={"person-button-item"}>
                            <button type={"button"} onClick={handleAddButton}>add</button>
                        </div>
                    </div>
                    <hr/>
                    <div className={"person-table-div"}>
                        {props.persons.map((mapedPerson) => {
                            return (
                                <div key={mapedPerson.id}
                                     className={"person-table-row-div" + ((mapedPerson.id === personState.id) ? "-colored" : "")}>
                                    <div className={"person-name-item"}
                                         onClick={() => handleSelectPerson(mapedPerson.name, mapedPerson.id)}>
                                        {mapedPerson.name}
                                    </div>
                                    <div className={"person-button-item"}>
                                        <AlertDialogButton buttonText={"delete"} onYes={()=>handleDeletePerson(mapedPerson.name, mapedPerson.id)}/>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </form>
        </>
    )
}
