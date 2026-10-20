package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.boq.model.BOQHeader;
import com.anhduongbuilding.erp.boq.model.BOQItem;
import com.anhduongbuilding.erp.boq.model.EVMAnalysis;
import com.anhduongbuilding.erp.boq.repository.BOQHeaderRepository;
import com.anhduongbuilding.erp.boq.repository.BOQItemRepository;
import com.anhduongbuilding.erp.boq.service.BOQService;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobCostingEVMTest {

    @Mock
    private BOQHeaderRepository boqHeaderRepository;

    @Mock
    private BOQItemRepository boqItemRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private BOQService boqService;

    private Project sampleProject;
    private BOQHeader sampleHeader;
    private List<BOQItem> sampleItems;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L)
                .code("DA-ADB-2026-001")
                .name("Nhà máy Cơ khí Chính xác Ánh Dương")
                .progressPercentage(new BigDecimal("40.00")) // Planned 40% progress
                .build();

        sampleHeader = BOQHeader.builder()
                .id(10L)
                .project(sampleProject)
                .version("V1.0")
                .isActive(true)
                .build();

        // Total BAC = Item 1 (100 * 1,000,000 = 100M) + Item 2 (200 * 500,000 = 100M) = 200M
        BOQItem item1 = BOQItem.builder()
                .id(101L)
                .boqHeader(sampleHeader)
                .itemCode("BOQ-CONC-01")
                .description("Bê tông móng M300")
                .unit("M3")
                .quantity(new BigDecimal("100.0000"))
                .unitRate(new BigDecimal("1000000.00"))
                .totalAmount(new BigDecimal("100000000.00"))
                .actualCompletedQuantity(new BigDecimal("50.0000")) // 50m3 completed -> EV = 50M
                .actualIncurredCost(new BigDecimal("45000000.00"))   // AC = 45M (Under budget)
                .build();

        BOQItem item2 = BOQItem.builder()
                .id(102L)
                .boqHeader(sampleHeader)
                .itemCode("BOQ-STEEL-02")
                .description("Cốt thép móng CB400")
                .unit("KG")
                .quantity(new BigDecimal("200.0000"))
                .unitRate(new BigDecimal("500000.00"))
                .totalAmount(new BigDecimal("100000000.00"))
                .actualCompletedQuantity(new BigDecimal("60.0000")) // 60kg completed -> EV = 30M
                .actualIncurredCost(new BigDecimal("35000000.00"))   // AC = 35M
                .build();

        sampleItems = List.of(item1, item2);
    }

    @Test
    @DisplayName("Should accurately calculate EVM Metrics: BAC, PV, EV, AC, CV, SV, CPI, SPI")
    void testCalculateEVM_Metrics() {
        // Arrange
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(boqHeaderRepository.findByProjectIdAndIsActiveTrue(1L)).thenReturn(Optional.of(sampleHeader));
        when(boqItemRepository.findByBoqHeaderId(10L)).thenReturn(sampleItems);

        // Act
        EVMAnalysis evm = boqService.calculateEVM(1L);

        // Assert
        // BAC = 100M + 100M = 200,000,000
        assertEquals(new BigDecimal("200000000.00"), evm.getBac());

        // Planned Value PV = 200M * 40% = 80,000,000
        assertEquals(new BigDecimal("80000000.00"), evm.getPv());

        // Earned Value EV = 50M + 30M = 80,000,000
        assertEquals(new BigDecimal("80000000.00"), evm.getEv());

        // Actual Cost AC = 45M + 35M = 80,000,000
        assertEquals(new BigDecimal("80000000.00"), evm.getAc());

        // Cost Variance CV = EV - AC = 0
        assertEquals(new BigDecimal("0.00"), evm.getCv());

        // Schedule Variance SV = EV - PV = 0
        assertEquals(new BigDecimal("0.00"), evm.getSv());

        // CPI = 80M / 80M = 1.0000
        assertEquals(new BigDecimal("1.0000"), evm.getCpi());

        // SPI = 80M / 80M = 1.0000
        assertEquals(new BigDecimal("1.0000"), evm.getSpi());

        assertEquals("ON_BUDGET", evm.getCostHealthStatus());
        assertEquals("ON_SCHEDULE", evm.getScheduleHealthStatus());
    }

    @Test
    @DisplayName("Should flag Cost Warning when CPI < 1.0 (Actual Cost exceeds Earned Value)")
    void testCalculateEVM_OverBudgetAlert() {
        // Arrange: Make AC higher
        sampleItems.get(0).setActualIncurredCost(new BigDecimal("60000000.00")); // AC increases
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(boqHeaderRepository.findByProjectIdAndIsActiveTrue(1L)).thenReturn(Optional.of(sampleHeader));
        when(boqItemRepository.findByBoqHeaderId(10L)).thenReturn(sampleItems);

        // Act
        EVMAnalysis evm = boqService.calculateEVM(1L);

        // Assert: EV = 80M, AC = 95M -> CPI < 1.0, CV < 0
        assertTrue(evm.getCpi().compareTo(BigDecimal.ONE) < 0);
        assertTrue(evm.getCv().compareTo(BigDecimal.ZERO) < 0);
        assertNotEquals("ON_BUDGET", evm.getCostHealthStatus());
    }
}
