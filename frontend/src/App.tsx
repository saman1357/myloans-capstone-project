import './App.css'
import {useEffect, useState} from "react";
import {Item, Loan, LoanWithoutId, Person, PersonWithoutId} from "./model/DataModels.ts";
import axios from "axios";
import {Route, Routes, useNavigate} from "react-router-dom";
import LoanList from "./components/LoanList.tsx";
import LoanDetails from "./components/LoanDetails.tsx";
import LoanForm from "./components/LoanForm.tsx";
import PersonForm from "./components/PersonForm.tsx";
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";

export default function App() {
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();
    const [user, setUser] = useState<string>();
    const navigate = useNavigate();

    const myId = "0001";

    useEffect(me, [user]);


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
        const personWithoutId: PersonWithoutId = {name: person.name}
        switch (action) {
            case "add": {
                handleAddNewPerson(personWithoutId);
                return;
            }
            case "update": {
                handleUpdatePerson(personWithoutId, person.id);
                return;
            }
            case "delete": {
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

    function handleDeletePerson(personId: string) {
        axios.delete("/api/myloans/person/" + personId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function login(username: string, password: string) {
        axios.post("/api/user/login", null, {auth: {username, password}})
            .then((response) => {
                setUser(response.data)
                navigate("/");
            });
    }

    function logout() {
        axios.post("/api/user/logout")
            .then((response) => {
                console.log(response.data);
                setUser('anonymousUser');
                navigate("/");
            });
    }

    function me() {
        axios.get("/api/user/me")
            .then(response => {
                setUser(response.data);
                if (user!==undefined && user!=='anonymousUser'){
                    getMyLoansData();
                }
            });
    }

    if (!(loans && items && persons)) {
        return <LoginForm onLogin={login}/>
    }

    return (
        <>
            <div>
                <div className={"app-body"}>
                    <Routes>
                        <Route element={<ProtectedRoutes user={user}/>}>
                            <Route path={"/"} element={<LoanList loans={loans} items={items} persons={persons} myId={myId} user={user} onLogout={logout}/>}/>
                            <Route path={"/addloan/:type"} element={<LoanForm loans={loans} items={items} persons={persons} user={user} onSubmit={handleSubmitLoanForm} myId={myId}/>}/>
                            <Route path={"/:id"} element={<LoanDetails loans={loans} items={items} persons={persons} myId={myId} user={user} onDelete={handleDeleteLoan}/>}/>
                            <Route path={"/updateloan/:id"} element={<LoanForm loans={loans} items={items} persons={persons} user={user} onSubmit={handleSubmitLoanForm} myId={myId}/>}/>
                            <Route path={"/updateloan/:id/person/add"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} user={user} myId={myId}/>}/>
                            <Route path={"/addloan/:type/person/add"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} user={user} myId={myId}/>}/>
                            <Route path={"/updateloan/:id/person/:pid"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} user={user} myId={myId}/>}/>
                            <Route path={"/addloan/:type/person/:pid"} element={<PersonForm persons={persons} onSubmit={handleSubmitPersonForm} user={user} myId={myId}/>}/>
                        </Route>
                        <Route path={"/login"} element={<LoginForm onLogin={login}/>}/>
                    </Routes>
                </div>
            </div>
        </>
    )
}
