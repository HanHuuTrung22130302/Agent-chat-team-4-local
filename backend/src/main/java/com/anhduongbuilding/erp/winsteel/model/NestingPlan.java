package com.anhduongbuilding.erp.winsteel.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "nesting_plans", schema = "winsteel_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NestingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_code", nullable = false, unique = true, length = 50)
    private String planCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "steel_order_id", nullable = false)
    private SteelOrder steelOrder;

    @Column(name = "raw_plate_specs", nullable = false, length = 100)
    private String rawPlateSpecs;

    @Column(name = "raw_plate_weight_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal rawPlateWeightKg;

    @Column(name = "utilized_weight_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal utilizedWeightKg;

    @Column(name = "scrap_weight_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal scrapWeightKg;

    @Column(name = "scrap_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal scrapRate; // scrap_weight / raw_weight * 100%

    @Column(name = "is_approved")
    @Builder.Default
    private Boolean isApproved = false;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
