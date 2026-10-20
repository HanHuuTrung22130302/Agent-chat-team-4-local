package com.anhduongbuilding.erp.inventory.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items", schema = "inventory_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(precision = 14, scale = 3, nullable = false)
    private BigDecimal quantity;

    @Column(name = "unit_price", precision = 18, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "received_quantity", precision = 14, scale = 3)
    @Builder.Default
    private BigDecimal receivedQuantity = BigDecimal.ZERO;
}
