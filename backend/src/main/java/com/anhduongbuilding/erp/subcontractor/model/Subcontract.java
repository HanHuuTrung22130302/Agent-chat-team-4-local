package com.anhduongbuilding.erp.subcontractor.model;

import com.anhduongbuilding.erp.project.model.Project;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "subcontracts", schema = "subcontractor_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcontract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_number", nullable = false, unique = true, length = 100)
    private String contractNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subcontractor_id", nullable = false)
    private Subcontractor subcontractor;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "contract_type", length = 50)
    private String contractType = "UNIT_PRICE"; // LUMP_SUM, UNIT_PRICE, COST_PLUS

    @Column(name = "total_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalValue;

    @Column(name = "advance_payment_rate", precision = 5, scale = 2)
    private BigDecimal advancePaymentRate = new BigDecimal("10.00");

    @Column(name = "advance_payment_amount", precision = 18, scale = 2)
    private BigDecimal advancePaymentAmount = BigDecimal.ZERO;

    @Column(name = "retention_rate", precision = 5, scale = 2)
    private BigDecimal retentionRate = new BigDecimal("5.00");

    @Column(name = "retention_accumulated", precision = 18, scale = 2)
    private BigDecimal retentionAccumulated = BigDecimal.ZERO;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 50)
    private String status = "EXECUTING"; // DRAFT, EXECUTING, COMPLETED, TERMINATED

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt = ZonedDateTime.now();
}
