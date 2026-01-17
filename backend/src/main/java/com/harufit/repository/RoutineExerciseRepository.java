package com.harufit.repository;

import com.harufit.entity.RoutineExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineExerciseRepository extends JpaRepository<RoutineExercise, Long> {
    List<RoutineExercise> findByRoutine_RoutineIdOrderByOrder(Long routineId);
    void deleteByRoutine_RoutineId(Long routineId);
}
