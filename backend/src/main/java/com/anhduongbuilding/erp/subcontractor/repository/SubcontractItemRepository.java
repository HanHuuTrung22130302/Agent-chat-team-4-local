package com.anhduongbuilding.erp.subcontractor.repository;

import com.anhduongbuilding.erp.subcontractor.model.SubcontractItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubcontractItemRepository extends JpaRepository<SubcontractItem, Long> {
    List<SubcontractItem> findBySubcontractId(Long subcontractId);
}
