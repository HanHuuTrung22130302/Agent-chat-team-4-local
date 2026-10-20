package com.anhduongbuilding.erp.winsteel.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "steel_orders", schema = "winsteel_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SteelOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "total_tonnage", precision = 10, scale = 3, nullable = false)
    private BigDecimal totalTonnage;

    @Column(name = "drawing_approval_date")
    private LocalDate drawingApprovalDate;

    @Column(name = "target_delivery_date", nullable = false)
    private LocalDate targetDeliveryDate;

    @Column(length = 30)
    @Builder.Default
    private String status = "IN_PRODUCTION"; // BOM_IMPORTING, NESTING, IN_PRODUCTION, ERECTING, COMPLETED

    @OneToMany(mappedBy = "steelOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SteelComponent> components = new ArrayList<>();

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
