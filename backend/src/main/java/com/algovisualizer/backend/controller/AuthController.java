package com.algovisualizer.backend.controller;

import com.algovisualizer.backend.dto.common.ApiResponse;
import com.algovisualizer.backend.dto.request.LoginRequest;
import com.algovisualizer.backend.dto.request.RegisterRequest;
import com.algovisualizer.backend.dto.response.JwtAuthResponse;
import com.algovisualizer.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success(response, "Registration successful"), HttpStatus.CREATED);
    }
}
