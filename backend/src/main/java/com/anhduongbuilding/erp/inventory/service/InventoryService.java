package com.anhduongbuilding.erp.inventory.service;

import com.anhduongbuilding.erp.inventory.model.*;
import com.anhduongbuilding.erp.inventory.repository.*;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final MaterialRepository materialRepository;
    private final StockBalanceRepository stockBalanceRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final GoodsReceiptNoteRepository goodsReceiptNoteRepository;
    private final GoodsIssueNoteRepository goodsIssueNoteRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<StockBalance> getStockBalances(Long projectId) {
        return stockBalanceRepository.findByProjectId(projectId);
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder po, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));
        po.setProject(project);

        if (po.getItems() != null) {
            BigDecimal total = BigDecimal.ZERO;
            for (PurchaseOrderItem item : po.getItems()) {
                item.setPurchaseOrder(po);
                if (item.getQuantity() != null && item.getUnitPrice() != null) {
                    BigDecimal itemTotal = item.getQuantity().multiply(item.getUnitPrice());
                    item.setTotalPrice(itemTotal);
                    total = total.add(itemTotal);
                }
            }
            po.setTotalAmount(total);
        }
        return purchaseOrderRepository.save(po);
    }

    @Transactional
    public GoodsReceiptNote createGoodsReceipt(GoodsReceiptNote grn, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));
        grn.setProject(project);

        GoodsReceiptNote saved = goodsReceiptNoteRepository.save(grn);

        // Update Stock Balance
        if (saved.getItems() != null) {
            for (GoodsReceiptItem item : saved.getItems()) {
                Material mat = item.getMaterial();
                StockBalance balance = stockBalanceRepository
                        .findByProjectIdAndMaterialId(projectId, mat.getId())
                        .orElse(StockBalance.builder()
                                .project(project)
                                .material(mat)
                                .currentQuantity(BigDecimal.ZERO)
                                .build());

                balance.setCurrentQuantity(balance.getCurrentQuantity().add(item.getQuantity()));
                stockBalanceRepository.save(balance);
            }
        }
        return saved;
    }

    @Transactional
    public GoodsIssueNote createGoodsIssue(GoodsIssueNote gin, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));
        gin.setProject(project);

        GoodsIssueNote saved = goodsIssueNoteRepository.save(gin);

        // Update Stock Balance and check non-negative
        if (saved.getItems() != null) {
            for (GoodsIssueItem item : saved.getItems()) {
                Material mat = item.getMaterial();
                StockBalance balance = stockBalanceRepository
                        .findByProjectIdAndMaterialId(projectId, mat.getId())
                        .orElseThrow(() -> new IllegalStateException("Không có dữ liệu tồn kho cho vật tư: " + mat.getName()));

                if (balance.getCurrentQuantity().compareTo(item.getQuantity()) < 0) {
                    log.warn("Cảnh báo: Xuất kho vượt quá số lượng tồn kho khả dụng! Mã vật tư: {}", mat.getCode());
                }

                balance.setCurrentQuantity(balance.getCurrentQuantity().subtract(item.getQuantity()));
                stockBalanceRepository.save(balance);
            }
        }
        return saved;
    }

    /**
     * Đối soát hao hụt vật tư theo Thông tư 12/2021/TT-BXD
     * Hao hụt thực tế = ((Tổng xuất GIN - Khối lượng thiết kế BOQ) / Khối lượng thiết kế BOQ) * 100%
     */
    public NormReconciliationResult reconcileNorm(String materialCode, BigDecimal totalIssuedQuantity, BigDecimal boqDesignedQuantity) {
        Material material = materialRepository.findByCode(materialCode)
                .orElseThrow(() -> new IllegalArgumentException("Material not found with code: " + materialCode));

        if (boqDesignedQuantity == null || boqDesignedQuantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Khối lượng thiết kế BOQ phải lớn hơn 0");
        }

        BigDecimal varianceQuantity = totalIssuedQuantity.subtract(boqDesignedQuantity);
        BigDecimal actualWasteRate = varianceQuantity
                .divide(boqDesignedQuantity, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal standardRate = material.getStandardNormRate() != null ? material.getStandardNormRate() : BigDecimal.ZERO;
        boolean isOverNorm = actualWasteRate.compareTo(standardRate) > 0;

        String alertLevel = isOverNorm ? "CRITICAL_OVER_NORM" : "NORMAL";
        String statusMessage = isOverNorm
                ? String.format("CẢNH BÁO ĐỎ: Tỷ lệ hao hụt thực tế (%s%%) vượt trần định mức Thông tư 12/2021/TT-BXD (%s%%) của vật tư %s!",
                        actualWasteRate, standardRate, material.getName())
                : String.format("Hao hụt thực tế (%s%%) nằm trong ngưỡng định mức cho phép (%s%%).",
                        actualWasteRate, standardRate);

        return NormReconciliationResult.builder()
                .materialCode(material.getCode())
                .materialName(material.getName())
                .category(material.getCategory())
                .unit(material.getUnit())
                .totalIssuedQuantity(totalIssuedQuantity)
                .boqDesignedQuantity(boqDesignedQuantity)
                .varianceQuantity(varianceQuantity)
                .actualWasteRate(actualWasteRate)
                .standardNormRate(standardRate)
                .isOverNorm(isOverNorm)
                .alertLevel(alertLevel)
                .statusMessage(statusMessage)
                .build();
    }
}
