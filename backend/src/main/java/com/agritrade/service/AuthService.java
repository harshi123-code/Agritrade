package com.agritrade.service;

import com.agritrade.dto.AuthResponse;
import com.agritrade.dto.LoginRequest;
import com.agritrade.dto.RegisterRequest;
import com.agritrade.model.UserAccount;
import com.agritrade.model.UserRole;
import com.agritrade.repository.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserAccountRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.role() == UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be created through public registration.");
        }
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        UserAccount user = users.save(new UserAccount(request.name().trim(), email,
                passwordEncoder.encode(request.password()), request.role()));
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        UserAccount user = users.findByEmail(email)
                .filter(account -> passwordEncoder.matches(request.password(), account.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect."));
        return toResponse(user);
    }

    private AuthResponse toResponse(UserAccount user) {
        return new AuthResponse(jwtService.createToken(user), user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}