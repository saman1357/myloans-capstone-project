package de.neuefische.capstone.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class MyLoansUserController {
    private final MyLoansUserService myLoansUserService;
    @GetMapping("/me")
    public String getUserInfo() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("login")
    public String login() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/sign-up")
    public String signUp(@RequestBody MyLoansUserWithoutId myLoansUserWithoutId){
        return myLoansUserService.singUp(myLoansUserWithoutId);
    }
}
