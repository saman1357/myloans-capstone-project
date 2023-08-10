import {LoanWithoutId, Person} from "../model/DataModels.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";

type Props = {
    persons: Person[],
    onSubmit: (person: Person, action: string) => void,
    myId: string
}

export default function PersonForm(props: Props) {
    const [personState, setPersonState] = useState<Person>({name: "", id: ""})
    const urlParams = useParams();
    const person = props.persons.find(person => person.id === urlParams.pid);
    const [action, setAction] = useState<"add" | "update" | "delete">("add");
    const navigate = useNavigate();
    const [backLink, setBackLink]=useState("/");
    const location=useLocation();
    const navigateState=location.state || {};
    const [stateData]=useState<LoanWithoutId>(navigateState.loanState);
    useEffect(initialState, [person, urlParams.pid, urlParams.id, urlParams.type]);

    function initialState() {
        if (urlParams.pid && person) {
            setAction("update");
            setPersonState({
                name: person.name,
                id: urlParams.pid
            })
        }
        if (urlParams.id){
            setBackLink(("/updateloan/")+urlParams.id);
        } else if(urlParams.type){
            setBackLink("/addloan/" + urlParams.type);
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPersonState((prevState) => ({...prevState, name: event.target.value}));
    }

    function handleBack(){
        navigate(backLink, {state: {stateData}});
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        props.onSubmit(personState, action);
    }

    function handleSelectPerson(name: string, id: string) {
        setPersonState({name: name, id: id});
        setAction("update");
    }

    function handleDeletePerson(name: string, id: string) {
        setPersonState({name: name, id: id})
        setAction("delete");
        props.onSubmit({name: name, id: id}, "delete");
        initialState()
    }

    function handleAddButton() {
        setAction("add")
        setPersonState(prevState => ({...prevState, id: "new id"}));
    }

    return (
        <>
            <div className={"app-title"}>
                <div className={"back-div"} onClick={handleBack}><h1>⇦</h1></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div></div>
            </div>

            <div className={"person-form-title"}>
                {(action === "update") ? "update person" : "add new person"}
            </div>
            <br/>
            <form className={"person-form"} onSubmit={handleSubmit}>
                <label htmlFor={"person-name"}>Full name of the Person: </label>
                <br/>
                <input type={"text"} id={"person-name"} name={"person-name"} value={personState.name}
                       onChange={handleChangeInput}/>
                <button>save</button>


                <div className={"person-div"}>
                    <div className={"person-header-div"}>
                        <div>persons:</div>
                        <button type={"button"} onClick={handleAddButton}>Add</button>
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
                                        <button type={"button"}
                                                onClick={() => handleDeletePerson(mapedPerson.name, mapedPerson.id)}>delete
                                        </button>
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
