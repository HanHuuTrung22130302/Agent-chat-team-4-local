package com.anhduongbuilding.erp.subcontractor.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "ppc_details", schema = "subcontractor_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PpcDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_id", nullable = false)
    private PaymentCertificate certificate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subcontract_item_id", nullable = false)
    private SubcontractItem subcontractItem;

    @Column(name = "previous_quantity", precision = 14, scale = 3)
    private BigDecimal previousQuantity = BigDecimal.ZERO;

    @Column(name = "current_quantity", nullable = false, precision = 14, scale = 3)
    private BigDecimal currentQuantity;

    @Column(name = "cumulative_quantity", nullable = false, precision = 14, scale = 3)
    private BigDecimal cumulativeQuantity;

    @Column(name = "current_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal currentAmount;

    @Column(name = "cumulative_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal cumulativeAmount;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
