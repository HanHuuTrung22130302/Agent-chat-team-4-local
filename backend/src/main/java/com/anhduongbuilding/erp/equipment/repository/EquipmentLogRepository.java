package com.anhduongbuilding.erp.equipment.repository;

import com.anhduongbuilding.erp.equipment.model.EquipmentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentLogRepository extends JpaRepository<EquipmentLog, Long> {
    List<EquipmentLog> findByEquipmentId(Long equipmentId);
    List<EquipmentLog> findByProjectId(Long projectId);
}
