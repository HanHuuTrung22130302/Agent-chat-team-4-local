package com.anhduongbuilding.erp.project.controller;

import com.anhduongbuilding.erp.project.model.DailySiteDiary;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.model.WBSItem;
import com.anhduongbuilding.erp.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "Quản lý Dự án, Tiến độ WBS & Nhật ký Công trường")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Danh sách tất cả dự án xây dựng")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết một dự án theo ID")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @Operation(summary = "Khởi tạo dự án mới (Project Charter)")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.createProject(project));
    }

    @GetMapping("/{id}/wbs")
    @Operation(summary = "Cây cấu trúc phân chia công việc (WBS Tree)")
    public ResponseEntity<List<WBSItem>> getProjectWBSTree(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectWBSTree(id));
    }

    @PutMapping("/{id}/wbs/{wbsId}/progress")
    @Operation(summary = "Cập nhật % tiến độ WBS và tự động tính lại tiến độ toàn dự án")
    public ResponseEntity<WBSItem> updateWBSProgress(
            @PathVariable Long id,
            @PathVariable Long wbsId,
            @RequestBody Map<String, BigDecimal> payload) {
        BigDecimal progress = payload.getOrDefault("progressPercentage", BigDecimal.ZERO);
        return ResponseEntity.ok(projectService.updateWBSProgress(wbsId, progress));
    }

    @GetMapping("/{id}/site-diaries")
    @Operation(summary = "Danh sách nhật ký thi công điện tử theo Nghị định 06/2021/NĐ-CP")
    public ResponseEntity<List<DailySiteDiary>> getSiteDiaries(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getSiteDiaries(id));
    }

    @PostMapping("/{id}/site-diaries")
    @Operation(summary = "Ghi nhật ký thi công ngày mới")
    public ResponseEntity<DailySiteDiary> createSiteDiary(
            @PathVariable Long id,
            @RequestBody DailySiteDiary diary) {
        diary.setProjectId(id);
        return ResponseEntity.ok(projectService.createSiteDiary(diary));
    }
}
