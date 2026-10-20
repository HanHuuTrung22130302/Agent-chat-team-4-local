package com.anhduongbuilding.erp.inventory.controller;

import com.anhduongbuilding.erp.inventory.model.*;
import com.anhduongbuilding.erp.inventory.service.InventoryService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/materials")
    public ResponseEntity<List<Material>> getAllMaterials() {
        return ResponseEntity.ok(inventoryService.getAllMaterials());
    }

    @GetMapping("/inventory/stock/{projectId}")
    public ResponseEntity<List<StockBalance>> getStockBalances(@PathVariable Long projectId) {
        return ResponseEntity.ok(inventoryService.getStockBalances(projectId));
    }

    @PostMapping("/inventory/purchase-orders")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @RequestParam Long projectId,
            @RequestBody PurchaseOrder po) {
        return ResponseEntity.ok(inventoryService.createPurchaseOrder(po, projectId));
    }

    @PostMapping("/inventory/grn")
    public ResponseEntity<GoodsReceiptNote> createGoodsReceipt(
            @RequestParam Long projectId,
            @RequestBody GoodsReceiptNote grn) {
        return ResponseEntity.ok(inventoryService.createGoodsReceipt(grn, projectId));
    }

    @PostMapping("/inventory/gin")
    public ResponseEntity<GoodsIssueNote> createGoodsIssue(
            @RequestParam Long projectId,
            @RequestBody GoodsIssueNote gin) {
        return ResponseEntity.ok(inventoryService.createGoodsIssue(gin, projectId));
    }

    @PostMapping("/inventory/reconcile-norm")
    public ResponseEntity<NormReconciliationResult> reconcileNorm(@RequestBody ReconcileNormRequest request) {
        NormReconciliationResult result = inventoryService.reconcileNorm(
                request.getMaterialCode(),
                request.getTotalIssuedQuantity(),
                request.getBoqDesignedQuantity()
        );
        return ResponseEntity.ok(result);
    }

    @Getter
    @Setter
    public static class ReconcileNormRequest {
        private String materialCode;
        private BigDecimal totalIssuedQuantity;
        private BigDecimal boqDesignedQuantity;
    }
}
