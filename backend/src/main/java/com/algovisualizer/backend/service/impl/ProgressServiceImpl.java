package com.algovisualizer.backend.service.impl;

import com.algovisualizer.backend.dto.request.ProgressRequest;
import com.algovisualizer.backend.dto.response.ProgressResponse;
import com.algovisualizer.backend.entity.Progress;
import com.algovisualizer.backend.entity.User;
import com.algovisualizer.backend.exception.ResourceNotFoundException;
import com.algovisualizer.backend.repository.ProgressRepository;
import com.algovisualizer.backend.repository.UserRepository;
import com.algovisualizer.backend.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgressServiceImpl(ProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Override
    @CacheEvict(value = "userProgress", key = "#userEmail")
    public ProgressResponse saveOrUpdateProgress(String userEmail, ProgressRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Progress progress = progressRepository.findByUserAndAlgorithmId(user, request.getAlgorithmId())
                .orElse(Progress.builder()
                        .user(user)
                        .algorithmId(request.getAlgorithmId())
                        .build());

        progress.setStatus(request.getStatus());
        progress.setSavedCodeSnippet(request.getSavedCodeSnippet());
        progress.setScore(request.getScore());

        Progress savedProgress = progressRepository.save(progress);
        return mapToResponse(savedProgress);
    }

    @Override
    @Cacheable(value = "userProgress", key = "#userEmail")
    public List<ProgressResponse> getUserProgress(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return progressRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProgressResponse getProgressForAlgorithm(String userEmail, String algorithmId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Progress progress = progressRepository.findByUserAndAlgorithmId(user, algorithmId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for algorithm: " + algorithmId));

        return mapToResponse(progress);
    }

    private ProgressResponse mapToResponse(Progress progress) {
        return ProgressResponse.builder()
                .id(progress.getId())
                .algorithmId(progress.getAlgorithmId())
                .status(progress.getStatus())
                .savedCodeSnippet(progress.getSavedCodeSnippet())
                .score(progress.getScore())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}
