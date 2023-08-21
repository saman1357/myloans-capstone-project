package de.neuefische.capstone.backend.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoanWithoutId {
    @NotBlank
    private String type;
    @NotBlank(message = "otherPartyId can't be blank!")
    private String otherPartyId;
    @NotBlank(message ="itemId can't be blank!")
    private String itemId;
    private String description;
    @Positive(message = "amount should be greater than 0")
    private int amount;
    @Pattern(regexp = "^((19|2\\d)\\d{2})-(0[1-9]|1[012])-(0[1-9]|[12]\\d|3[01])$", message = "no valid date!")
    private String loanDate;
    private String returnDate;
}
