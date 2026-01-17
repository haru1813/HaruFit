package com.harufit.controller;

import com.harufit.dto.ApiResponse;
import com.harufit.dto.ProfileUpdateRequest;
import com.harufit.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    private Long getUserId() {
        return 1L; // TODO: 실제 인증 시스템에서 userId 가져오기
    }
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {
        try {
            Map<String, Object> profile = userService.getUserProfile(getUserId());
            return ResponseEntity.ok(ApiResponse.success(profile, "프로필 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        try {
            Map<String, Object> profile = userService.updateProfile(getUserId(), request);
            return ResponseEntity.ok(ApiResponse.success(profile, "프로필이 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
}
