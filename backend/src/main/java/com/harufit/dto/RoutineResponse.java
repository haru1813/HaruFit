package com.harufit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineResponse {
    private Long routineId;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ExerciseDetail> exercises;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExerciseDetail {
        private Long routineExerciseId;
        private Long exerciseId;
        private String exerciseName;
        private String category;
        private String muscleGroup;
        private Integer sets;
        private Integer reps;
        private Double weight;
        private Integer restTime;
        private Integer order;
    }
}
