import './App.css'
import {useEffect, useState} from "react";
import {
    Item,
    Loan,
    LoanWithoutId,
    Person,
    PersonWithoutId,
    UserWithoutId,
    UserWithoutPassword
} from "./model/DataModels.ts";
import axios from "axios";
import {Route, Routes, useNavigate} from "react-router-dom";
import LoanList from "./components/LoanList.tsx";
import LoanDetails from "./components/LoanDetails.tsx";
import LoanForm from "./components/LoanForm.tsx";
import PersonForm from "./components/PersonForm.tsx";
import LoginForm from "./components/LoginForm.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import SignUpForm from "./components/SignUpForm.tsx";
import ToastifyContainer from "./components/ToastifyContainer.tsx";

export default function App() {
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();
    const [user, setUser] = useState<UserWithoutPassword>({id: "", username: "anonymousUser"});
    const navigate = useNavigate();
    useEffect(()=> {
        me()
    }, []);

    useEffect(()=>{
        if (user.username !== undefined && user.username !== 'anonymousUser') {
            getMyLoansData();
            navigate("/");
        }
    }, [user])

    function getMyLoansData() {
        axios.get("/api/myloans/user/"+user.id+"/loans")
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
        axios.post("/api/myloans/user/"+user.id+"/loans", newLoan)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleUpdateLoan(updatedLoan: LoanWithoutId, loanId: string) {
        axios.put("/api/myloans/user/"+user.id+"/loans/" + loanId, updatedLoan)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleDeleteLoan(loanId: string) {
        axios.delete("/api/myloans/user/"+user.id+"/loans/" + loanId)
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
        axios.post("/api/myloans/user/"+user.id+"/persons", newPersonWithoutId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleUpdatePerson(updatedPersonWithoutId: PersonWithoutId, personId: string) {
        axios.put("/api/myloans/user/"+user.id+"/persons/" + personId, updatedPersonWithoutId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleDeletePerson(personId: string) {
        axios.delete("/api/myloans/user/"+user.id+"/persons/" + personId)
            .then(() => getMyLoansData())
            .catch(function (error) {
                console.error(error);
            });
    }

    function handleLogin(username: string, password: string) {
        logout();
        axios.post("/api/user/login", null, {auth: {username, password}})
            .then((response) => {
                setUser(prevState => ({...prevState, username: response.data.username}));
                me();
                navigate("/");
            });
    }

    function logout() {
        axios.post("/api/user/logout")
            .then(() => {
                setUser({id: "", username: "anonymousUser"});
                navigate("/");
            });
    }

    function me() {
        axios.get("/api/user/me")
            .then(response => {
                setUser(prevState => ({...prevState, id: response.data.id, username: response.data.username}));
            });
    }

    function handleSignUp(username: string, password: string) {
        const userWithoutId: UserWithoutId = {username, password};
        axios.post("/api/user/sign-up", userWithoutId)
            .then(() => {
                handleLogin(username, password)
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    return (
        <>
            <ToastifyContainer/>
            <div>
                <div className={"app-body"}>
                    <Routes>
                        <Route element={<ProtectedRoutes user={user}/>}>
                            <Route path={"/"}
                                   element={<LoanList loans={loans} items={items} persons={persons}                                                       user={user} onLogout={logout}/>}/>
                            <Route path={"/addloan/:type"} element=
                                {<LoanForm loans={loans} items={items} persons={persons} user={user}
                                           onSubmit={handleSubmitLoanForm} onLogout={logout}/>}/>
                            <Route path={"/:id"} element=
                                {<LoanDetails loans={loans} items={items} persons={persons} user={user}
                                              onDelete={handleDeleteLoan} onLogout={logout}/>}/>
                            <Route path={"/updateloan/:id"} element=
                                {<LoanForm loans={loans} items={items} persons={persons} user={user}
                                           onSubmit={handleSubmitLoanForm} onLogout={logout}/>}/>
                            <Route path={"/updateloan/:id/person/add"} element=
                                {<PersonForm loans={loans} persons={persons} onSubmit={handleSubmitPersonForm}
                                             user={user} onLogout={logout}/>} />
                            <Route path={"/addloan/:type/person/add"} element=
                                {<PersonForm loans={loans} persons={persons} onSubmit={handleSubmitPersonForm}
                                             user={user} onLogout={logout}/>}/>
                            <Route path={"/updateloan/:id/person/:pid"} element=
                                {<PersonForm loans={loans} persons={persons} onSubmit={handleSubmitPersonForm}
                                             user={user} onLogout={logout}/>}/>
                            <Route path={"/addloan/:type/person/:pid"} element=
                                {<PersonForm loans={loans} persons={persons} onSubmit={handleSubmitPersonForm}
                                             user={user} onLogout={logout}/>}/>
                        </Route>
                        <Route path={"/login"} element={<LoginForm onLogin={handleLogin} onLogout={logout} user={user}/>}/>
                        <Route path={"/sign-up"} element={<SignUpForm onSignUp={handleSignUp} onLogout={logout} user={user}/>}/>
                    </Routes>
                </div>
            </div>
        </>
    )
}
