package com.harufit.controller;

import com.harufit.dto.ApiResponse;
import com.harufit.dto.RoutineRequest;
import com.harufit.dto.RoutineResponse;
import com.harufit.service.RoutineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {
    private final RoutineService routineService;
    
    // 임시로 userId를 헤더에서 받음 (나중에 인증 시스템으로 대체)
    private Long getUserId() {
        // TODO: 실제 인증 시스템에서 userId 가져오기
        // 현재는 헤더에서 받거나 기본값 사용
        return 1L; // 임시
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoutineResponse>>> getRoutines() {
        try {
            List<RoutineResponse> routines = routineService.getUserRoutines(getUserId());
            return ResponseEntity.ok(ApiResponse.success(routines, "루틴 목록 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @GetMapping("/{routineId}")
    public ResponseEntity<ApiResponse<RoutineResponse>> getRoutine(@PathVariable Long routineId) {
        try {
            RoutineResponse routine = routineService.getRoutine(routineId, getUserId());
            return ResponseEntity.ok(ApiResponse.success(routine, "루틴 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<RoutineResponse>> createRoutine(@Valid @RequestBody RoutineRequest request) {
        try {
            RoutineResponse routine = routineService.createRoutine(request, getUserId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(routine, "루틴이 생성되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PutMapping("/{routineId}")
    public ResponseEntity<ApiResponse<RoutineResponse>> updateRoutine(
            @PathVariable Long routineId,
            @Valid @RequestBody RoutineRequest request) {
        try {
            RoutineResponse routine = routineService.updateRoutine(routineId, request, getUserId());
            return ResponseEntity.ok(ApiResponse.success(routine, "루틴이 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{routineId}")
    public ResponseEntity<ApiResponse<?>> deleteRoutine(@PathVariable Long routineId) {
        try {
            routineService.deleteRoutine(routineId, getUserId());
            return ResponseEntity.ok(ApiResponse.success(null, "루틴이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @GetMapping("/exercises")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getExercises() {
        try {
            List<Map<String, Object>> exercises = routineService.getAllExercises();
            return ResponseEntity.ok(ApiResponse.success(exercises, "운동 목록 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
}
