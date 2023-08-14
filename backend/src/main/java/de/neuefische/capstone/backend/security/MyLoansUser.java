package de.neuefische.capstone.backend.security;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public record MyLoansUser(
        @Id
        String id,
        String username,
        String password
) {
}
