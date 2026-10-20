package com.anhduongbuilding.erp.subcontractor.controller;

import com.anhduongbuilding.erp.subcontractor.model.Subcontract;
import com.anhduongbuilding.erp.subcontractor.model.Subcontractor;
import com.anhduongbuilding.erp.subcontractor.service.SubcontractorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subcontractors")
@RequiredArgsConstructor
@Tag(name = "Subcontractor Management", description = "Quản lý Hồ sơ Nhà thầu phụ & Hợp đồng Giao khoán")
public class SubcontractorController {

    private final SubcontractorService subcontractorService;

    @GetMapping
    @Operation(summary = "Danh sách hồ sơ nhà thầu phụ")
    public ResponseEntity<List<Subcontractor>> getAllSubcontractors() {
        return ResponseEntity.ok(subcontractorService.getAllSubcontractors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết hồ sơ thầu phụ theo ID")
    public ResponseEntity<Subcontractor> getSubcontractorById(@PathVariable Long id) {
        return subcontractorService.getSubcontractorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Tạo mới hoặc bổ sung hồ sơ thầu phụ")
    public ResponseEntity<Subcontractor> createSubcontractor(@RequestBody Subcontractor subcontractor) {
        return ResponseEntity.ok(subcontractorService.createSubcontractor(subcontractor));
    }

    @GetMapping("/project/{projectId}/contracts")
    @Operation(summary = "Danh sách hợp đồng giao khoán theo dự án")
    public ResponseEntity<List<Subcontract>> getSubcontractsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(subcontractorService.getSubcontractsByProject(projectId));
    }

    @PostMapping("/contracts")
    @Operation(summary = "Ký kết hợp đồng giao khoán mới")
    public ResponseEntity<Subcontract> createSubcontract(@RequestBody Subcontract subcontract) {
        return ResponseEntity.ok(subcontractorService.createSubcontract(subcontract));
    }
}
