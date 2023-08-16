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
    public String signUp(@RequestBody MyLoansUserWithoutId myLoansUserWithoutId){
        return myLoansUserService.signUp(myLoansUserWithoutId);
    }
}
