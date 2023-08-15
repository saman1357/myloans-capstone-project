package de.neuefische.capstone.backend.security;

import de.neuefische.capstone.backend.services.RandomIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyLoansUserService {
    private final MyLoansUserRepository myLoansUserRepository;
    private final Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public String signUp(MyLoansUserWithoutId newUserWithoutId) {
        MyLoansUser newUser = new MyLoansUser(RandomIdService.uuid(), newUserWithoutId.getUsername(), encoder.encode(newUserWithoutId.getPassword()));
        myLoansUserRepository.save(newUser);
        return newUserWithoutId.getUsername();
    }
}
