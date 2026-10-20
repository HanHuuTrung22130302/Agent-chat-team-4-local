package com.anhduongbuilding.erp.inventory.repository;

import com.anhduongbuilding.erp.inventory.model.GoodsIssueNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsIssueNoteRepository extends JpaRepository<GoodsIssueNote, Long> {
    List<GoodsIssueNote> findByProjectId(Long projectId);
}
