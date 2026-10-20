package com.anhduongbuilding.erp.inventory.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "materials", schema = "inventory_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // STEEL, CONCRETE, CEMENT, AGGREGATES, FINISHING, MEP

    @Column(nullable = false, length = 30)
    private String unit; // TẤN, M3, BAO, M2, KG

    @Column(name = "standard_norm_rate", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal standardNormRate = BigDecimal.ZERO; // % hao hụt định mức theo TT 12/2021

    @Column(columnDefinition = "TEXT")
    private String specs;

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
