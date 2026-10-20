package com.anhduongbuilding.erp.equipment.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "equipments", schema = "equipment_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // CRANE, EXCAVATOR, ROLLER, PILING_RIG, GENERATOR, TRUCK

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String model;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "plate_number", length = 50)
    private String plateNumber;

    @Column(name = "owner_type", length = 30)
    @Builder.Default
    private String ownerType = "INTERNAL";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_project_id")
    private Project currentProject;

    @Column(length = 30)
    @Builder.Default
    private String status = "OPERATIONAL";

    @Column(name = "standard_fuel_norm", precision = 6, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal standardFuelNorm = BigDecimal.ZERO; // lít dầu / giờ

    @Column(name = "total_engine_hours", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalEngineHours = BigDecimal.ZERO;

    @Column(name = "safety_inspection_expiry", nullable = false)
    private LocalDate safetyInspectionExpiry;

    @Column(name = "insurance_expiry")
    private LocalDate insuranceExpiry;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (updatedAt == null) updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
