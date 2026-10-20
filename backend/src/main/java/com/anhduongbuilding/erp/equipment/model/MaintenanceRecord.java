package com.anhduongbuilding.erp.equipment.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "maintenance_records", schema = "equipment_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "maintenance_type", nullable = false, length = 50)
    private String maintenanceType; // 250H_PERIODIC, 500H_PERIODIC, EMERGENCY_REPAIR

    @Column(name = "engine_hours_at_maintenance", precision = 10, scale = 2, nullable = false)
    private BigDecimal engineHoursAtMaintenance;

    @Column(name = "maintenance_date", nullable = false)
    private LocalDate maintenanceDate;

    @Column(name = "performed_by", nullable = false, length = 255)
    private String performedBy;

    @Column(name = "parts_replaced", columnDefinition = "TEXT")
    private String partsReplaced;

    @Column(name = "total_cost", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal totalCost = BigDecimal.ZERO;

    @Column(name = "next_maintenance_engine_hours", precision = 10, scale = 2, nullable = false)
    private BigDecimal nextMaintenanceEngineHours;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
