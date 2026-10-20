package com.anhduongbuilding.erp.subcontractor.model;

import com.anhduongbuilding.erp.project.model.WBSItem;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "subcontract_items", schema = "subcontractor_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubcontractItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcontract_id", nullable = false)
    private Subcontract subcontract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wbs_item_id")
    private WBSItem wbsItem;

    @Column(name = "item_code", length = 50)
    private String itemCode;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "contract_quantity", nullable = false, precision = 14, scale = 3)
    private BigDecimal contractQuantity;

    @Column(name = "unit_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
