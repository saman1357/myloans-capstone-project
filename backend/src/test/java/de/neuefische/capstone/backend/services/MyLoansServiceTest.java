package de.neuefische.capstone.backend.services;

import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
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
        UserData actual=myLoansService.getUserData(userId);
        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expected, actual);

    }

    @Test
    void expectNewLoan_whenAddNewLoan() {
        //GIVEN
        String userId = "0001";
        LoanWithoutId newLoanWithoutId= new LoanWithoutId("2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");
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
        LoanWithoutId actualLoan=myLoansService.addLoan(newLoanWithoutId, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertEquals(newLoanWithoutId, actualLoan);

    }

    @Test
    void expectLoan_whenGetLoanDetailsIsCalled() {
        //GIVEN
        String userId = "0001";
        String loanId="3001";
        Loan expectedLoan = new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "");
        UserData expectedUserData = new UserData("0001",
                (List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona")),
                List.of(
                        expectedLoan,
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023"))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(expectedUserData));
        Loan actual=myLoansService.getLoanDetails(loanId, userId);
        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expectedLoan, actual);

    }

    @Test
    void expectUpdatedLoan_whenUpdateLoan() {
        //GIVEN
        String userId = "0001";
        String loanIdToUpdate="3002";
        LoanWithoutId updatedLoanWithoutId= new LoanWithoutId("2002", "0001", "1001", "Handy", 200, "06.06.2023", "12.12.2023");
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

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
                        new Loan("3002", "2002", "0001", "1001", "Handy", 200, "06.06.2023", "12.12.2023")))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        LoanWithoutId actualLoan=myLoansService.updateLoan(updatedLoanWithoutId, loanIdToUpdate, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertEquals(updatedLoanWithoutId, actualLoan);

    }

    @Test
    void expectLoanIdNotFoundException_whenUpdateLoanWithWrongId() {
        //GIVEN
        String userId = "0001";
        String loanIdToUpdate="123";
        String expectedMessage = "Loan not found for id: 123";
        LoanWithoutId updatedLoanWithoutId= new LoanWithoutId("2002", "0001", "1001", "Handy", 200, "06.06.2023", "12.12.2023");
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

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
                        new Loan("3002", "2002", "0001", "1001", "Handy", 200, "06.06.2023", "12.12.2023")))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> myLoansService.updateLoan(updatedLoanWithoutId, loanIdToUpdate, userId));


        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void expectTrue_whenDeleteLoan() {
        //GIVEN
        String userId = "0001";
        String loanIdToDelete="3002";
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

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
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        boolean successfulDeleted=myLoansService.deleteLoan(loanIdToDelete, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertTrue(successfulDeleted);

    }

    @Test
    void expectLoanIdNotFoundException_whenDeleteLoanWithWrongId() {
        //GIVEN
        String userId = "0001";
        String loanIdToDelete="123";
        String expectedMessage = "Loan not found for id: 123";
        UserData userDataBeforeDeleteLoan = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

                ))
        );
        UserData userDataAfterDeleteLoan = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataBeforeDeleteLoan));
        when(myLoansRepository.save(userDataAfterDeleteLoan)).thenReturn(userDataAfterDeleteLoan);
        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> myLoansService.deleteLoan(loanIdToDelete, userId));


        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void expectNewPerson_whenAddNewPerson() {
        //GIVEN
        String userId = "0001";
        PersonWithoutId newPersonWithoutId= new PersonWithoutId("Mona");
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002","2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")
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
        PersonWithoutId actualPerson=myLoansService.addPerson(newPersonWithoutId, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertEquals(newPersonWithoutId, actualPerson);

    }

    @Test
    void expectUpdatedPerson_whenUpdatePerson() {
        //GIVEN
        String userId = "0001";
        String personIdToUpdate="2002";
        PersonWithoutId updatedPersonWithoutId= new PersonWithoutId("Sandra");
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

                ))
        );
        UserData userDataUpdated = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Sandra"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")
                ))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        PersonWithoutId actualPerson=myLoansService.updatePerson(updatedPersonWithoutId, personIdToUpdate, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertEquals(updatedPersonWithoutId, actualPerson);

    }

    @Test
    void expectTrue_whenDeletePerson() {
        //GIVEN
        String userId = "0001";
        String personIdToDelete="2002";
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

                ))
        );
        UserData userDataUpdated = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna")
                        )),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")
                        ))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataToUpdate));
        when(myLoansRepository.save(userDataToUpdate)).thenReturn(userDataUpdated);
        boolean successfulDeleted=myLoansService.deletePerson(personIdToDelete, userId);


        //THEN
        verify(myLoansRepository).findById(userId);
        verify(myLoansRepository).save(userDataToUpdate);
        assertTrue(successfulDeleted);

    }

    @Test
    void expectPersonIdNotFoundException_whenDeletePersonWithWrongId() {
        //GIVEN
        String userId = "0001";
        String personIdToDelete="123";
        String expectedMessage = "Person not found for id: 123";
        UserData userDataBeforeDeletePerson = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")

                ))
        );
        UserData userDataAfterDeletePerson = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna")
                       )),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")
                        ))
        );
        //WHEN
        when(myLoansRepository.findById(userId)).thenReturn(Optional.of(userDataBeforeDeletePerson));
        when(myLoansRepository.save(userDataAfterDeletePerson)).thenReturn(userDataAfterDeletePerson);
        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> myLoansService.deletePerson(personIdToDelete, userId));


        //THEN
        verify(myLoansRepository).findById(userId);
        assertEquals(expectedMessage, exception.getMessage());
    }


}
