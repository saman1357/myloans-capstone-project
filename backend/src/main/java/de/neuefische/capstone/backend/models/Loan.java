package de.neuefische.capstone.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Loan {
    private String id;
    private String lenderId;
    private String borrowerId;
    private String itemId;
    private String description;
    private int amount;
    private String loanDate;
    private String returnDate;
}
