package com.harufit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workout_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "set_id")
    private Long setId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "log_id", nullable = false)
    private WorkoutLog workoutLog;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    @Column(name = "set_number", nullable = false)
    private Integer setNumber;
    
    @Column(columnDefinition = "DECIMAL(5,2)")
    private Double weight;
    
    @Column(nullable = false)
    private Integer reps;
    
    @Column(name = "rest_time")
    private Integer restTime;
}
