import './App.css'
import {useEffect, useState} from "react";
import {Item, Loan, LoanWithoutId, Person, PersonWithoutId} from "./model/DataModels.ts";
import axios from "axios";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LoanList from "./components/LoanList.tsx";
import LoanDetails from "./components/LoanDetails.tsx";
import LoanForm from "./components/LoanForm.tsx";
import PersonForm from "./components/PersonForm.tsx";

export default function App() {
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();
    const location=useLocation();
    const navigate = useNavigate();

    const myId = "0001";

    useEffect(getMyLoansData, []);


    function getMyLoansData() {
        axios.get("/api/myloans")
            .then(response => {
                setLoans(response.data.loans);
                setItems(response.data.items);
                setPersons(response.data.persons);
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    function handleSubmitLoanForm(submittedLoanWithoutId: LoanWithoutId, loanId: string, isNewLoan: boolean) {
        if (isNewLoan) {
            handleAddNewLoan(submittedLoanWithoutId);
        } else {
            handleUpdateLoan(submittedLoanWithoutId, loanId);
        }
    }

    function handleAddNewLoan(newLoan: LoanWithoutId) {
        axios.post("/api/myloans", newLoan)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleUpdateLoan(updatedLoan: LoanWithoutId, loanId: string) {
        axios.put("/api/myloans/" + loanId, updatedLoan)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleDeleteLoan(loanId: string) {
        axios.delete("/api/myloans/" + loanId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
        navigate("/");
    }

    function handleSubmitPersonForm(person: Person, action: string) {
        const personWithoutId : PersonWithoutId={name:person.name}
        switch (action){
            case "add":{
                handleAddNewPerson(personWithoutId);
                return;
            }
            case "update":{
                handleUpdatePerson(personWithoutId, person.id);
                return;
            }
            case "delete":{
                handleDeletePerson(person.id);
                return;
            }
        }
    }

    function handleAddNewPerson(newPersonWithoutId: PersonWithoutId) {
        axios.post("/api/myloans/person", newPersonWithoutId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleUpdatePerson(updatedPersonWithoutId: PersonWithoutId, personId: string) {
        axios.put("/api/myloans/person/" + personId, updatedPersonWithoutId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleDeletePerson(personId: string){
        axios.delete("/api/myloans/person/"+personId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    if (!(loans && items && persons)) {
        return <h1>... loading ...</h1>
    }

    console.log(location.pathname)

    return (
        <>
            <div>
                <div className={"app-body"}>
                    <Routes>
                        <Route path={"/"}
                               element={<LoanList loans={loans} items={items} persons={persons} myId={myId}/>}/>
                        <Route path={"/addloan/:type"}
                               element={<LoanForm loans={loans} items={items} persons={persons}
                                                  onSubmit={handleSubmitLoanForm} myId={myId}/>}/>
                        <Route path={"/:id"}
                               element={<LoanDetails loans={loans} items={items} persons={persons} myId={myId}
                                                     onDelete={handleDeleteLoan}/>}/>
                        <Route path={"/updateloan/:id"} element={<LoanForm loans={loans} items={items} persons={persons}
                                                                           onSubmit={handleSubmitLoanForm}
                                                                           myId={myId}/>}/>
                        <Route path={"/updateloan/:id/person/add"}
                               element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                        <Route path={"/addloan/:type/person/add"}
                               element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                        <Route path={"/updateloan/:id/person/:pid"}
                               element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                        <Route path={"/addloan/:type/person/:pid"}
                               element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                    </Routes>
                </div>
            </div>
        </>
    )
}
