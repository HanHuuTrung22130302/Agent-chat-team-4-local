package com.anhduongbuilding.erp.inventory.repository;

import com.anhduongbuilding.erp.inventory.model.GoodsReceiptNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Long> {
    List<GoodsReceiptNote> findByProjectId(Long projectId);
}
