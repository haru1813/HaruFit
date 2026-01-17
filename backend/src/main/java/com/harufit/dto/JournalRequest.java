package com.harufit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JournalRequest {
    @NotNull(message = "운동 날짜는 필수입니다.")
    private LocalDate workoutDate;
    
    @NotBlank(message = "내용은 필수입니다.")
    private String content;
}
