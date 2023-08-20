package de.neuefische.capstone.backend.security;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MyLoansUserRepository extends MongoRepository<MyLoansUser, String> {
    Optional<MyLoansUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
