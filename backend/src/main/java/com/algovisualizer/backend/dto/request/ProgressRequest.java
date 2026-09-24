package com.algovisualizer.backend.dto.request;

import com.algovisualizer.backend.entity.ProgressStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressRequest {
    
    @NotBlank(message = "Algorithm ID is required")
    private String algorithmId;
    
    @NotNull(message = "Status is required")
    private ProgressStatus status;
    
    private String savedCodeSnippet;
    
    private int score;
}
