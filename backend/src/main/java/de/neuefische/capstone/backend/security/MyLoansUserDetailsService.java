package de.neuefische.capstone.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@RequiredArgsConstructor
@Service
public class MyLoansUserDetailsService implements UserDetailsService {
    private final MyLoansUserRepository myLoansUserRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        MyLoansUser myLoansUser=myLoansUserRepository.findByUsername(username).orElseThrow(
                ()->new UsernameNotFoundException("Username: "+username+" not found!"));
        return new User(myLoansUser.username(), myLoansUser.password(), Collections.emptyList());
    }
}
