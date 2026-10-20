package com.anhduongbuilding.erp.equipment.model;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelNormAnalysisResult {
    private String equipmentCode;
    private String equipmentName;
    private String category;
    private BigDecimal workedHours;
    private BigDecimal fuelIssuedLiters;
    private BigDecimal expectedFuelLiters;
    private BigDecimal fuelVarianceRate; // %
    private String alertFlag;            // NORMAL, OVER_CONSUMPTION, CRITICAL
    private Boolean isInspectionExpired;
    private Long daysUntilInspectionExpiry;
    private String alertMessage;
}
