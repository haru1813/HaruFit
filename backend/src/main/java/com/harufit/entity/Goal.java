package com.harufit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "goal_type", nullable = false)
    private GoalType goalType;
    
    @Column(name = "target_value", nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double targetValue;
    
    @Column(name = "current_value", nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double currentValue;
    
    @Column(nullable = false)
    private LocalDate deadline;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalStatus status;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = GoalStatus.active;
        }
    }
    
    public enum GoalType {
        weight, muscle, frequency, duration, other
    }
    
    public enum GoalStatus {
        active, completed, cancelled
    }
}
