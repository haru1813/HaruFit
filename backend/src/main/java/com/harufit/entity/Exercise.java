package com.harufit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String category;
    
    @Column(name = "muscle_group")
    private String muscleGroup;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}
