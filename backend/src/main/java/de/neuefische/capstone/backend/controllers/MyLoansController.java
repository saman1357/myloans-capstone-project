package de.neuefische.capstone.backend.controllers;

import de.neuefische.capstone.backend.exceptions.ErrorMessage;
import de.neuefische.capstone.backend.models.Loan;
import de.neuefische.capstone.backend.models.LoanWithoutId;
import de.neuefische.capstone.backend.models.PersonWithoutId;
import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.services.MyLoansService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/myloans")
@RequiredArgsConstructor
public class MyLoansController {
    private final MyLoansService myLoansService;

    @GetMapping
    public UserData getUserData() {
        return myLoansService.getUserData();
    }

    @PostMapping
    public LoanWithoutId addLoan(@RequestBody LoanWithoutId newLoanWithoutId) {
        return myLoansService.addLoan(newLoanWithoutId);
    }

    @PutMapping("/{id}")
    public LoanWithoutId updateLoan(@RequestBody LoanWithoutId updatedLoanWithoutId, @PathVariable String id) {
        return myLoansService.updateLoan(updatedLoanWithoutId, id);

    }

    @GetMapping("/{id}")
    public Loan getLoanDetails(@PathVariable String id) {
        return myLoansService.getLoanDetails(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteLoan(@PathVariable String id) {
        return myLoansService.deleteLoan(id);
    }

    @PostMapping("/person")
    public PersonWithoutId addPerson(@RequestBody PersonWithoutId newPersonWithoutId) {
        return myLoansService.addPerson(newPersonWithoutId);
    }

    @PutMapping("/person/{id}")
    public PersonWithoutId updatePerson(@RequestBody PersonWithoutId updatedPersonWithoutId, @PathVariable String id) {
        return myLoansService.updatePerson(updatedPersonWithoutId, id);
    }

    @DeleteMapping("/person/{id}")
    public boolean deletePerson(@PathVariable String id) {
        return myLoansService.deletePerson(id);
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage handleNoSuchElementExceptions(NoSuchElementException exception) {
        return new ErrorMessage(exception.getMessage());
    }

}
