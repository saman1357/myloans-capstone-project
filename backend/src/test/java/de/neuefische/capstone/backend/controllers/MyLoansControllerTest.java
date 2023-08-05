package de.neuefische.capstone.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
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
    @DirtiesContext
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
        ObjectMapper objectMapper = new ObjectMapper();
        String expected = objectMapper.writeValueAsString(testUserData);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expected));
    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenGetUserDataWithWrongId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        UserData testUserData = new UserData("0002",
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans"))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

    @Test
    @DirtiesContext
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
        LoanWithoutId newLoanWithoutId = new LoanWithoutId("2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");

        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper = new ObjectMapper();
        String newLoanWithoutIdJson = objectMapper.writeValueAsString(newLoanWithoutId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/myloans")
                        .contentType(MediaType.APPLICATION_JSON).content(newLoanWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(newLoanWithoutIdJson));

    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenAddNewLoanWithWrongUserId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        UserData userDataToUpdate = new UserData("0002",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")))
        );
        LoanWithoutId newLoanWithoutId = new LoanWithoutId("2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023");

        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper = new ObjectMapper();
        String newLoanWithoutIdJson = objectMapper.writeValueAsString(newLoanWithoutId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/myloans")
                        .contentType(MediaType.APPLICATION_JSON).content(newLoanWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));

    }

    @Test
    @DirtiesContext
    void expectLoan_whenGetLoanDetailsIsCalled() throws Exception {
        String loanId = "3001";
        Loan expectedLoan = new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "");
        UserData testUserData = new UserData("0001",
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
        ObjectMapper objectMapper = new ObjectMapper();
        String expectedJson = objectMapper.writeValueAsString(expectedLoan);
        myLoansRepository.save(testUserData);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans/" + loanId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(expectedJson));
    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenGetLoanDetailsWithWrongUserId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        String loanId = "3001";
        Loan expectedLoan = new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "");
        UserData testUserData = new UserData("0002",
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
        myLoansRepository.save(testUserData);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans/" + loanId))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

    @Test
    @DirtiesContext
    void expectLoanIdNotFoundException_whenGetLoanDetailsWithWrongId() throws Exception {
        String expectedMessage = """
                {
                 "message":"Loan not found for id: 123"
                }
                """;
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
        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans/123"))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

    @Test
    @DirtiesContext
    void expectUpdatedLoan_whenUpdateLoan() throws Exception {
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")))
        );
        LoanWithoutId updatedLoanWithoutId = new LoanWithoutId("2002", "0001", "1001", "Handy", 200, "06.06.2023", "12.12.2023");

        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper = new ObjectMapper();
        String updatedLoanWithoutIdJson = objectMapper.writeValueAsString(updatedLoanWithoutId);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/myloans/3002")
                        .contentType(MediaType.APPLICATION_JSON).content(updatedLoanWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(updatedLoanWithoutIdJson));

    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenUpdateLoanWithWrongUserId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        String loanId = "3001";
        LoanWithoutId updatedLoanWithoutId = new LoanWithoutId("0001", "2001", "1002", "Pippi Langstrumpf", 1, "01.01.2023", "");
        ObjectMapper objectMapper = new ObjectMapper();
        String updatedLoanWithoutIdJson = objectMapper.writeValueAsString(updatedLoanWithoutId);
        UserData testUserData = new UserData("123",
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
        mockMvc.perform(MockMvcRequestBuilders.put("/api/myloans/" + loanId)
                        .contentType(MediaType.APPLICATION_JSON).content(updatedLoanWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

    @Test
    @DirtiesContext
    void expectLoanRemovedFromList_whenDeleteLoan() throws Exception {
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")))
        );
        UserData updatedUserData = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"),
                        new Person("2002", "Mona"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", "")))
        );
        String loanIdToDelete="3002";

        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper = new ObjectMapper();
        String updatedUserDataJson = objectMapper.writeValueAsString(updatedUserData);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/myloans/"+loanIdToDelete))
                .andExpect(MockMvcResultMatchers.status().isOk());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/myloans"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(updatedUserDataJson));


    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenDeleteLoanWithWrongUserId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        String loanId = "3001";

        UserData testUserData = new UserData("123",
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
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/myloans/" + loanId))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

    @Test
    @DirtiesContext
    void expectNewPerson_whenAddNewPerson() throws Exception {
        UserData userDataToUpdate = new UserData("0001",
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                new ArrayList<>(List.of(
                        new Person("2001", "Hanna"))),
                new ArrayList<>(List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002","2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023")))
        );
        PersonWithoutId newPersonWithoutId = new PersonWithoutId( "Mona");

        myLoansRepository.save(userDataToUpdate);
        ObjectMapper objectMapper = new ObjectMapper();
        String newPersonWithoutIdJson = objectMapper.writeValueAsString(newPersonWithoutId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/myloans/person")
                        .contentType(MediaType.APPLICATION_JSON).content(newPersonWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(newPersonWithoutIdJson));

    }

    @Test
    @DirtiesContext
    void expectUserIdNotFoundException_whenAddPersonWithWrongUserId() throws Exception {
        String expectedMessage = """
                {
                 "message":"User Data not found for id: 0001"
                }
                """;
        PersonWithoutId newPersonWithoutId= new PersonWithoutId("Saman");
        ObjectMapper objectMapper = new ObjectMapper();
        String newPersonWithoutIdJson = objectMapper.writeValueAsString(newPersonWithoutId);

        UserData testUserData = new UserData("123",
                (List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "Book"))),
                List.of(
                        new Person("2001", "Hanna")),
                List.of(
                        new Loan("3001", "0001", "2001", "1002", "Der kleine Prinz", 1, "01.01.2023", ""),
                        new Loan("3002", "2002", "0001", "1001", "Fahrschule", 500, "06.06.2023", "12.12.2023"))
        );
        myLoansRepository.save(testUserData);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/myloans/person")
                .contentType(MediaType.APPLICATION_JSON).content(newPersonWithoutIdJson))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().json(expectedMessage));
    }

}
