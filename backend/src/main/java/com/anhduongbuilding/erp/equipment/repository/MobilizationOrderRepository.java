package com.anhduongbuilding.erp.equipment.repository;

import com.anhduongbuilding.erp.equipment.model.MobilizationOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MobilizationOrderRepository extends JpaRepository<MobilizationOrder, Long> {
    List<MobilizationOrder> findByEquipmentId(Long equipmentId);
    List<MobilizationOrder> findByToProjectId(Long projectId);
}
