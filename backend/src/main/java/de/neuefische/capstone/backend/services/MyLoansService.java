package de.neuefische.capstone.backend.services;

import de.neuefische.capstone.backend.models.UserData;
import de.neuefische.capstone.backend.repositories.MyLoansRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyLoansService {
    private final MyLoansRepository myLoansRepository;
    String userId="0001";
    public UserData getUserData(){
        Optional<UserData> userData = myLoansRepository.findById(userId);
        return userData.orElse(null);
    }
}
