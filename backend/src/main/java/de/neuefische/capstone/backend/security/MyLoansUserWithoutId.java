package de.neuefische.capstone.backend.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyLoansUserWithoutId {
    private String username;
    private String password;
}
