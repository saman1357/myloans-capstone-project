import './App.css'
import {useEffect, useState} from "react";
import {Item, Loan, LoanWithoutId, Person, PersonWithoutId} from "./model/DataModels.ts";
import axios from "axios";
import {Route, Routes, useNavigate} from "react-router-dom";
import LoanList from "./components/LoanList.tsx";
import LoanDetails from "./components/LoanDetails.tsx";
import LoanForm from "./components/LoanForm.tsx";
import PersonForm from "./components/PersonForm.tsx";

export default function App() {
    //axios.defaults.baseURL = 'http://localhost:5173';
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();
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

    function handleDeleteLoan(loanId:string){
        axios.delete("/api/myloans/" + loanId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
        navigate("/");
    }

    function handleSubmitPersonForm(personWithoutId: PersonWithoutId, personId: string, isNewPerson: boolean) {
        if (isNewPerson) {
            handleAddNewPerson(personWithoutId);
        } else {
            handleUpdatePerson(personWithoutId, personId);
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

    if (!(loans && items && persons)) {
        return <h1>... loading ...</h1>
    }

    return (
        <>
            <div>
                <div className={"app-title"}>
                    <img src={"myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                </div>
                <Routes>
                    <Route path={"/"} element={<LoanList loans={loans} items={items} persons={persons} myId={myId}/>}/>
                    <Route path={"/addloan/:type"}
                           element={<LoanForm loans={loans} items={items} persons={persons} onSubmit={handleSubmitLoanForm} myId={myId}/>}/>
                    <Route path={"/:id"}
                           element={<LoanDetails loans={loans} items={items} persons={persons} myId={myId} onDelete={handleDeleteLoan}/>}/>
                    <Route path={"/updateloan/:id"} element={<LoanForm loans={loans} items={items} persons={persons} onSubmit={handleSubmitLoanForm} myId={myId}/>}/>
                    <Route path={"/updateloan/:id/person/add"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                    <Route path={"/addloan/:type/person/add"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                    <Route path={"/updateloan/:id/person/:pid"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                    <Route path={"/addloan/:type/person/:pid"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} myId={myId}/>}/>
                </Routes>
            </div>
        </>
    )
}
