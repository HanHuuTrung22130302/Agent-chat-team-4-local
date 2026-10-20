package com.anhduongbuilding.erp.boq.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EVMAnalysis {
    private Long projectId;
    private String projectCode;
    private String projectName;

    // Core EVM Metrics
    private BigDecimal bac;              // Budget At Completion (Tổng ngân sách dự toán ban đầu)
    private BigDecimal pv;               // Planned Value (Giá trị kế hoạch)
    private BigDecimal ev;               // Earned Value (Giá trị khối lượng thực hiện)
    private BigDecimal ac;               // Actual Cost (Chi phí thực tế đã phát sinh)

    // Variances
    private BigDecimal cv;               // Cost Variance (CV = EV - AC)
    private BigDecimal sv;               // Schedule Variance (SV = EV - PV)

    // Performance Indices
    private BigDecimal cpi;              // Cost Performance Index (CPI = EV / AC)
    private BigDecimal spi;              // Schedule Performance Index (SPI = EV / PV)

    // Forecasts
    private BigDecimal eac;              // Estimate At Completion (EAC = BAC / CPI)
    private BigDecimal vac;              // Variance At Completion (VAC = BAC - EAC)

    // Assessment flags
    private String costHealthStatus;     // ON_BUDGET, OVER_BUDGET_WARNING, OVER_BUDGET_CRITICAL
    private String scheduleHealthStatus; // ON_SCHEDULE, BEHIND_SCHEDULE_WARNING, DELAYED
}
