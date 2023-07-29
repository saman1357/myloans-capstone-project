package de.neuefische.capstone.backend.controllers;

import de.neuefische.capstone.backend.models.LoanWithoutId;
import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.services.MyLoansService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/myloans")
@RequiredArgsConstructor
public class MyLoansController {
    private final MyLoansService myLoansService;
    @GetMapping
    public UserData getUserData(){
        return myLoansService.getUserData();
    }

    @PostMapping
    public LoanWithoutId addLoan(@RequestBody LoanWithoutId newLoanWithoutId){
        return myLoansService.addLoan(newLoanWithoutId);

    }
}
