package com.anhduongbuilding.erp.boq.controller;

import com.anhduongbuilding.erp.boq.model.BOQHeader;
import com.anhduongbuilding.erp.boq.model.BOQItem;
import com.anhduongbuilding.erp.boq.model.EVMAnalysis;
import com.anhduongbuilding.erp.boq.service.BOQService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/boq")
@RequiredArgsConstructor
@Tag(name = "BOQ & Job Costing (EVM)", description = "Bóc tách Dự toán BOQ, Đơn giá Định mức & Phân tích EVM")
public class BOQController {

    private final BOQService boqService;

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Lấy dự toán BOQ đang áp dụng của dự án")
    public ResponseEntity<BOQHeader> getActiveBOQ(@PathVariable Long projectId) {
        return boqService.getActiveBOQByProject(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/header/{boqHeaderId}/items")
    @Operation(summary = "Danh sách chi tiết các hạng mục trong bảng dự toán BOQ")
    public ResponseEntity<List<BOQItem>> getBOQItems(@PathVariable Long boqHeaderId) {
        return ResponseEntity.ok(boqService.getBOQItems(boqHeaderId));
    }

    @GetMapping("/project/{projectId}/evm")
    @Operation(summary = "Phân tích giá trị làm ra EVM (Earned Value Management: PV, EV, AC, CPI, SPI)")
    public ResponseEntity<EVMAnalysis> getEVMAnalysis(@PathVariable Long projectId) {
        return ResponseEntity.ok(boqService.calculateEVM(projectId));
    }

    @PutMapping("/items/{itemId}/actuals")
    @Operation(summary = "Cập nhật khối lượng hoàn thành thực tế và chi phí thực tế phát sinh")
    public ResponseEntity<BOQItem> updateItemActuals(
            @PathVariable Long itemId,
            @RequestBody UpdateActualsRequest request) {
        return ResponseEntity.ok(boqService.updateItemActuals(
                itemId,
                request.getActualQuantity(),
                request.getActualCost()
        ));
    }

    @Data
    public static class UpdateActualsRequest {
        private BigDecimal actualQuantity;
        private BigDecimal actualCost;
    }
}
