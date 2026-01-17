package com.harufit.service;

import com.harufit.dto.GoalRequest;
import com.harufit.entity.Goal;
import com.harufit.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    
    public List<Map<String, Object>> getUserGoals(Long userId) {
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return goals.stream().map(this::toMap).collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> createGoal(GoalRequest request, Long userId) {
        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setGoalType(request.getGoalType());
        goal.setTargetValue(request.getTargetValue());
        goal.setCurrentValue(request.getCurrentValue());
        goal.setDeadline(request.getDeadline());
        goal.setStatus(Goal.GoalStatus.active);
        
        Goal savedGoal = goalRepository.save(goal);
        return toMap(savedGoal);
    }
    
    @Transactional
    public Map<String, Object> updateGoal(Long goalId, GoalRequest request, Long userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        
        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        goal.setGoalType(request.getGoalType());
        goal.setTargetValue(request.getTargetValue());
        goal.setCurrentValue(request.getCurrentValue());
        goal.setDeadline(request.getDeadline());
        
        // 목표 달성 체크
        if (goal.getCurrentValue() >= goal.getTargetValue()) {
            goal.setStatus(Goal.GoalStatus.completed);
        }
        
        Goal updatedGoal = goalRepository.save(goal);
        return toMap(updatedGoal);
    }
    
    @Transactional
    public void deleteGoal(Long goalId, Long userId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        
        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        goalRepository.delete(goal);
    }
    
    private Map<String, Object> toMap(Goal goal) {
        Map<String, Object> map = new HashMap<>();
        map.put("goal_id", goal.getGoalId());
        map.put("goal_type", goal.getGoalType().toString());
        map.put("target_value", goal.getTargetValue());
        map.put("current_value", goal.getCurrentValue());
        map.put("deadline", goal.getDeadline());
        map.put("status", goal.getStatus().toString());
        
        double progress = goal.getTargetValue() > 0 
            ? (goal.getCurrentValue() / goal.getTargetValue()) * 100 
            : 0;
        map.put("progress", Math.min(100, Math.max(0, progress)));
        
        return map;
    }
}
