import {Person, PersonWithoutId} from "../model/DataModels.ts";
import {useNavigate, useParams} from "react-router-dom";
import React, {FormEvent, useEffect, useState} from "react";

type Props = {
    persons : Person[],
    onSubmit : (personWithoutId: PersonWithoutId, personId: string, isNewPerson: boolean)=>void,
    myId : string
}

export default function PersonForm(props: Props){
    const [personState, setPersonState]=useState<PersonWithoutId>({name:""})
    const urlParams = useParams();
    const person = props.persons.find(person => person.id===urlParams.pid);
    const navigate = useNavigate();
    useEffect(initialState, [person, urlParams.pid])

    function initialState(){
        if (urlParams.pid && person){
            setPersonState({
                name: person.name
            })
        }
    }
    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>){
        setPersonState ({name:event.target.value});
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (urlParams.pid) {
            props.onSubmit(personState, urlParams.pid, false);
        } else{
            props.onSubmit(personState, "new id", true);
        }
        if (urlParams.id) {
            navigate("/updateloan/" + urlParams.id);
        } else {
            navigate("/addloan/" + urlParams.type);
        }
    }
    return (
        <>
            <div className={"person-form-title"}>
                {urlParams.pid? "update person" : "add new person"}
            </div>
            <br/>
            <form className={"person-form"} onSubmit={handleSubmit}>
                <label htmlFor={"person-name"}>Full name of the Person: </label>
                <br/>
                <input type={"text"} id={"person-name"} name={"person-name"} value={personState.name} onChange={handleChangeInput}/>
                <button>save</button>

            </form>
        </>
    )
}
