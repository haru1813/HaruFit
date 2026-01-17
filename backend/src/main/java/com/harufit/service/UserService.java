package com.harufit.service;

import com.harufit.dto.ProfileUpdateRequest;
import com.harufit.entity.User;
import com.harufit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public Map<String, Object> getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", user.getUserId());
        map.put("email", user.getEmail());
        map.put("nickname", user.getNickname());
        map.put("height", user.getHeight());
        map.put("weight", user.getWeight());
        map.put("age", user.getAge());
        map.put("gender", user.getGender() != null ? user.getGender().toString() : null);
        
        return map;
    }
    
    @Transactional
    public Map<String, Object> updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (request.getNickname() != null) {
            if (userRepository.existsByNickname(request.getNickname()) && 
                !user.getNickname().equals(request.getNickname())) {
                throw new RuntimeException("이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(request.getNickname());
        }
        
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }
        
        if (request.getWeight() != null) {
            user.setWeight(request.getWeight());
        }
        
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        
        if (request.getGender() != null) {
            try {
                user.setGender(User.Gender.valueOf(request.getGender()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("유효하지 않은 성별입니다.");
            }
        }
        
        User updatedUser = userRepository.save(user);
        
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", updatedUser.getUserId());
        map.put("email", updatedUser.getEmail());
        map.put("nickname", updatedUser.getNickname());
        map.put("height", updatedUser.getHeight());
        map.put("weight", updatedUser.getWeight());
        map.put("age", updatedUser.getAge());
        map.put("gender", updatedUser.getGender() != null ? updatedUser.getGender().toString() : null);
        
        return map;
    }
}
