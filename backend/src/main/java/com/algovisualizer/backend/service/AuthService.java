package com.algovisualizer.backend.service;

import com.algovisualizer.backend.dto.request.LoginRequest;
import com.algovisualizer.backend.dto.request.RegisterRequest;
import com.algovisualizer.backend.dto.response.JwtAuthResponse;

public interface AuthService {
    JwtAuthResponse login(LoginRequest request);
    String register(RegisterRequest request);
}
