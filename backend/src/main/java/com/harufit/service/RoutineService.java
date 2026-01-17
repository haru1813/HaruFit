package com.harufit.service;

import com.harufit.dto.RoutineRequest;
import com.harufit.dto.RoutineResponse;
import com.harufit.entity.Exercise;
import com.harufit.entity.Routine;
import com.harufit.entity.RoutineExercise;
import com.harufit.repository.ExerciseRepository;
import com.harufit.repository.RoutineExerciseRepository;
import com.harufit.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoutineService {
    private final RoutineRepository routineRepository;
    private final RoutineExerciseRepository routineExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    
    public List<RoutineResponse> getUserRoutines(Long userId) {
        List<Routine> routines = routineRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return routines.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public RoutineResponse getRoutine(Long routineId, Long userId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("루틴을 찾을 수 없습니다."));
        
        if (!routine.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        return toResponse(routine);
    }
    
    @Transactional
    public RoutineResponse createRoutine(RoutineRequest request, Long userId) {
        Routine routine = new Routine();
        routine.setUserId(userId);
        routine.setName(request.getName());
        routine.setDescription(request.getDescription());
        
        Routine savedRoutine = routineRepository.save(routine);
        
        // 운동 항목 추가
        int order = 1;
        for (RoutineRequest.ExerciseItem item : request.getExercises()) {
            Exercise exercise = exerciseRepository.findById(item.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("운동을 찾을 수 없습니다: " + item.getExerciseId()));
            
            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(savedRoutine);
            routineExercise.setExercise(exercise);
            routineExercise.setSets(item.getSets());
            routineExercise.setReps(item.getReps());
            routineExercise.setWeight(item.getWeight());
            routineExercise.setRestTime(item.getRestTime());
            routineExercise.setOrder(item.getOrder() != null ? item.getOrder() : order++);
            
            routineExerciseRepository.save(routineExercise);
        }
        
        return toResponse(savedRoutine);
    }
    
    @Transactional
    public RoutineResponse updateRoutine(Long routineId, RoutineRequest request, Long userId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("루틴을 찾을 수 없습니다."));
        
        if (!routine.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        routine.setName(request.getName());
        routine.setDescription(request.getDescription());
        
        // 기존 운동 항목 삭제
        routineExerciseRepository.deleteByRoutine_RoutineId(routineId);
        
        // 새로운 운동 항목 추가
        int order = 1;
        for (RoutineRequest.ExerciseItem item : request.getExercises()) {
            Exercise exercise = exerciseRepository.findById(item.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("운동을 찾을 수 없습니다: " + item.getExerciseId()));
            
            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(routine);
            routineExercise.setExercise(exercise);
            routineExercise.setSets(item.getSets());
            routineExercise.setReps(item.getReps());
            routineExercise.setWeight(item.getWeight());
            routineExercise.setRestTime(item.getRestTime());
            routineExercise.setOrder(item.getOrder() != null ? item.getOrder() : order++);
            
            routineExerciseRepository.save(routineExercise);
        }
        
        Routine updatedRoutine = routineRepository.save(routine);
        return toResponse(updatedRoutine);
    }
    
    @Transactional
    public void deleteRoutine(Long routineId, Long userId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("루틴을 찾을 수 없습니다."));
        
        if (!routine.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        routineRepository.delete(routine);
    }
    
    public List<Map<String, Object>> getAllExercises() {
        return exerciseRepository.findAll().stream()
                .map(exercise -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("exercise_id", exercise.getExerciseId());
                    map.put("name", exercise.getName());
                    map.put("category", exercise.getCategory());
                    map.put("muscle_group", exercise.getMuscleGroup());
                    map.put("description", exercise.getDescription());
                    return map;
                })
                .collect(Collectors.toList());
    }
    
    private RoutineResponse toResponse(Routine routine) {
        List<RoutineResponse.ExerciseDetail> exercises = routineExerciseRepository
                .findByRoutine_RoutineIdOrderByOrder(routine.getRoutineId())
                .stream()
                .map(re -> RoutineResponse.ExerciseDetail.builder()
                        .routineExerciseId(re.getRoutineExerciseId())
                        .exerciseId(re.getExercise().getExerciseId())
                        .exerciseName(re.getExercise().getName())
                        .category(re.getExercise().getCategory())
                        .muscleGroup(re.getExercise().getMuscleGroup())
                        .sets(re.getSets())
                        .reps(re.getReps())
                        .weight(re.getWeight())
                        .restTime(re.getRestTime())
                        .order(re.getOrder())
                        .build())
                .collect(Collectors.toList());
        
        return RoutineResponse.builder()
                .routineId(routine.getRoutineId())
                .name(routine.getName())
                .description(routine.getDescription())
                .createdAt(routine.getCreatedAt())
                .updatedAt(routine.getUpdatedAt())
                .exercises(exercises)
                .build();
    }
}
