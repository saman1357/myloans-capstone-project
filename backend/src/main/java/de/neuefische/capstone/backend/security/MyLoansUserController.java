package de.neuefische.capstone.backend.security;

import de.neuefische.capstone.backend.exceptions.ErrorMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class MyLoansUserController {
    private final MyLoansUserService myLoansUserService;
    @GetMapping("/me")
    public MyLoansUserWithoutPassword getUserInfo() {
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        String userId=myLoansUserService.getIdByUsername(username);
        return new MyLoansUserWithoutPassword(userId, username);
    }

    @PostMapping("login")
    public String login() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/sign-up")
    public String signUp(@Valid @RequestBody MyLoansUserWithoutId myLoansUserWithoutId){
        return myLoansUserService.signUp(myLoansUserWithoutId);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage handleArgumentNotValidExceptions(MethodArgumentNotValidException exception) {
        return new ErrorMessage(exception.getMessage());
    }
}
