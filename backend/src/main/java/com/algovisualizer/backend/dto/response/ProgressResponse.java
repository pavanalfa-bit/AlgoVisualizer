package com.algovisualizer.backend.dto.response;

import com.algovisualizer.backend.entity.ProgressStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProgressResponse {
    private Long id;
    private String algorithmId;
    private ProgressStatus status;
    private String savedCodeSnippet;
    private int score;
    private LocalDateTime updatedAt;
}
