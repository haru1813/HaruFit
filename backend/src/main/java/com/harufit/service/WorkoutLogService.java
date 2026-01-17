package com.harufit.service;

import com.harufit.dto.WorkoutLogRequest;
import com.harufit.entity.Exercise;
import com.harufit.entity.Routine;
import com.harufit.entity.WorkoutLog;
import com.harufit.entity.WorkoutSet;
import com.harufit.repository.ExerciseRepository;
import com.harufit.repository.RoutineRepository;
import com.harufit.repository.WorkoutLogRepository;
import com.harufit.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {
    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final ExerciseRepository exerciseRepository;
    private final RoutineRepository routineRepository;
    
    public List<Map<String, Object>> getUserWorkoutLogs(Long userId) {
        List<WorkoutLog> logs = workoutLogRepository.findByUserIdOrderByWorkoutDateDesc(userId);
        return logs.stream().map(this::toMap).collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> createWorkoutLog(WorkoutLogRequest request, Long userId) {
        WorkoutLog log = new WorkoutLog();
        log.setUserId(userId);
        log.setWorkoutDate(request.getWorkoutDate());
        log.setDuration(request.getDuration());
        log.setNotes(request.getNotes());
        
        if (request.getRoutineId() != null) {
            Routine routine = routineRepository.findById(request.getRoutineId())
                    .orElse(null);
            log.setRoutine(routine);
        }
        
        WorkoutLog savedLog = workoutLogRepository.save(log);
        
        // 세트 정보 저장
        for (WorkoutLogRequest.SetItem item : request.getSets()) {
            Exercise exercise = exerciseRepository.findById(item.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("운동을 찾을 수 없습니다: " + item.getExerciseId()));
            
            WorkoutSet set = new WorkoutSet();
            set.setWorkoutLog(savedLog);
            set.setExercise(exercise);
            set.setSetNumber(item.getSetNumber());
            set.setWeight(item.getWeight());
            set.setReps(item.getReps());
            set.setRestTime(item.getRestTime());
            
            workoutSetRepository.save(set);
        }
        
        return toMap(savedLog);
    }
    
    @Transactional
    public void deleteWorkoutLog(Long logId, Long userId) {
        WorkoutLog log = workoutLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("운동 기록을 찾을 수 없습니다."));
        
        if (!log.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        workoutLogRepository.delete(log);
    }
    
    private Map<String, Object> toMap(WorkoutLog log) {
        Map<String, Object> map = new HashMap<>();
        map.put("log_id", log.getLogId());
        map.put("workout_date", log.getWorkoutDate());
        map.put("duration", log.getDuration());
        map.put("notes", log.getNotes());
        map.put("routine_name", log.getRoutine() != null ? log.getRoutine().getName() : null);
        
        List<Map<String, Object>> sets = workoutSetRepository.findByWorkoutLog_LogId(log.getLogId())
                .stream()
                .map(s -> {
                    Map<String, Object> setMap = new HashMap<>();
                    setMap.put("exercise_name", s.getExercise().getName());
                    setMap.put("set_number", s.getSetNumber());
                    setMap.put("weight", s.getWeight());
                    setMap.put("reps", s.getReps());
                    return setMap;
                })
                .collect(Collectors.toList());
        map.put("sets", sets);
        
        return map;
    }
}
