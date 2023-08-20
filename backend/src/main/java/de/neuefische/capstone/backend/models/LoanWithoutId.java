package de.neuefische.capstone.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoanWithoutId {
    private String type;
    private String otherPartyId;
    private String itemId;
    private String description;
    private int amount;
    private String loanDate;
    private String returnDate;
}
