package com.anhduongbuilding.erp.boq.model;

import com.anhduongbuilding.erp.project.model.WBSItem;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "boq_items", schema = "estimating_costing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BOQItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boq_header_id", nullable = false)
    private BOQHeader boqHeader;

    @Column(name = "item_code", nullable = false, length = 50)
    private String itemCode;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(nullable = false, precision = 14, scale = 4)
    private BigDecimal quantity;

    @Column(name = "material_unit_rate", precision = 16, scale = 2)
    private BigDecimal materialUnitRate = BigDecimal.ZERO;

    @Column(name = "labor_unit_rate", precision = 16, scale = 2)
    private BigDecimal laborUnitRate = BigDecimal.ZERO;

    @Column(name = "equipment_unit_rate", precision = 16, scale = 2)
    private BigDecimal equipmentUnitRate = BigDecimal.ZERO;

    @Column(name = "unit_rate", nullable = false, precision = 16, scale = 2)
    private BigDecimal unitRate;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wbs_item_id")
    private WBSItem wbsItem;

    @Column(name = "actual_completed_quantity", precision = 14, scale = 4)
    private BigDecimal actualCompletedQuantity = BigDecimal.ZERO;

    @Column(name = "actual_incurred_cost", precision = 18, scale = 2)
    private BigDecimal actualIncurredCost = BigDecimal.ZERO;
}
