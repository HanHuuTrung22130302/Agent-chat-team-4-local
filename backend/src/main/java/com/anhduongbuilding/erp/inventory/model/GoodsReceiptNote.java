package com.anhduongbuilding.erp.inventory.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goods_receipt_notes", schema = "inventory_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsReceiptNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grn_number", nullable = false, unique = true, length = 50)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "delivery_truck_plate", length = 30)
    private String deliveryTruckPlate;

    @Column(name = "weighing_slip_number", length = 50)
    private String weighingSlipNumber;

    @Column(name = "has_co_cq")
    @Builder.Default
    private Boolean hasCoCq = true;

    @Column(name = "inspector_notes", columnDefinition = "TEXT")
    private String inspectorNotes;

    @Column(name = "receipt_date", nullable = false)
    @Builder.Default
    private LocalDate receiptDate = LocalDate.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "grn_id")
    @Builder.Default
    private List<GoodsReceiptItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
