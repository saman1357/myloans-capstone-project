package de.neuefische.capstone.backend.security;

import de.neuefische.capstone.backend.models.*;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import de.neuefische.capstone.backend.services.MyLoansService;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyLoansUserDetailsServiceTest {
    MyLoansUserRepository myLoansUserRepository = mock(MyLoansUserRepository.class);
    MyLoansUserDetailsService myLoansUserDetailsService = new MyLoansUserDetailsService(myLoansUserRepository);

    @Test
    void expectUserDetails_whenLoadUserByUsername() {
        //GIVEN
        String username = "saman";
        MyLoansUser expectedMyLoansUser = new MyLoansUser("001", "saman", "saman1");

        //WHEN
        when(myLoansUserRepository.findByUsername(username)).thenReturn(Optional.of(expectedMyLoansUser));
        UserDetails actualUserDetails=myLoansUserDetailsService.loadUserByUsername(username);

        //THEN
        verify(myLoansUserRepository).findByUsername(username);
        assertEquals(expectedMyLoansUser.username(), actualUserDetails.getUsername());
    }

    @Test
    void expectUsernameNotFoundException_whenLoadUserByWrongUsername() {
        //GIVEN
        String username = "saman";
        String expectedMessage = "Username: "+username+" not found!";

        //WHEN
        when(myLoansUserRepository.findByUsername(username)).thenReturn(Optional.empty());
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () ->
                myLoansUserDetailsService.loadUserByUsername(username));

        //THEN
        verify(myLoansUserRepository).findByUsername(username);
        assertEquals(expectedMessage, exception.getMessage());

    }
}