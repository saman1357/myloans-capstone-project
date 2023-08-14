package de.neuefische.capstone.backend.security;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyLoansUserServiceTest {
    MyLoansUserRepository myLoansUserRepository = mock(MyLoansUserRepository.class);
    MyLoansUserService myLoansUserService = new MyLoansUserService(myLoansUserRepository);

    @Test
    void expectUsername_WhenSignUp() {
        //GIVEN
        String expectedUsername = "saman";
        MyLoansUserWithoutId newUserWithoutId = new MyLoansUserWithoutId(expectedUsername, "123");
        MyLoansUser newUser = new MyLoansUser("newId", expectedUsername, "123");

        //WHEN
        when(myLoansUserRepository.save(newUser)).thenReturn(newUser);
        String actual = myLoansUserService.signUp(newUserWithoutId);

        //THEN
        verify(myLoansUserRepository).save(any());
        assertEquals(expectedUsername, actual);
    }
}
