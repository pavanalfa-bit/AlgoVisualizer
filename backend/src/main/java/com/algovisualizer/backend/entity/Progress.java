package com.algovisualizer.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Progress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String algorithmId; // e.g., "dijkstra", "quicksort"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status;

    @Column(columnDefinition = "TEXT")
    private String savedCodeSnippet;

    @Column(nullable = false)
    @Builder.Default
    private int score = 0;
}
