package com.harufit.repository;

import com.harufit.entity.WorkoutJournal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutJournalRepository extends JpaRepository<WorkoutJournal, Long> {
    List<WorkoutJournal> findByUserIdOrderByWorkoutDateDesc(Long userId);
    Optional<WorkoutJournal> findByUserIdAndWorkoutDate(Long userId, LocalDate workoutDate);
}
