import './App.css'
import {useEffect, useState} from "react";
import {Item, Loan, LoanWithoutId, Person} from "./model/DataModels.ts";
import axios from "axios";
import {Route, Routes} from "react-router-dom";
import LoanList from "./components/LoanList.tsx";
import LoanDetails from "./components/LoanDetails.tsx";
import LoanForm from "./components/LoanForm.tsx";

export default function App() {
    const [loans, setLoans] = useState<Loan[]>();
    const [items, setItems] = useState<Item[]>();
    const [persons, setPersons] = useState<Person[]>();

    const myId = "0001";

    useEffect(getMyLoansData, []);


    function getMyLoansData() {
        axios.get("api/myloans")
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
                           element={<LoanDetails loans={loans} items={items} persons={persons} myId={myId}/>}/>
                    <Route path={"/updateloan/:id"} element={<LoanForm loans={loans} items={items} persons={persons} onSubmit={handleUpdateLoan} myId={myId}/>}/>
                </Routes>
            </div>
        </>
    )
}

