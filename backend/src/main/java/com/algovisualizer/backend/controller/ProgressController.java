package com.algovisualizer.backend.controller;

import com.algovisualizer.backend.dto.common.ApiResponse;
import com.algovisualizer.backend.dto.request.ProgressRequest;
import com.algovisualizer.backend.dto.response.ProgressResponse;
import com.algovisualizer.backend.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    @Autowired
    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProgressResponse>> saveProgress(
            @Valid @RequestBody ProgressRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        ProgressResponse response = progressService.saveOrUpdateProgress(email, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Progress saved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getUserProgress(Authentication authentication) {
        String email = authentication.getName();
        List<ProgressResponse> responses = progressService.getUserProgress(email);
        return ResponseEntity.ok(ApiResponse.success(responses, "Progress retrieved successfully"));
    }

    @GetMapping("/{algorithmId}")
    public ResponseEntity<ApiResponse<ProgressResponse>> getAlgorithmProgress(
            @PathVariable String algorithmId,
            Authentication authentication) {
        
        String email = authentication.getName();
        ProgressResponse response = progressService.getProgressForAlgorithm(email, algorithmId);
        return ResponseEntity.ok(ApiResponse.success(response, "Progress retrieved successfully"));
    }
}
