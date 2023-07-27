package de.neuefische.capstone.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.neuefische.capstone.backend.models.Item;
import de.neuefische.capstone.backend.models.Loan;
import de.neuefische.capstone.backend.models.Person;
import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

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
}