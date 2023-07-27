package de.neuefische.capstone.backend.repositories;

import de.neuefische.capstone.backend.models.UserData;
import org.springframework.data.mongodb.repository.MongoRepository;
@org.springframework.stereotype.Repository
public interface MyLoansRepository extends MongoRepository<UserData, String> {
}
