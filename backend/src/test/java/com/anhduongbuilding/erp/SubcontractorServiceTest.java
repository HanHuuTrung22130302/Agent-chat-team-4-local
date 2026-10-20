package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.subcontractor.model.PaymentCertificate;
import com.anhduongbuilding.erp.subcontractor.model.Subcontract;
import com.anhduongbuilding.erp.subcontractor.model.Subcontractor;
import com.anhduongbuilding.erp.subcontractor.repository.PaymentCertificateRepository;
import com.anhduongbuilding.erp.subcontractor.repository.SubcontractItemRepository;
import com.anhduongbuilding.erp.subcontractor.repository.SubcontractRepository;
import com.anhduongbuilding.erp.subcontractor.repository.SubcontractorRepository;
import com.anhduongbuilding.erp.subcontractor.service.SubcontractorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SubcontractorServiceTest {

    @Mock
    private SubcontractorRepository subcontractorRepository;

    @Mock
    private SubcontractRepository subcontractRepository;

    @Mock
    private SubcontractItemRepository subcontractItemRepository;

    @Mock
    private PaymentCertificateRepository paymentCertificateRepository;

    @InjectMocks
    private SubcontractorService subcontractorService;

    private Subcontract sampleSubcontract;

    @BeforeEach
    void setUp() {
        Project project = Project.builder()
                .id(1L)
                .code("DA-ADB-2026-001")
                .name("Nhà máy Cơ khí Ánh Dương")
                .build();

        Subcontractor sub = Subcontractor.builder()
                .id(1L)
                .code("SUB-STEEL-001")
                .name("Công ty CP Cơ khí Việt Thép")
                .taxCode("0301234567")
                .build();

        sampleSubcontract = Subcontract.builder()
                .id(10L)
                .contractNumber("HĐGK-ADB-2026/04-ST")
                .project(project)
                .subcontractor(sub)
                .title("Giao khoán Gia công & Lắp dựng Kết cấu Thép")
                .totalValue(new BigDecimal("1000000000.00")) // 1 tỷ VND
                .advancePaymentRate(new BigDecimal("10.00")) // 10%
                .advancePaymentAmount(new BigDecimal("100000000.00"))
                .retentionRate(new BigDecimal("5.00")) // 5%
                .retentionAccumulated(BigDecimal.ZERO)
                .status("EXECUTING")
                .build();
    }

    @Test
    @DisplayName("Should accurately calculate FIDIC Progress Payment Certificate deductions (Advance, Retention 5%, Backcharges, Net Payable)")
    void testGeneratePpc_FIDIC_Calculations() {
        // Arrange
        when(subcontractRepository.findById(10L)).thenReturn(Optional.of(sampleSubcontract));
        when(paymentCertificateRepository.findTopBySubcontractIdOrderByPeriodNumberDesc(10L)).thenReturn(Optional.empty());
        when(paymentCertificateRepository.save(any(PaymentCertificate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BigDecimal grossAmount = new BigDecimal("200000000.00"); // 200M VND
        BigDecimal backcharges = new BigDecimal("5000000.00");   // 5M VND
        BigDecimal taxRate = new BigDecimal("8.00");             // 8% VAT

        // Act
        PaymentCertificate ppc = subcontractorService.generatePpc(
                10L,
                LocalDate.of(2026, 4, 1),
                LocalDate.of(2026, 4, 30),
                grossAmount,
                backcharges,
                taxRate
        );

        // Assert
        assertNotNull(ppc);
        assertEquals(1, ppc.getPeriodNumber());
        assertEquals("PPC-HĐGK-ADB-2026/04-ST-P01", ppc.getCertificateNumber());

        // 10% advance deduction on 200M = 20M
        assertEquals(new BigDecimal("20000000.00"), ppc.getAdvanceDeduction());

        // 5% retention deduction on 200M = 10M
        assertEquals(new BigDecimal("10000000.00"), ppc.getRetentionDeduction());

        // Taxable base = 200M - 20M = 180M * 8% = 14.4M
        assertEquals(new BigDecimal("14400000.00"), ppc.getTaxAmount());

        // Net Payable = 200M - 20M - 10M - 5M + 14.4M = 179,400,000 VND
        assertEquals(new BigDecimal("179400000.00"), ppc.getNetPayableAmount());

        // Verify accumulated retention was updated in subcontract
        assertEquals(new BigDecimal("10000000.00"), sampleSubcontract.getRetentionAccumulated());
        verify(subcontractRepository, times(1)).save(sampleSubcontract);
    }

    @Test
    @DisplayName("Should approve PPC and transition status to APPROVED")
    void testApprovePpc() {
        // Arrange
        PaymentCertificate ppc = PaymentCertificate.builder()
                .id(100L)
                .certificateNumber("PPC-HĐGK-ADB-2026/04-ST-P01")
                .status("SUBMITTED")
                .build();

        when(paymentCertificateRepository.findById(100L)).thenReturn(Optional.of(ppc));
        when(paymentCertificateRepository.save(any(PaymentCertificate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PaymentCertificate approved = subcontractorService.approvePpc(100L);

        // Assert
        assertEquals("APPROVED", approved.getStatus());
        assertNotNull(approved.getApprovedAt());
    }
}
