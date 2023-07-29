package de.neuefische.capstone.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
class MyLoansControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    MyLoansRepository myLoansRepository;
    @Test
    void expectUserData_whenGetUserDataIsCalled() throws Exception {
        UserData testUserData = new UserData("0001",
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
        myLoansRepository.save(testUserData);
        ObjectMapper objectMapper=new ObjectMapper();
        String expected= objectMapper.writeValueAsString(testUserData);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    void expectNewLoan_whenAddNewLoan() throws Exception {
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")))
        );
        LoanWithoutId newLoanWithoutId= new LoanWithoutId("2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");
        //Loan expectedLoan = new Loan ("new uuid", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");
        /*UserData userDataUpdated = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
        new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("new uuid", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")))
        );*/
        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper=new ObjectMapper();
        String newLoanWithoutIdJson=objectMapper.writeValueAsString(newLoanWithoutId);
        //String expectedLoanJson= objectMapper.writeValueAsString(expectedLoan);


        mockMvc.perform(MockMvcRequestBuilders.post("/api/myloans")
                        .contentType(MediaType.APPLICATION_JSON).content(newLoanWithoutIdJson))
                //expectedLoan.setId(myLoansRepository.findById("0001").get().getLoans().get((myLoansRepository.findById("0001").get().getLoans().size())-1).getId())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(newLoanWithoutIdJson));

    }
}