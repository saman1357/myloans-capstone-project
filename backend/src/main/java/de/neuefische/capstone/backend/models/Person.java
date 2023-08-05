package de.neuefische.capstone.backend.models;

import de.neuefische.capstone.backend.services.RandomIdService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    private String id;
    private String name;

    public Person(PersonWithoutId personWithoutId) {
        this.id = RandomIdService.uuid();
        this.name = personWithoutId.getName();
    }
}
