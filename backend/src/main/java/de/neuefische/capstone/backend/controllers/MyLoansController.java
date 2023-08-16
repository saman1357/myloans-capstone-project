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

    @GetMapping("/user/{userId}/loans")
    public UserData getUserData(@PathVariable String userId) {
        return myLoansService.getUserData(userId);
    }

    @PostMapping("user/{userId}/loans")
    public LoanWithoutId addLoan(@RequestBody LoanWithoutId newLoanWithoutId, @PathVariable String userId) {
        return myLoansService.addLoan(newLoanWithoutId, userId);
    }

    @PutMapping("/user/{userId}/loans/{id}")
    public LoanWithoutId updateLoan(@RequestBody LoanWithoutId updatedLoanWithoutId, @PathVariable String userId, @PathVariable String id) {
        return myLoansService.updateLoan(updatedLoanWithoutId, id, userId);

    }

    @GetMapping("/user/{userId}/loans/{id}")
    public Loan getLoanDetails(@PathVariable String userId, @PathVariable String id) {
        return myLoansService.getLoanDetails(id, userId);
    }

    @DeleteMapping("/user/{userId}/loans/{id}")
    public boolean deleteLoan(@PathVariable String userId, @PathVariable String id) {
        return myLoansService.deleteLoan(id, userId);
    }

    @PostMapping("/user/{userId}/persons")
    public PersonWithoutId addPerson(@RequestBody PersonWithoutId newPersonWithoutId, @PathVariable String userId) {
        return myLoansService.addPerson(newPersonWithoutId, userId);
    }

    @PutMapping("/user/{userId}/persons/{id}")
    public PersonWithoutId updatePerson(@RequestBody PersonWithoutId updatedPersonWithoutId,@PathVariable String userId, @PathVariable String id) {
        return myLoansService.updatePerson(updatedPersonWithoutId, id, userId);
    }

    @DeleteMapping("/user/{userId}/persons/{id}")
    public boolean deletePerson(@PathVariable String userId, @PathVariable String id) {
        return myLoansService.deletePerson(id, userId);
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage handleNoSuchElementExceptions(NoSuchElementException exception) {
        return new ErrorMessage(exception.getMessage());
    }

}
