package com.harufit.controller;

import com.harufit.dto.ApiResponse;
import com.harufit.dto.WorkoutLogRequest;
import com.harufit.service.WorkoutLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutLogController {
    private final WorkoutLogService workoutLogService;
    
    private Long getUserId() {
        return 1L; // TODO: 실제 인증 시스템에서 userId 가져오기
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWorkoutLogs() {
        try {
            List<Map<String, Object>> logs = workoutLogService.getUserWorkoutLogs(getUserId());
            return ResponseEntity.ok(ApiResponse.success(logs, "운동 기록 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createWorkoutLog(@Valid @RequestBody WorkoutLogRequest request) {
        try {
            Map<String, Object> log = workoutLogService.createWorkoutLog(request, getUserId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(log, "운동 기록이 생성되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{logId}")
    public ResponseEntity<ApiResponse<?>> deleteWorkoutLog(@PathVariable Long logId) {
        try {
            workoutLogService.deleteWorkoutLog(logId, getUserId());
            return ResponseEntity.ok(ApiResponse.success(null, "운동 기록이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
}
