package com.anhduongbuilding.erp.boq.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "boq_headers", schema = "estimating_costing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BOQHeader {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 50)
    private String version = "V1.0-ORIGINAL";

    @Column(name = "total_material_cost", precision = 18, scale = 2)
    private BigDecimal totalMaterialCost = BigDecimal.ZERO;

    @Column(name = "total_labor_cost", precision = 18, scale = 2)
    private BigDecimal totalLaborCost = BigDecimal.ZERO;

    @Column(name = "total_equipment_cost", precision = 18, scale = 2)
    private BigDecimal totalEquipmentCost = BigDecimal.ZERO;

    @Column(name = "total_overhead_cost", precision = 18, scale = 2)
    private BigDecimal totalOverheadCost = BigDecimal.ZERO;

    @Column(name = "total_estimated_amount", precision = 18, scale = 2)
    private BigDecimal totalEstimatedAmount = BigDecimal.ZERO;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
