package com.harufit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "routine_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoutineExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "routine_exercise_id")
    private Long routineExerciseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    @Column(nullable = false)
    private Integer sets;
    
    @Column(nullable = false)
    private Integer reps;
    
    @Column(columnDefinition = "DECIMAL(5,2)")
    private Double weight;
    
    @Column(name = "rest_time")
    private Integer restTime;
    
    @Column(name = "`order`")
    private Integer order;
}
