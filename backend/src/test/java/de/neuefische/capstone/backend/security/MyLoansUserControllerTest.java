package de.neuefische.capstone.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
class MyLoansUserControllerTest {
@Autowired
    MockMvc mockMvc;
    @Test
    void getAnonymousUser_whenEndPointIsCalledWithoutLoggedInUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(
                        "anonymousUser"));
    }

    @Test
    @WithMockUser(username="saman")
    void getUserName_whenEndPointIsCalledWithLoggedInUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/me"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(
                        "saman"));
    }

    @Test
    @WithMockUser(username="saman")
    void getUserName_whenLoggingIn() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(
                        "saman"));
    }

    @Test
    void getUserName_whenSignUp() throws Exception {
        MyLoansUserWithoutId newUserWithoutId = new MyLoansUserWithoutId( "saman", "123");

        ObjectMapper objectMapper = new ObjectMapper();
        String newUserWithoutIdJson = objectMapper.writeValueAsString(newUserWithoutId);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/sign-up")
                        .contentType(MediaType.APPLICATION_JSON).content(newUserWithoutIdJson)
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("saman"));
    }
}
