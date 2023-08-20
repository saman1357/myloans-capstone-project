package de.neuefische.capstone.backend.security;

import de.neuefische.capstone.backend.models.Item;
import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import de.neuefische.capstone.backend.services.RandomIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyLoansUserService {
    private final MyLoansUserRepository myLoansUserRepository;
    private final MyLoansRepository myLoansRepository;
    private final Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    public String signUp(MyLoansUserWithoutId newUserWithoutId) {
        MyLoansUser newUser = new MyLoansUser(RandomIdService.uuid(), newUserWithoutId.getUsername(), encoder.encode(newUserWithoutId.getPassword()));
        myLoansUserRepository.save(newUser);
        UserData newUserData = new UserData(newUser.id(),
                new ArrayList<>(List.of(
                        new Item("1001", "€ (money)"),
                        new Item("1002", "units (nonmoney)"))),
                new ArrayList<>(List.of()),
                new ArrayList<>(List.of())
        );
        myLoansRepository.save(newUserData);
        return newUserWithoutId.getUsername();
    }

    public String getIdByUsername(String username){
        Optional<MyLoansUser> myLoansUser = myLoansUserRepository.findByUsername(username);
        if (myLoansUser.isPresent()) {
            return myLoansUser.get().id();
        }
        return null;
    }

    public boolean existsByUsername(String userName) {
        return myLoansUserRepository.existsByUsername(userName);

    }
}
