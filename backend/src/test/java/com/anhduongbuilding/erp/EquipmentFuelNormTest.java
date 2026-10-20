package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.equipment.model.Equipment;
import com.anhduongbuilding.erp.equipment.model.FuelNormAnalysisResult;
import com.anhduongbuilding.erp.equipment.service.EquipmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EquipmentFuelNormTest {

    @InjectMocks
    private EquipmentService equipmentService;

    private Equipment crane;
    private Equipment excavator;

    @BeforeEach
    void setUp() {
        // Cần cẩu 50T định mức 18.5 lít dầu / giờ chạy
        crane = Equipment.builder()
                .id(1L)
                .code("EQ-CRANE-50T-01")
                .name("Cần cẩu bánh xích Hitachi KH180-3 50T")
                .category("CRANE")
                .standardFuelNorm(new BigDecimal("18.50"))
                .safetyInspectionExpiry(LocalDate.now().plusDays(20)) // Sắp hết hạn kiểm định trong 20 ngày
                .build();

        // Máy xúc Komatsu định mức 15.0 lít dầu / giờ chạy
        excavator = Equipment.builder()
                .id(2L)
                .code("EQ-EXC-KOMATSU-01")
                .name("Máy xúc đào bánh xích Komatsu PC200-8")
                .category("EXCAVATOR")
                .standardFuelNorm(new BigDecimal("15.00"))
                .safetyInspectionExpiry(LocalDate.now().minusDays(5)) // Đã quá hạn kiểm định 5 ngày
                .build();
    }

    @Test
    @DisplayName("Kiểm thử Cẩu tháp: Tiêu hao nhiên liệu thực tế vượt định mức 8% -> Cảnh báo OVER_CONSUMPTION")
    void testFuelVarianceOverConsumption() {
        // Chạy 8 giờ, định mức 18.5L/h -> Kỳ vọng: 148L
        // Thực tế đổ dầu: 160L -> Chênh lệch: (160 - 148) / 148 = +8.11%
        BigDecimal workedHours = new BigDecimal("8.00");
        BigDecimal fuelIssued = new BigDecimal("160.00");

        FuelNormAnalysisResult result = equipmentService.analyzeFuelNorm(crane, workedHours, fuelIssued);

        assertNotNull(result);
        assertEquals(new BigDecimal("148.00"), result.getExpectedFuelLiters());
        assertEquals(new BigDecimal("8.11"), result.getFuelVarianceRate());
        assertEquals("OVER_CONSUMPTION", result.getAlertFlag());
        assertFalse(result.getIsInspectionExpired());
        assertTrue(result.getDaysUntilInspectionExpiry() <= 30);
        assertTrue(result.getAlertMessage().contains("sắp hết hạn kiểm định an toàn"));
    }

    @Test
    @DisplayName("Kiểm thử Máy xúc: Tiêu hao thực tế vượt trần 20% -> Kích hoạt cảnh báo đỏ CRITICAL")
    void testFuelVarianceCriticalOverConsumption() {
        // Chạy 10 giờ, định mức 15L/h -> Kỳ vọng: 150L
        // Thực tế đổ dầu: 180L -> Chênh lệch: (180 - 150) / 150 = +20.00%
        BigDecimal workedHours = new BigDecimal("10.00");
        BigDecimal fuelIssued = new BigDecimal("180.00");

        FuelNormAnalysisResult result = equipmentService.analyzeFuelNorm(excavator, workedHours, fuelIssued);

        assertNotNull(result);
        assertEquals(new BigDecimal("150.00"), result.getExpectedFuelLiters());
        assertEquals(new BigDecimal("20.00"), result.getFuelVarianceRate());
        assertEquals("CRITICAL", result.getAlertFlag());
        assertTrue(result.getIsInspectionExpired(), "Thiết bị quá hạn kiểm định phải bị gắn cờ");
        assertTrue(result.getAlertMessage().contains("quá hạn kiểm định an toàn"));
    }

    @Test
    @DisplayName("Kiểm thử Tiêu hao nhiên liệu chuẩn định mức Thông tư 12/2021/TT-BXD -> Trạng thái NORMAL")
    void testFuelVarianceNormal() {
        // Chạy 5 giờ, định mức 18.5L/h -> Kỳ vọng: 92.5L
        // Thực tế: 94.0L -> Chênh lệch: (94.0 - 92.5) / 92.5 = +1.62% (dưới 5%)
        BigDecimal workedHours = new BigDecimal("5.00");
        BigDecimal fuelIssued = new BigDecimal("94.00");

        // Gán hạn kiểm định còn xa
        crane.setSafetyInspectionExpiry(LocalDate.now().plusMonths(6));

        FuelNormAnalysisResult result = equipmentService.analyzeFuelNorm(crane, workedHours, fuelIssued);

        assertNotNull(result);
        assertEquals(new BigDecimal("92.50"), result.getExpectedFuelLiters());
        assertEquals(new BigDecimal("1.62"), result.getFuelVarianceRate());
        assertEquals("NORMAL", result.getAlertFlag());
        assertFalse(result.getIsInspectionExpired());
    }
}
