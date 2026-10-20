package com.anhduongbuilding.erp.winsteel.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "steel_components", schema = "winsteel_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SteelComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "steel_order_id", nullable = false)
    private SteelOrder steelOrder;

    @Column(name = "component_mark", nullable = false, length = 50)
    private String componentMark; // C1-1, R1-1, B1

    @Column(name = "component_type", nullable = false, length = 50)
    private String componentType; // COLUMN, RAFTER, PURLIN, BRACING, GUSSET_PLATE

    @Column(name = "profile_specs", nullable = false, length = 100)
    private String profileSpecs; // H500x250x8x12

    @Column(name = "steel_grade", length = 30)
    @Builder.Default
    private String steelGrade = "SS400";

    @Column(name = "length_mm", nullable = false)
    private Integer lengthMm;

    @Column(name = "weight_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal weightKg;

    @Column(name = "grid_location", length = 50)
    private String gridLocation;

    @Column(name = "qr_code_uid", nullable = false, unique = true, length = 100)
    private String qrCodeUid;

    // 5 Stages
    @Column(name = "cut_status", length = 20)
    @Builder.Default
    private String cutStatus = "PENDING";

    @Column(name = "fit_status", length = 20)
    @Builder.Default
    private String fitStatus = "PENDING";

    @Column(name = "weld_status", length = 20)
    @Builder.Default
    private String weldStatus = "PENDING";

    @Column(name = "blast_status", length = 20)
    @Builder.Default
    private String blastStatus = "PENDING";

    @Column(name = "paint_status", length = 20)
    @Builder.Default
    private String paintStatus = "PENDING";

    // Site Erection
    @Column(name = "shipping_status", length = 20)
    @Builder.Default
    private String shippingStatus = "IN_SHOP";

    @Column(name = "erection_status", length = 20)
    @Builder.Default
    private String erectionStatus = "PENDING"; // PENDING, ERECTED, INSPECTED_OK

    @Column(name = "erected_at")
    private OffsetDateTime erectedAt;

    @Column(name = "erected_by", length = 150)
    private String erectedBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
