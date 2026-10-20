package com.anhduongbuilding.erp.winsteel.service;

import com.anhduongbuilding.erp.winsteel.model.NestingPlan;
import com.anhduongbuilding.erp.winsteel.model.SteelComponent;
import com.anhduongbuilding.erp.winsteel.model.SteelOrder;
import com.anhduongbuilding.erp.winsteel.repository.NestingPlanRepository;
import com.anhduongbuilding.erp.winsteel.repository.SteelComponentRepository;
import com.anhduongbuilding.erp.winsteel.repository.SteelOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WinSteelService {

    private final SteelOrderRepository steelOrderRepository;
    private final SteelComponentRepository steelComponentRepository;
    private final NestingPlanRepository nestingPlanRepository;

    @Transactional(readOnly = true)
    public List<SteelOrder> getOrdersByProject(Long projectId) {
        return steelOrderRepository.findByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public List<SteelComponent> getComponentsByOrder(Long orderId) {
        return steelComponentRepository.findBySteelOrderId(orderId);
    }

    @Transactional
    public NestingPlan evaluateAndSaveNestingPlan(
            Long steelOrderId,
            String rawPlateSpecs,
            BigDecimal rawPlateWeightKg,
            BigDecimal utilizedWeightKg) {

        SteelOrder order = steelOrderRepository.findById(steelOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Steel Order not found with id: " + steelOrderId));

        if (utilizedWeightKg.compareTo(rawPlateWeightKg) > 0) {
            throw new IllegalArgumentException("Khối lượng thép thành phẩm không thể lớn hơn khối lượng phôi thép ban đầu!");
        }

        BigDecimal scrapWeight = rawPlateWeightKg.subtract(utilizedWeightKg);
        BigDecimal scrapRate = scrapWeight.divide(rawPlateWeightKg, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);

        boolean isApproved = scrapRate.compareTo(BigDecimal.valueOf(3.00)) <= 0;
        String rejectionReason = isApproved
                ? null
                : String.format("REJECTED_OVER_SCRAP: Tỷ lệ thép vụn phế liệu (%s%%) vượt ngưỡng cho phép 3.00%%!", scrapRate);

        String planCode = "NP-" + System.currentTimeMillis() % 100000;

        NestingPlan plan = NestingPlan.builder()
                .planCode(planCode)
                .steelOrder(order)
                .rawPlateSpecs(rawPlateSpecs)
                .rawPlateWeightKg(rawPlateWeightKg)
                .utilizedWeightKg(utilizedWeightKg)
                .scrapWeightKg(scrapWeight)
                .scrapRate(scrapRate)
                .isApproved(isApproved)
                .rejectionReason(rejectionReason)
                .build();

        return nestingPlanRepository.save(plan);
    }

    @Transactional
    public SteelComponent erectComponentByQrCode(String qrCodeUid, String erectedBy) {
        SteelComponent component = steelComponentRepository.findByQrCodeUid(qrCodeUid)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cấu kiện với mã QR: " + qrCodeUid));

        component.setErectionStatus("ERECTED");
        component.setErectedAt(OffsetDateTime.now());
        component.setErectedBy(erectedBy);
        component.setShippingStatus("ON_SITE");

        log.info("Cấu kiện {} (Mã QR: {}) đã được cẩu lắp dựng thành công tại trục {} bởi {}",
                component.getComponentMark(), qrCodeUid, component.getGridLocation(), erectedBy);

        return steelComponentRepository.save(component);
    }
}
