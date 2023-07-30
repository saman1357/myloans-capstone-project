package de.neuefische.capstone.backend.services;

import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyLoansServiceTest {
    MyLoansRepository myLoansRepository = mock(MyLoansRepository.class);
    MyLoansService myLoansService = new MyLoansService(myLoansRepository);


    @Test
    void expectUserData_whenGetUserDataIsCalled() {
        //GIVEN
        String userId = "0001";
        UserData expected = new UserData("0001",
                (List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona")),
                List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023"))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(expected));
        UserData actual=myLoansService.getUserData();
        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expected, actual);

    }

    @Test
    void expectNewLoan_whenAddNewLoan() {
        //GIVEN
        String userId = "0001";
        LoanWithoutId newLoanWithoutId= new LoanWithoutId("2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");
        //Loan expectedLoan = new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")
                        ))
        );
        UserData userDataUpdated = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("new uuid", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        LoanWithoutId actualLoan=myLoansService.addLoan(newLoanWithoutId);
        //expectedLoan.setId(actualLoan.getId());


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertEquals(newLoanWithoutId, actualLoan);

    }
}