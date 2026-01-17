package com.harufit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RoutineRequest {
    @NotBlank(message = "루틴 이름은 필수입니다.")
    @Size(min = 1, max = 100, message = "루틴 이름은 1-100자 사이여야 합니다.")
    private String name;
    
    private String description;
    
    @NotNull(message = "운동 목록은 필수입니다.")
    @Size(min = 1, message = "최소 1개 이상의 운동이 필요합니다.")
    private List<ExerciseItem> exercises;
    
    @Data
    public static class ExerciseItem {
        @NotNull(message = "운동 ID는 필수입니다.")
        private Long exerciseId;
        
        @NotNull(message = "세트 수는 필수입니다.")
        private Integer sets;
        
        @NotNull(message = "횟수는 필수입니다.")
        private Integer reps;
        
        private Double weight;
        
        private Integer restTime;
        
        private Integer order;
    }
}
