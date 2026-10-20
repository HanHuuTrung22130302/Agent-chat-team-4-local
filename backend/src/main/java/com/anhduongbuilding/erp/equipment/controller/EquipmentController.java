package com.anhduongbuilding.erp.equipment.controller;

import com.anhduongbuilding.erp.equipment.model.Equipment;
import com.anhduongbuilding.erp.equipment.model.EquipmentLog;
import com.anhduongbuilding.erp.equipment.service.EquipmentService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Equipment>> getEquipmentsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(equipmentService.getEquipmentsByProject(projectId));
    }

    @GetMapping("/inspections/due")
    public ResponseEntity<List<Equipment>> getExpiringInspections(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(equipmentService.getExpiringInspections(days));
    }

    @PostMapping("/logs")
    public ResponseEntity<EquipmentLog> recordEngineHourAndFuel(@RequestBody EngineHourFuelRequest request) {
        EquipmentLog log = equipmentService.recordEngineHourAndFuel(
                request.getEquipmentId(),
                request.getProjectId(),
                request.getOperatorName(),
                request.getStartHour(),
                request.getEndHour(),
                request.getFuelIssuedLiters(),
                request.getWorkDescription()
        );
        return ResponseEntity.ok(log);
    }

    @Getter
    @Setter
    public static class EngineHourFuelRequest {
        private Long equipmentId;
        private Long projectId;
        private String operatorName;
        private BigDecimal startHour;
        private BigDecimal endHour;
        private BigDecimal fuelIssuedLiters;
        private String workDescription;
    }
}
