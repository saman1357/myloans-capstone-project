package de.neuefische.capstone.backend.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyLoansUserWithoutId {
    @NotBlank(message = "username can't be blank!")
    private String username;
    @NotBlank(message = "password can't be blank")
    @Size(min = 8,max = 128,message = "password should be between 8 ans 128 characters long!")
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", message = "password must contain at least one uppercase letter, one lowercase letter and one number!")
    private String password;
}
