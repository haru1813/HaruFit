package com.harufit.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkoutLogRequest {
    private Long routineId;
    
    @NotNull(message = "운동 날짜는 필수입니다.")
    private LocalDate workoutDate;
    
    private Integer duration;
    private String notes;
    
    @NotNull(message = "운동 세트 정보는 필수입니다.")
    private List<SetItem> sets;
    
    @Data
    public static class SetItem {
        @NotNull(message = "운동 ID는 필수입니다.")
        private Long exerciseId;
        
        @NotNull(message = "세트 번호는 필수입니다.")
        private Integer setNumber;
        
        private Double weight;
        
        @NotNull(message = "횟수는 필수입니다.")
        private Integer reps;
        
        private Integer restTime;
    }
}
