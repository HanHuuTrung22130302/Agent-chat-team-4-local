package com.anhduongbuilding.erp.equipment.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "mobilization_orders", schema = "equipment_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobilizationOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_project_id")
    private Project fromProject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_project_id", nullable = false)
    private Project toProject;

    @Column(name = "dispatch_date", nullable = false)
    private LocalDate dispatchDate;

    @Column(name = "arrival_date")
    private LocalDate arrivalDate;

    @Column(name = "transport_company", length = 255)
    private String transportCompany;

    @Column(name = "transport_cost", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal transportCost = BigDecimal.ZERO;

    @Column(length = 30)
    @Builder.Default
    private String status = "IN_TRANSIT"; // IN_TRANSIT, MOBILIZED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
