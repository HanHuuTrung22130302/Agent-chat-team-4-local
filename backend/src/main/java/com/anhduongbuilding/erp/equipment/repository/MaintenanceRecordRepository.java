package com.anhduongbuilding.erp.equipment.repository;

import com.anhduongbuilding.erp.equipment.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByEquipmentId(Long equipmentId);
}
