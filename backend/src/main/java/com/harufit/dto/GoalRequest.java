package com.harufit.dto;

import com.harufit.entity.Goal;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {
    @NotNull(message = "목표 유형은 필수입니다.")
    private Goal.GoalType goalType;
    
    @NotNull(message = "목표 값은 필수입니다.")
    private Double targetValue;
    
    @NotNull(message = "현재 값은 필수입니다.")
    private Double currentValue;
    
    @NotNull(message = "마감일은 필수입니다.")
    private LocalDate deadline;
}
