package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.inventory.model.Material;
import com.anhduongbuilding.erp.inventory.model.NormReconciliationResult;
import com.anhduongbuilding.erp.inventory.repository.MaterialRepository;
import com.anhduongbuilding.erp.inventory.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MaterialNormReconciliationTest {

    @Mock
    private MaterialRepository materialRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Material steel;
    private Material concrete;
    private Material sand;

    @BeforeEach
    void setUp() {
        steel = Material.builder()
                .id(1L)
                .code("MAT-STEEL-CB400")
                .name("Thép Hòa Phát CB400")
                .category("STEEL")
                .unit("TẤN")
                .standardNormRate(new BigDecimal("2.50"))
                .build();

        concrete = Material.builder()
                .id(2L)
                .code("MAT-CONC-M300")
                .name("Bê tông tươi M300")
                .category("CONCRETE")
                .unit("M3")
                .standardNormRate(new BigDecimal("1.50"))
                .build();

        sand = Material.builder()
                .id(3L)
                .code("MAT-SAND-GOLD")
                .name("Cát vàng hạt to")
                .category("AGGREGATES")
                .unit("M3")
                .standardNormRate(new BigDecimal("3.00"))
                .build();
    }

    @Test
    @DisplayName("Kiểm thử Thép: Hao hụt thực tế 3.2% vượt định mức TT12 (2.5%) -> Kích hoạt cảnh báo đỏ")
    void testSteelWasteRateExceedsNorm() {
        when(materialRepository.findByCode("MAT-STEEL-CB400")).thenReturn(Optional.of(steel));

        // Thiết kế BOQ: 100 tấn thép; Xuất thực tế: 103.2 tấn (Hao hụt 3.2%)
        BigDecimal boqDesigned = new BigDecimal("100.000");
        BigDecimal totalIssued = new BigDecimal("103.200");

        NormReconciliationResult result = inventoryService.reconcileNorm("MAT-STEEL-CB400", totalIssued, boqDesigned);

        assertNotNull(result);
        assertEquals(new BigDecimal("3.20"), result.getActualWasteRate());
        assertEquals(new BigDecimal("2.50"), result.getStandardNormRate());
        assertTrue(result.getIsOverNorm(), "Hao hụt thép 3.2% phải vượt trần 2.5%");
        assertEquals("CRITICAL_OVER_NORM", result.getAlertLevel());
        assertTrue(result.getStatusMessage().contains("CẢNH BÁO ĐỎ"));
    }

    @Test
    @DisplayName("Kiểm thử Bê tông: Hao hụt thực tế 1.2% nằm trong định mức TT12 (1.5%) -> Đạt chuẩn")
    void testConcreteWasteRateWithinNorm() {
        when(materialRepository.findByCode("MAT-CONC-M300")).thenReturn(Optional.of(concrete));

        // Thiết kế BOQ: 500 m3; Xuất thực tế: 506 m3 (Hao hụt 1.2%)
        BigDecimal boqDesigned = new BigDecimal("500.000");
        BigDecimal totalIssued = new BigDecimal("506.000");

        NormReconciliationResult result = inventoryService.reconcileNorm("MAT-CONC-M300", totalIssued, boqDesigned);

        assertNotNull(result);
        assertEquals(new BigDecimal("1.20"), result.getActualWasteRate());
        assertEquals(new BigDecimal("1.50"), result.getStandardNormRate());
        assertFalse(result.getIsOverNorm(), "Hao hụt 1.2% không vượt định mức 1.5%");
        assertEquals("NORMAL", result.getAlertLevel());
    }

    @Test
    @DisplayName("Kiểm thử Cát đá xây dựng: Hao hụt thực tế 4.5% vượt trần TT12 (3.0%) -> Cảnh báo thất thoát")
    void testAggregatesWasteRateExceedsNorm() {
        when(materialRepository.findByCode("MAT-SAND-GOLD")).thenReturn(Optional.of(sand));

        // Thiết kế BOQ: 200 m3; Xuất thực tế: 209 m3 (Hao hụt 4.5%)
        BigDecimal boqDesigned = new BigDecimal("200.000");
        BigDecimal totalIssued = new BigDecimal("209.000");

        NormReconciliationResult result = inventoryService.reconcileNorm("MAT-SAND-GOLD", totalIssued, boqDesigned);

        assertNotNull(result);
        assertEquals(new BigDecimal("4.50"), result.getActualWasteRate());
        assertTrue(result.getIsOverNorm());
        assertEquals("CRITICAL_OVER_NORM", result.getAlertLevel());
    }

    @Test
    @DisplayName("Kiểm thử Ngoại lệ khi khối lượng thiết kế BOQ <= 0")
    void testInvalidBoqDesignedQuantity() {
        assertThrows(IllegalArgumentException.class, () -> {
            when(materialRepository.findByCode("MAT-STEEL-CB400")).thenReturn(Optional.of(steel));
            inventoryService.reconcileNorm("MAT-STEEL-CB400", new BigDecimal("10"), BigDecimal.ZERO);
        });
    }
}
