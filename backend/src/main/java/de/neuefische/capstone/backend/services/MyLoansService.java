package de.neuefische.capstone.backend.services;

import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyLoansService {
    private final MyLoansRepository myLoansRepository;
    String userId = "0001";
    String userNotFoundExceptionMessage = "User Data not found for id: ";
    String loanNotFoundExceptionMessage = "Loan not found for id: ";
    String personNotFoundExceptionMessage = "Person not found for id: ";


    public UserData getUserData() {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        if (userData.isPresent()) {
            return userData.get();
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public LoanWithoutId addLoan(LoanWithoutId newLoanWithoutId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        Loan newLoan = new Loan(newLoanWithoutId);
        if (userData.isPresent()) {
            userData.get().getLoans().add(newLoan);
            myLoansRepository.save(userData.get());
            return newLoanWithoutId;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public Loan getLoanDetails(String loanId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        if (userData.isPresent()) {
            Optional<Loan> loan = userData.get().getLoans().stream().filter(l -> l.getId().equals(loanId)).findFirst();
            if (loan.isPresent()) {
                return loan.get();
            } else throw new NoSuchElementException(loanNotFoundExceptionMessage + loanId);
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);

    }

    public LoanWithoutId updateLoan(LoanWithoutId updatedLoanWithoutId, String loanId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        Loan updatedLoan = new Loan(updatedLoanWithoutId);
        updatedLoan.setId(loanId);
        if (userData.isPresent()) {
            int index = getIndexByLoanId(userData.get().getLoans(), loanId);
            if (index == -1) {
                throw new NoSuchElementException(loanNotFoundExceptionMessage + loanId);
            }
            userData.get().getLoans().set(index, updatedLoan);
            myLoansRepository.save(userData.get());
            return updatedLoanWithoutId;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public boolean deleteLoan(String loanId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        if (userData.isPresent()) {
            int index = getIndexByLoanId(userData.get().getLoans(), loanId);
            if (index == -1) {
                throw new NoSuchElementException(loanNotFoundExceptionMessage + loanId);
            }
            userData.get().getLoans().remove(index);
            myLoansRepository.save(userData.get());
            return true;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public PersonWithoutId addPerson(PersonWithoutId newPersonWithoutId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        Person newPerson = new Person(newPersonWithoutId);
        if (userData.isPresent()) {
            userData.get().getPersons().add(newPerson);
            myLoansRepository.save(userData.get());
            return newPersonWithoutId;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public PersonWithoutId updatePerson(PersonWithoutId updatedPersonWithoutId, String personId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        Person updatedPerson = new Person(updatedPersonWithoutId);
        updatedPerson.setId(personId);
        if (userData.isPresent()) {
            int index = getIndexByPersonId(userData.get().getPersons(), personId);
            if (index == -1) {
                throw new NoSuchElementException(personNotFoundExceptionMessage + personId);
            }
            userData.get().getPersons().set(index, updatedPerson);
            myLoansRepository.save(userData.get());
            return updatedPersonWithoutId;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    public boolean deletePerson(String personId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        if (userData.isPresent()) {
            int index = getIndexByPersonId(userData.get().getPersons(), personId);
            if (index == -1) {
                throw new NoSuchElementException(personNotFoundExceptionMessage + personId);
            }
            userData.get().getPersons().remove(index);
            myLoansRepository.save(userData.get());
            return true;
        }
        throw new NoSuchElementException(userNotFoundExceptionMessage + userId);
    }

    private int getIndexByLoanId(List<Loan> loans, String loanId) {
        int index = 0;
        for (Loan loan : loans) {
            if (loan.getId().equals(loanId)) {
                return index;
            }
            index += 1;
        }
        return -1;
    }

    private int getIndexByPersonId(List<Person> persons, String personId) {
        int index = 0;
        for (Person person : persons) {
            if (person.getId().equals(personId)) {
                return index;
            }
            index += 1;
        }
        return -1;
    }

}
