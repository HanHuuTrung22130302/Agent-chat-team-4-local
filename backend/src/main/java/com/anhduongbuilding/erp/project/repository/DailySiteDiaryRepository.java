package com.anhduongbuilding.erp.project.repository;

import com.anhduongbuilding.erp.project.model.DailySiteDiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySiteDiaryRepository extends JpaRepository<DailySiteDiary, Long> {
    List<DailySiteDiary> findByProjectIdOrderByDiaryDateDesc(Long projectId);
    Optional<DailySiteDiary> findByProjectIdAndDiaryDate(Long projectId, LocalDate diaryDate);
}
