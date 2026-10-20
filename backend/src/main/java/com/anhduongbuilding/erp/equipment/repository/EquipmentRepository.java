package com.anhduongbuilding.erp.equipment.repository;

import com.anhduongbuilding.erp.equipment.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByCode(String code);
    List<Equipment> findByCurrentProjectId(Long projectId);
    List<Equipment> findBySafetyInspectionExpiryBefore(LocalDate date);
}
