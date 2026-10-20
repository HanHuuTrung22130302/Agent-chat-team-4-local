package com.anhduongbuilding.erp.boq.service;

import com.anhduongbuilding.erp.boq.model.BOQHeader;
import com.anhduongbuilding.erp.boq.model.BOQItem;
import com.anhduongbuilding.erp.boq.model.EVMAnalysis;
import com.anhduongbuilding.erp.boq.repository.BOQHeaderRepository;
import com.anhduongbuilding.erp.boq.repository.BOQItemRepository;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BOQService {

    private final BOQHeaderRepository boqHeaderRepository;
    private final BOQItemRepository boqItemRepository;
    private final ProjectRepository projectRepository;

    public Optional<BOQHeader> getActiveBOQByProject(Long projectId) {
        return boqHeaderRepository.findByProjectIdAndIsActiveTrue(projectId);
    }

    public List<BOQItem> getBOQItems(Long boqHeaderId) {
        return boqItemRepository.findByBoqHeaderId(boqHeaderId);
    }

    @Transactional
    public BOQItem updateItemActuals(Long itemId, BigDecimal actualQuantity, BigDecimal actualCost) {
        BOQItem item = boqItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("BOQ Item not found: " + itemId));
        item.setActualCompletedQuantity(actualQuantity != null ? actualQuantity : BigDecimal.ZERO);
        item.setActualIncurredCost(actualCost != null ? actualCost : BigDecimal.ZERO);
        return boqItemRepository.save(item);
    }

    /**
     * EVM (Earned Value Management) Calculation Engine for D&B Construction
     * PV = BAC * (% Planned Progress / 100)
     * EV = Sum(Actual Completed Quantity * Unit Rate)
     * AC = Sum(Actual Incurred Cost)
     * CV = EV - AC (Dương là tiết kiệm chi phí, Âm là vượt ngân sách)
     * SV = EV - PV (Dương là vượt tiến độ, Âm là chậm tiến độ)
     * CPI = EV / AC (>= 1.0 là hiệu quả, < 1.0 cảnh báo vượt chi phí)
     * SPI = EV / PV (>= 1.0 là đúng hạn, < 1.0 cảnh báo chậm hạn)
     */
    public EVMAnalysis calculateEVM(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        Optional<BOQHeader> headerOpt = boqHeaderRepository.findByProjectIdAndIsActiveTrue(projectId);
        if (headerOpt.isEmpty()) {
            return EVMAnalysis.builder()
                    .projectId(projectId)
                    .projectCode(project.getCode())
                    .projectName(project.getName())
                    .bac(BigDecimal.ZERO)
                    .pv(BigDecimal.ZERO)
                    .ev(BigDecimal.ZERO)
                    .ac(BigDecimal.ZERO)
                    .cv(BigDecimal.ZERO)
                    .sv(BigDecimal.ZERO)
                    .cpi(BigDecimal.ONE)
                    .spi(BigDecimal.ONE)
                    .costHealthStatus("NO_BOQ_DEFINED")
                    .scheduleHealthStatus("NO_BOQ_DEFINED")
                    .build();
        }

        BOQHeader header = headerOpt.get();
        List<BOQItem> items = boqItemRepository.findByBoqHeaderId(header.getId());

        BigDecimal bac = BigDecimal.ZERO;
        BigDecimal ev = BigDecimal.ZERO;
        BigDecimal ac = BigDecimal.ZERO;

        for (BOQItem item : items) {
            bac = bac.add(item.getTotalAmount());
            BigDecimal itemEV = item.getActualCompletedQuantity().multiply(item.getUnitRate());
            ev = ev.add(itemEV);
            ac = ac.add(item.getActualIncurredCost());
        }

        // Planned Value based on project progress percentage
        BigDecimal progressRate = project.getProgressPercentage() != null
                ? project.getProgressPercentage().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal pv = bac.multiply(progressRate).setScale(2, RoundingMode.HALF_UP);

        BigDecimal cv = ev.subtract(ac).setScale(2, RoundingMode.HALF_UP);
        BigDecimal sv = ev.subtract(pv).setScale(2, RoundingMode.HALF_UP);

        BigDecimal cpi = ac.compareTo(BigDecimal.ZERO) > 0
                ? ev.divide(ac, 4, RoundingMode.HALF_UP)
                : BigDecimal.ONE;

        BigDecimal spi = pv.compareTo(BigDecimal.ZERO) > 0
                ? ev.divide(pv, 4, RoundingMode.HALF_UP)
                : BigDecimal.ONE;

        // Forecasts: EAC = BAC / CPI
        BigDecimal eac = cpi.compareTo(BigDecimal.ZERO) > 0
                ? bac.divide(cpi, 2, RoundingMode.HALF_UP)
                : bac;
        BigDecimal vac = bac.subtract(eac).setScale(2, RoundingMode.HALF_UP);

        // Status determinations
        String costStatus = cpi.compareTo(new BigDecimal("1.0")) >= 0 ? "ON_BUDGET"
                : (cpi.compareTo(new BigDecimal("0.90")) >= 0 ? "OVER_BUDGET_WARNING" : "OVER_BUDGET_CRITICAL");

        String schedStatus = spi.compareTo(new BigDecimal("1.0")) >= 0 ? "ON_SCHEDULE"
                : (spi.compareTo(new BigDecimal("0.90")) >= 0 ? "BEHIND_SCHEDULE_WARNING" : "DELAYED");

        log.info("Project {} EVM: BAC={}, EV={}, AC={}, CPI={}, SPI={}", project.getCode(), bac, ev, ac, cpi, spi);

        return EVMAnalysis.builder()
                .projectId(projectId)
                .projectCode(project.getCode())
                .projectName(project.getName())
                .bac(bac)
                .pv(pv)
                .ev(ev)
                .ac(ac)
                .cv(cv)
                .sv(sv)
                .cpi(cpi)
                .spi(spi)
                .eac(eac)
                .vac(vac)
                .costHealthStatus(costStatus)
                .scheduleHealthStatus(schedStatus)
                .build();
    }
}
