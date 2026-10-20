package com.anhduongbuilding.erp.subcontractor.model;

import com.anhduongbuilding.erp.core.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "payment_certificates", schema = "subcontractor_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 100)
    private String certificateNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subcontract_id", nullable = false)
    private Subcontract subcontract;

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber;

    @Column(name = "billing_start_date", nullable = false)
    private LocalDate billingStartDate;

    @Column(name = "billing_end_date", nullable = false)
    private LocalDate billingEndDate;

    @Column(name = "gross_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal grossAmount = BigDecimal.ZERO;

    @Column(name = "cumulative_gross_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal cumulativeGrossAmount = BigDecimal.ZERO;

    @Column(name = "advance_deduction", nullable = false, precision = 18, scale = 2)
    private BigDecimal advanceDeduction = BigDecimal.ZERO;

    @Column(name = "retention_deduction", nullable = false, precision = 18, scale = 2)
    private BigDecimal retentionDeduction = BigDecimal.ZERO;

    @Column(name = "backcharges_deduction", nullable = false, precision = 18, scale = 2)
    private BigDecimal backchargesDeduction = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "net_payable_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal netPayableAmount = BigDecimal.ZERO;

    @Column(length = 50)
    private String status = "DRAFT"; // DRAFT, SUBMITTED, APPROVED, PAID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedByUser;

    @Column(name = "approved_at")
    private ZonedDateTime approvedAt;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt = ZonedDateTime.now();
}
