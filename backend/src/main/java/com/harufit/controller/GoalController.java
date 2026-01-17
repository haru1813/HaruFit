package com.harufit.controller;

import com.harufit.dto.ApiResponse;
import com.harufit.dto.GoalRequest;
import com.harufit.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;
    
    private Long getUserId() {
        return 1L; // TODO: 실제 인증 시스템에서 userId 가져오기
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getGoals() {
        try {
            List<Map<String, Object>> goals = goalService.getUserGoals(getUserId());
            return ResponseEntity.ok(ApiResponse.success(goals, "목표 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createGoal(@Valid @RequestBody GoalRequest request) {
        try {
            Map<String, Object> goal = goalService.createGoal(request, getUserId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(goal, "목표가 생성되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PutMapping("/{goalId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateGoal(
            @PathVariable Long goalId,
            @Valid @RequestBody GoalRequest request) {
        try {
            Map<String, Object> goal = goalService.updateGoal(goalId, request, getUserId());
            return ResponseEntity.ok(ApiResponse.success(goal, "목표가 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{goalId}")
    public ResponseEntity<ApiResponse<?>> deleteGoal(@PathVariable Long goalId) {
        try {
            goalService.deleteGoal(goalId, getUserId());
            return ResponseEntity.ok(ApiResponse.success(null, "목표가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
}
