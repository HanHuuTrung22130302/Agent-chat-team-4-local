package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.winsteel.model.NestingPlan;
import com.anhduongbuilding.erp.winsteel.model.SteelComponent;
import com.anhduongbuilding.erp.winsteel.model.SteelOrder;
import com.anhduongbuilding.erp.winsteel.repository.NestingPlanRepository;
import com.anhduongbuilding.erp.winsteel.repository.SteelComponentRepository;
import com.anhduongbuilding.erp.winsteel.repository.SteelOrderRepository;
import com.anhduongbuilding.erp.winsteel.service.WinSteelService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WinSteelNestingTest {

    @Mock
    private SteelOrderRepository steelOrderRepository;

    @Mock
    private SteelComponentRepository steelComponentRepository;

    @Mock
    private NestingPlanRepository nestingPlanRepository;

    @InjectMocks
    private WinSteelService winSteelService;

    private SteelOrder steelOrder;

    @BeforeEach
    void setUp() {
        steelOrder = SteelOrder.builder()
                .id(1L)
                .orderNumber("WS-2026-004")
                .totalTonnage(new BigDecimal("1250.000"))
                .build();
    }

    @Test
    @DisplayName("Kiểm thử Tối ưu Cắt Phôi Nesting: Tỷ lệ thép vụn 2.45% (<= 3.0%) -> Tự động Duyệt kế hoạch")
    void testNestingPlanApprovedWhenScrapUnderThreshold() {
        when(steelOrderRepository.findById(1L)).thenReturn(Optional.of(steelOrder));
        when(nestingPlanRepository.save(any(NestingPlan.class))).thenAnswer(i -> i.getArgument(0));

        // Khổ thép tấm: 10,000 kg; Thép thành phẩm tận dụng: 9,755 kg -> Thép vụn: 245 kg (2.45%)
        BigDecimal rawPlate = new BigDecimal("10000.00");
        BigDecimal utilized = new BigDecimal("9755.00");

        NestingPlan plan = winSteelService.evaluateAndSaveNestingPlan(1L, "Thép Posco SS400 2000x12000x12mm", rawPlate, utilized);

        assertNotNull(plan);
        assertEquals(new BigDecimal("2.45"), plan.getScrapRate());
        assertTrue(plan.getIsApproved(), "Tỷ lệ vụn 2.45% phải được duyệt");
        assertNull(plan.getRejectionReason());
    }

    @Test
    @DisplayName("Kiểm thử Tối ưu Cắt Phôi Nesting: Tỷ lệ thép vụn 4.80% (> 3.0%) -> Khóa Từ chối Phê duyệt")
    void testNestingPlanRejectedWhenScrapExceedsThreshold() {
        when(steelOrderRepository.findById(1L)).thenReturn(Optional.of(steelOrder));
        when(nestingPlanRepository.save(any(NestingPlan.class))).thenAnswer(i -> i.getArgument(0));

        // Khổ thép tấm: 10,000 kg; Thép thành phẩm: 9,520 kg -> Thép vụn: 480 kg (4.80%)
        BigDecimal rawPlate = new BigDecimal("10000.00");
        BigDecimal utilized = new BigDecimal("9520.00");

        NestingPlan plan = winSteelService.evaluateAndSaveNestingPlan(1L, "Thép Posco SS400 2000x12000x12mm", rawPlate, utilized);

        assertNotNull(plan);
        assertEquals(new BigDecimal("4.80"), plan.getScrapRate());
        assertFalse(plan.getIsApproved(), "Tỷ lệ vụn 4.80% phải bị từ chối");
        assertTrue(plan.getRejectionReason().contains("REJECTED_OVER_SCRAP"));
    }

    @Test
    @DisplayName("Kiểm thử Quét mã QR Lắp dựng Cấu kiện: Cập nhật ERECTED & Thời gian thực")
    void testErectComponentByQrCode() {
        SteelComponent comp = SteelComponent.builder()
                .id(101L)
                .componentMark("C1-1")
                .componentType("COLUMN")
                .qrCodeUid("ADB-WS-P01-C1-001")
                .gridLocation("Trục 1-A")
                .weightKg(new BigDecimal("1250.00"))
                .erectionStatus("PENDING")
                .build();

        when(steelComponentRepository.findByQrCodeUid("ADB-WS-P01-C1-001")).thenReturn(Optional.of(comp));
        when(steelComponentRepository.save(any(SteelComponent.class))).thenAnswer(i -> i.getArgument(0));

        SteelComponent erected = winSteelService.erectComponentByQrCode("ADB-WS-P01-C1-001", "Kỹ sư Trưởng Nguyễn Văn An");

        assertNotNull(erected);
        assertEquals("ERECTED", erected.getErectionStatus());
        assertEquals("ON_SITE", erected.getShippingStatus());
        assertNotNull(erected.getErectedAt());
        assertEquals("Kỹ sư Trưởng Nguyễn Văn An", erected.getErectedBy());
    }
}
