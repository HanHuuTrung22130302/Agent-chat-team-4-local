package com.anhduongbuilding.erp.inventory.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "stock_balances", schema = "inventory_mgmt", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"project_id", "material_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "current_quantity", precision = 14, scale = 3, nullable = false)
    @Builder.Default
    private BigDecimal currentQuantity = BigDecimal.ZERO;

    @Column(name = "minimum_threshold", precision = 14, scale = 3)
    @Builder.Default
    private BigDecimal minimumThreshold = BigDecimal.ZERO;

    @Column(name = "last_updated")
    private OffsetDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void preUpdate() {
        lastUpdated = OffsetDateTime.now();
    }
}
