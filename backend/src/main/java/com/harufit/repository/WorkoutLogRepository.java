package com.harufit.repository;

import com.harufit.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserIdOrderByWorkoutDateDesc(Long userId);
    List<WorkoutLog> findByUserIdAndWorkoutDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
