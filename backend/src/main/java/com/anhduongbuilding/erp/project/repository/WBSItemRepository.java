package com.anhduongbuilding.erp.project.repository;

import com.anhduongbuilding.erp.project.model.WBSItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WBSItemRepository extends JpaRepository<WBSItem, Long> {
    List<WBSItem> findByProjectIdOrderByWbsCodeAsc(Long projectId);
    List<WBSItem> findByProjectIdAndParentIdIsNullOrderByWbsCodeAsc(Long projectId);
}
