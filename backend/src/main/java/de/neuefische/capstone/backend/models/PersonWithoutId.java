package de.neuefische.capstone.backend.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonWithoutId {
    @NotBlank(message = "person's name can't beblank!")
    private String name;
}
