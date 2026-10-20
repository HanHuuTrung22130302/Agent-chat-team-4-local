package com.anhduongbuilding.erp.inventory.model;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormReconciliationResult {
    private String materialCode;
    private String materialName;
    private String category;
    private String unit;
    private BigDecimal totalIssuedQuantity;
    private BigDecimal boqDesignedQuantity;
    private BigDecimal varianceQuantity;
    private BigDecimal actualWasteRate;     // Tỷ lệ hao hụt thực tế (%)
    private BigDecimal standardNormRate;    // Tỷ lệ định mức Thông tư 12/2021/TT-BXD (%)
    private Boolean isOverNorm;             // Vượt định mức
    private String alertLevel;              // NORMAL, WARNING, CRITICAL_OVER_NORM
    private String statusMessage;           // Thông điệp cảnh báo
}
