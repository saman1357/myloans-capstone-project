package de.neuefische.capstone.backend.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@Document("userData")
public class UserData {
    @Id
    @NotBlank
    private String id;
    private List<Item> items;
    private List<Person> persons;
    private List<Loan> loans;
}
