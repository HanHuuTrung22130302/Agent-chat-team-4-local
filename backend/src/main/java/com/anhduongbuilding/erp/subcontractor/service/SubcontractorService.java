package com.anhduongbuilding.erp.subcontractor.service;

import com.anhduongbuilding.erp.subcontractor.model.*;
import com.anhduongbuilding.erp.subcontractor.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubcontractorService {

    private final SubcontractorRepository subcontractorRepository;
    private final SubcontractRepository subcontractRepository;
    private final SubcontractItemRepository subcontractItemRepository;
    private final PaymentCertificateRepository paymentCertificateRepository;

    public List<Subcontractor> getAllSubcontractors() {
        return subcontractorRepository.findAll();
    }

    public Optional<Subcontractor> getSubcontractorById(Long id) {
        return subcontractorRepository.findById(id);
    }

    @Transactional
    public Subcontractor createSubcontractor(Subcontractor subcontractor) {
        log.info("Creating subcontractor: {} - {}", subcontractor.getCode(), subcontractor.getName());
        return subcontractorRepository.save(subcontractor);
    }

    public List<Subcontract> getSubcontractsByProject(Long projectId) {
        return subcontractRepository.findByProjectId(projectId);
    }

    public Optional<Subcontract> getSubcontractById(Long id) {
        return subcontractRepository.findById(id);
    }

    @Transactional
    public Subcontract createSubcontract(Subcontract subcontract) {
        log.info("Creating subcontract: {} for Project ID: {}", subcontract.getContractNumber(), subcontract.getProject().getId());
        return subcontractRepository.save(subcontract);
    }

    public List<PaymentCertificate> getCertificatesBySubcontract(Long subcontractId) {
        return paymentCertificateRepository.findBySubcontractIdOrderByPeriodNumberAsc(subcontractId);
    }

    /**
     * FIDIC Progress Payment Certificate (PPC) Calculation Engine
     * Gross Amount = Sum(Current Quantity * Unit Price)
     * Advance Deduction = Gross Amount * (Advance Rate / 100)
     * Retention Deduction = Gross Amount * (Retention Rate / 100) -> 5%
     * Net Payable = Gross - Advance - Retention - Backcharges + Tax
     */
    @Transactional
    public PaymentCertificate generatePpc(
            Long subcontractId,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal grossAmount,
            BigDecimal backcharges,
            BigDecimal taxRate
    ) {
        Subcontract contract = subcontractRepository.findById(subcontractId)
                .orElseThrow(() -> new IllegalArgumentException("Subcontract not found: " + subcontractId));

        // Determine next period number
        Optional<PaymentCertificate> lastPpc = paymentCertificateRepository.findTopBySubcontractIdOrderByPeriodNumberDesc(subcontractId);
        int periodNumber = lastPpc.map(p -> p.getPeriodNumber() + 1).orElse(1);
        BigDecimal prevCumulativeGross = lastPpc.map(PaymentCertificate::getCumulativeGrossAmount).orElse(BigDecimal.ZERO);

        BigDecimal cumulativeGross = prevCumulativeGross.add(grossAmount);

        // Advance payment recovery calculation
        BigDecimal advanceRate = contract.getAdvancePaymentRate() != null ? contract.getAdvancePaymentRate() : BigDecimal.ZERO;
        BigDecimal advanceDeduction = grossAmount.multiply(advanceRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        // Retention money calculation (FIDIC standard 5%)
        BigDecimal retentionRate = contract.getRetentionRate() != null ? contract.getRetentionRate() : new BigDecimal("5.00");
        BigDecimal retentionDeduction = grossAmount.multiply(retentionRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        BigDecimal actualBackcharges = backcharges != null ? backcharges : BigDecimal.ZERO;

        // VAT calculation (e.g., 8% or 10%)
        BigDecimal vatRate = taxRate != null ? taxRate : new BigDecimal("8.00");
        BigDecimal taxableBase = grossAmount.subtract(advanceDeduction);
        BigDecimal taxAmount = taxableBase.compareTo(BigDecimal.ZERO) > 0
                ? taxableBase.multiply(vatRate).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Net payable amount
        BigDecimal netPayable = grossAmount
                .subtract(advanceDeduction)
                .subtract(retentionDeduction)
                .subtract(actualBackcharges)
                .add(taxAmount);

        String certNumber = String.format("PPC-%s-P%02d", contract.getContractNumber(), periodNumber);

        PaymentCertificate ppc = PaymentCertificate.builder()
                .certificateNumber(certNumber)
                .subcontract(contract)
                .periodNumber(periodNumber)
                .billingStartDate(startDate)
                .billingEndDate(endDate)
                .grossAmount(grossAmount)
                .cumulativeGrossAmount(cumulativeGross)
                .advanceDeduction(advanceDeduction)
                .retentionDeduction(retentionDeduction)
                .backchargesDeduction(actualBackcharges)
                .taxAmount(taxAmount)
                .netPayableAmount(netPayable)
                .status("SUBMITTED")
                .createdAt(ZonedDateTime.now())
                .updatedAt(ZonedDateTime.now())
                .build();

        // Update accumulated retention in subcontract
        BigDecimal currentRetention = contract.getRetentionAccumulated() != null ? contract.getRetentionAccumulated() : BigDecimal.ZERO;
        contract.setRetentionAccumulated(currentRetention.add(retentionDeduction));
        subcontractRepository.save(contract);

        log.info("Generated PPC {}: Gross={}, NetPayable={}, Retention={}", certNumber, grossAmount, netPayable, retentionDeduction);
        return paymentCertificateRepository.save(ppc);
    }

    @Transactional
    public PaymentCertificate approvePpc(Long certificateId) {
        PaymentCertificate ppc = paymentCertificateRepository.findById(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + certificateId));

        ppc.setStatus("APPROVED");
        ppc.setApprovedAt(ZonedDateTime.now());
        ppc.setUpdatedAt(ZonedDateTime.now());

        log.info("Approved PPC {}", ppc.getCertificateNumber());
        return paymentCertificateRepository.save(ppc);
    }
}
