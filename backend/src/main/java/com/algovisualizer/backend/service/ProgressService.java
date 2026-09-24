package com.algovisualizer.backend.service;

import com.algovisualizer.backend.dto.request.ProgressRequest;
import com.algovisualizer.backend.dto.response.ProgressResponse;

import java.util.List;

public interface ProgressService {
    ProgressResponse saveOrUpdateProgress(String userEmail, ProgressRequest request);
    List<ProgressResponse> getUserProgress(String userEmail);
    ProgressResponse getProgressForAlgorithm(String userEmail, String algorithmId);
}
