package de.neuefische.capstone.backend.services;

import de.neuefische.capstone.backend.models.Loan;
import de.neuefische.capstone.backend.models.LoanWithoutId;
import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyLoansService {
    private final MyLoansRepository myLoansRepository;
    String userId = "0001";

    public UserData getUserData() {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        if (userData.isPresent()) {
            return userData.get();
        }
        throw new NoSuchElementException("User Data for User with id: " + userId + " not found.");

    }

    public LoanWithoutId addLoan(LoanWithoutId newLoanWithoutId) {
        Optional<UserData> userData = myLoansRepository.findById(userId);
        Loan newLoan = new Loan(newLoanWithoutId);
        if (userData.isPresent()) {
            userData.get().getLoans().add(newLoan);
            myLoansRepository.save(userData.get());
            return newLoanWithoutId;
        }
        throw new NoSuchElementException("User Data for User with id: " + userId + " not found.");
    }
}
