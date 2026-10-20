package com.anhduongbuilding.erp.equipment.model;

import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.model.WBSItem;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "equipment_logs", schema = "equipment_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_number", nullable = false, unique = true, length = 50)
    private String logNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wbs_item_id")
    private WBSItem wbsItem;

    @Column(name = "log_date", nullable = false)
    @Builder.Default
    private LocalDate logDate = LocalDate.now();

    @Column(name = "operator_name", nullable = false, length = 150)
    private String operatorName;

    @Column(name = "start_engine_hour", precision = 10, scale = 2, nullable = false)
    private BigDecimal startEngineHour;

    @Column(name = "end_engine_hour", precision = 10, scale = 2, nullable = false)
    private BigDecimal endEngineHour;

    @Column(name = "worked_hours", precision = 6, scale = 2, nullable = false)
    private BigDecimal workedHours;

    @Column(name = "fuel_issued_liters", precision = 8, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal fuelIssuedLiters = BigDecimal.ZERO;

    @Column(name = "expected_fuel_liters", precision = 8, scale = 2, nullable = false)
    private BigDecimal expectedFuelLiters;

    @Column(name = "fuel_variance_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal fuelVarianceRate; // % chênh lệch

    @Column(name = "work_description", nullable = false, columnDefinition = "TEXT")
    private String workDescription;

    @Column(name = "alert_flag", length = 30)
    @Builder.Default
    private String alertFlag = "NORMAL"; // NORMAL, OVER_CONSUMPTION, CRITICAL

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
