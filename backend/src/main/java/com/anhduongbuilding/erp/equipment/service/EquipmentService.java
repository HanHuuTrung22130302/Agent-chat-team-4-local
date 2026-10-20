package com.anhduongbuilding.erp.equipment.service;

import com.anhduongbuilding.erp.equipment.model.*;
import com.anhduongbuilding.erp.equipment.repository.*;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentLogRepository equipmentLogRepository;
    private final MobilizationOrderRepository mobilizationOrderRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Equipment> getEquipmentsByProject(Long projectId) {
        return equipmentRepository.findByCurrentProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public List<Equipment> getExpiringInspections(int withinDays) {
        LocalDate threshold = LocalDate.now().plusDays(withinDays);
        return equipmentRepository.findBySafetyInspectionExpiryBefore(threshold);
    }

    @Transactional
    public EquipmentLog recordEngineHourAndFuel(
            Long equipmentId,
            Long projectId,
            String operatorName,
            BigDecimal startHour,
            BigDecimal endHour,
            BigDecimal fuelIssuedLiters,
            String workDescription) {

        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found with id: " + equipmentId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        if (endHour.compareTo(startHour) <= 0) {
            throw new IllegalArgumentException("Số giờ kết thúc ca máy phải lớn hơn số giờ bắt đầu!");
        }

        BigDecimal workedHours = endHour.subtract(startHour);
        BigDecimal standardNorm = equipment.getStandardFuelNorm() != null ? equipment.getStandardFuelNorm() : BigDecimal.ZERO;
        BigDecimal expectedFuel = workedHours.multiply(standardNorm).setScale(2, RoundingMode.HALF_UP);

        BigDecimal varianceRate = BigDecimal.ZERO;
        if (expectedFuel.compareTo(BigDecimal.ZERO) > 0) {
            varianceRate = fuelIssuedLiters.subtract(expectedFuel)
                    .divide(expectedFuel, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        String alertFlag = "NORMAL";
        if (varianceRate.compareTo(BigDecimal.valueOf(15.00)) > 0) {
            alertFlag = "CRITICAL";
            log.warn("CẢNH BÁO ĐỎ: Tiêu hao nhiên liệu xe máy {} vượt định mức >15% (thực tế: {}%)", equipment.getCode(), varianceRate);
        } else if (varianceRate.compareTo(BigDecimal.valueOf(5.00)) > 0) {
            alertFlag = "OVER_CONSUMPTION";
            log.info("Cảnh báo: Tiêu hao nhiên liệu xe máy {} vượt định mức >5% (thực tế: {}%)", equipment.getCode(), varianceRate);
        }

        // Update equipment engine hours
        equipment.setTotalEngineHours(equipment.getTotalEngineHours().add(workedHours));
        equipmentRepository.save(equipment);

        String logNumber = "EL-" + LocalDate.now().getYear() + "-" + String.format("%04d", System.currentTimeMillis() % 10000);

        EquipmentLog logEntry = EquipmentLog.builder()
                .logNumber(logNumber)
                .equipment(equipment)
                .project(project)
                .operatorName(operatorName)
                .startEngineHour(startHour)
                .endEngineHour(endHour)
                .workedHours(workedHours)
                .fuelIssuedLiters(fuelIssuedLiters)
                .expectedFuelLiters(expectedFuel)
                .fuelVarianceRate(varianceRate)
                .workDescription(workDescription)
                .alertFlag(alertFlag)
                .build();

        return equipmentLogRepository.save(logEntry);
    }

    public FuelNormAnalysisResult analyzeFuelNorm(Equipment equipment, BigDecimal workedHours, BigDecimal fuelIssued) {
        BigDecimal norm = equipment.getStandardFuelNorm() != null ? equipment.getStandardFuelNorm() : BigDecimal.ZERO;
        BigDecimal expected = workedHours.multiply(norm).setScale(2, RoundingMode.HALF_UP);

        BigDecimal varianceRate = BigDecimal.ZERO;
        if (expected.compareTo(BigDecimal.ZERO) > 0) {
            varianceRate = fuelIssued.subtract(expected)
                    .divide(expected, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        String alertFlag = "NORMAL";
        if (varianceRate.compareTo(BigDecimal.valueOf(15.00)) > 0) {
            alertFlag = "CRITICAL";
        } else if (varianceRate.compareTo(BigDecimal.valueOf(5.00)) > 0) {
            alertFlag = "OVER_CONSUMPTION";
        }

        LocalDate now = LocalDate.now();
        LocalDate expiry = equipment.getSafetyInspectionExpiry();
        boolean isExpired = expiry != null && expiry.isBefore(now);
        long daysUntil = expiry != null ? ChronoUnit.DAYS.between(now, expiry) : 0;

        String msg = isExpired
                ? "NGUY HIỂM: Thiết bị đã quá hạn kiểm định an toàn! Cấm hoạt động tại công trường."
                : (daysUntil <= 30
                        ? "CẢNH BÁO: Thiết bị sắp hết hạn kiểm định an toàn trong " + daysUntil + " ngày!"
                        : "Hồ sơ kiểm định an toàn và mức tiêu hao nhiên liệu hợp lệ.");

        return FuelNormAnalysisResult.builder()
                .equipmentCode(equipment.getCode())
                .equipmentName(equipment.getName())
                .category(equipment.getCategory())
                .workedHours(workedHours)
                .fuelIssuedLiters(fuelIssued)
                .expectedFuelLiters(expected)
                .fuelVarianceRate(varianceRate)
                .alertFlag(alertFlag)
                .isInspectionExpired(isExpired)
                .daysUntilInspectionExpiry(daysUntil)
                .alertMessage(msg)
                .build();
    }
}
