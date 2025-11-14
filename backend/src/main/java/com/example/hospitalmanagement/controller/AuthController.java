package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.AuthRequest;
import com.example.hospitalmanagement.dto.AuthResponse;
import com.example.hospitalmanagement.model.User;
import com.example.hospitalmanagement.repository.UserRepository;
import com.example.hospitalmanagement.security.jwt.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            UserDetails ud = (UserDetails) auth.getPrincipal();

            // load roles for token
            User user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
            var roles = user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toList());

            String token = jwtUtil.generateToken(ud.getUsername(), roles);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
