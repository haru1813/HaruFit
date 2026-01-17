package com.harufit.service;

import com.harufit.dto.JournalRequest;
import com.harufit.entity.WorkoutJournal;
import com.harufit.repository.WorkoutJournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalService {
    private final WorkoutJournalRepository journalRepository;
    
    public List<Map<String, Object>> getUserJournals(Long userId) {
        List<WorkoutJournal> journals = journalRepository.findByUserIdOrderByWorkoutDateDesc(userId);
        return journals.stream().map(this::toMap).collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> createOrUpdateJournal(JournalRequest request, Long userId) {
        WorkoutJournal journal = journalRepository
                .findByUserIdAndWorkoutDate(userId, request.getWorkoutDate())
                .orElse(new WorkoutJournal());
        
        journal.setUserId(userId);
        journal.setWorkoutDate(request.getWorkoutDate());
        journal.setContent(request.getContent());
        
        WorkoutJournal savedJournal = journalRepository.save(journal);
        return toMap(savedJournal);
    }
    
    @Transactional
    public void deleteJournal(Long journalId, Long userId) {
        WorkoutJournal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new RuntimeException("일지를 찾을 수 없습니다."));
        
        if (!journal.getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }
        
        journalRepository.delete(journal);
    }
    
    private Map<String, Object> toMap(WorkoutJournal journal) {
        Map<String, Object> map = new HashMap<>();
        map.put("journal_id", journal.getJournalId());
        map.put("workout_date", journal.getWorkoutDate());
        map.put("content", journal.getContent());
        map.put("created_at", journal.getCreatedAt());
        map.put("updated_at", journal.getUpdatedAt());
        return map;
    }
}
