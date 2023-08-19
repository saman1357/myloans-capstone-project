package de.neuefische.capstone.backend.models;

import de.neuefische.capstone.backend.services.RandomIdService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loan {
    private String id;
    private String type;
    private String otherPartyId;
    private String itemId;
    private String description;
    private int amount;
    private String loanDate;
    private String returnDate;


    public Loan(LoanWithoutId loanWithoutId) {
        this.id = RandomIdService.uuid();
        this.type=loanWithoutId.getType();
        this.otherPartyId = loanWithoutId.getOtherPartyId();
        this.itemId = loanWithoutId.getItemId();
        this.description = loanWithoutId.getDescription();
        this.amount = loanWithoutId.getAmount();
        this.loanDate = loanWithoutId.getLoanDate();
        this.returnDate = loanWithoutId.getReturnDate();
    }
}
