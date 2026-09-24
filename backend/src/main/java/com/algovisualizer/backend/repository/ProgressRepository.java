package com.algovisualizer.backend.repository;

import com.algovisualizer.backend.entity.Progress;
import com.algovisualizer.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser(User user);
    Optional<Progress> findByUserAndAlgorithmId(User user, String algorithmId);
}
