package com.harufit.controller;

import com.harufit.dto.ApiResponse;
import com.harufit.dto.JournalRequest;
import com.harufit.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/journals")
@RequiredArgsConstructor
public class JournalController {
    private final JournalService journalService;
    
    private Long getUserId() {
        return 1L; // TODO: 실제 인증 시스템에서 userId 가져오기
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getJournals() {
        try {
            List<Map<String, Object>> journals = journalService.getUserJournals(getUserId());
            return ResponseEntity.ok(ApiResponse.success(journals, "일지 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createJournal(@Valid @RequestBody JournalRequest request) {
        try {
            Map<String, Object> journal = journalService.createOrUpdateJournal(request, getUserId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(journal, "일지가 저장되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{journalId}")
    public ResponseEntity<ApiResponse<?>> deleteJournal(@PathVariable Long journalId) {
        try {
            journalService.deleteJournal(journalId, getUserId());
            return ResponseEntity.ok(ApiResponse.success(null, "일지가 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("ERROR", e.getMessage()));
        }
    }
}
