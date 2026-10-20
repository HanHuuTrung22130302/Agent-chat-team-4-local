package com.anhduongbuilding.erp.subcontractor.controller;

import com.anhduongbuilding.erp.subcontractor.model.PaymentCertificate;
import com.anhduongbuilding.erp.subcontractor.service.SubcontractorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payment-certificates")
@RequiredArgsConstructor
@Tag(name = "FIDIC Payment Certificates (PPC)", description = "Nghiệm thu Thanh toán Khối lượng Hoàn thành theo chuẩn FIDIC")
public class PaymentCertificateController {

    private final SubcontractorService subcontractorService;

    @GetMapping("/subcontract/{subcontractId}")
    @Operation(summary = "Lịch sử các chứng chỉ PPC theo hợp đồng giao khoán")
    public ResponseEntity<List<PaymentCertificate>> getCertificatesBySubcontract(@PathVariable Long subcontractId) {
        return ResponseEntity.ok(subcontractorService.getCertificatesBySubcontract(subcontractId));
    }

    @PostMapping("/generate")
    @Operation(summary = "Tạo mới Chứng chỉ Thanh toán Khối lượng (PPC) tự động tính toán")
    public ResponseEntity<PaymentCertificate> generatePpc(@RequestBody GeneratePpcRequest request) {
        PaymentCertificate ppc = subcontractorService.generatePpc(
                request.getSubcontractId(),
                request.getStartDate(),
                request.getEndDate(),
                request.getGrossAmount(),
                request.getBackcharges(),
                request.getTaxRate()
        );
        return ResponseEntity.ok(ppc);
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Chỉ huy trưởng / Ban Giám đốc phê duyệt chứng chỉ PPC")
    public ResponseEntity<PaymentCertificate> approvePpc(@PathVariable Long id) {
        return ResponseEntity.ok(subcontractorService.approvePpc(id));
    }

    @Data
    public static class GeneratePpcRequest {
        private Long subcontractId;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal grossAmount;
        private BigDecimal backcharges;
        private BigDecimal taxRate;
    }
}
