package com.anhduongbuilding.erp.winsteel.controller;

import com.anhduongbuilding.erp.winsteel.model.NestingPlan;
import com.anhduongbuilding.erp.winsteel.model.SteelComponent;
import com.anhduongbuilding.erp.winsteel.model.SteelOrder;
import com.anhduongbuilding.erp.winsteel.service.WinSteelService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/winsteel")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WinSteelController {

    private final WinSteelService winSteelService;

    @GetMapping("/orders/project/{projectId}")
    public ResponseEntity<List<SteelOrder>> getOrdersByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(winSteelService.getOrdersByProject(projectId));
    }

    @GetMapping("/components/order/{orderId}")
    public ResponseEntity<List<SteelComponent>> getComponentsByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(winSteelService.getComponentsByOrder(orderId));
    }

    @PostMapping("/nesting")
    public ResponseEntity<NestingPlan> evaluateNestingPlan(@RequestBody NestingPlanRequest request) {
        NestingPlan plan = winSteelService.evaluateAndSaveNestingPlan(
                request.getSteelOrderId(),
                request.getRawPlateSpecs(),
                request.getRawPlateWeightKg(),
                request.getUtilizedWeightKg()
        );
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/components/erect")
    public ResponseEntity<SteelComponent> erectComponent(@RequestBody ErectionRequest request) {
        SteelComponent component = winSteelService.erectComponentByQrCode(
                request.getQrCodeUid(),
                request.getErectedBy()
        );
        return ResponseEntity.ok(component);
    }

    @Getter
    @Setter
    public static class NestingPlanRequest {
        private Long steelOrderId;
        private String rawPlateSpecs;
        private BigDecimal rawPlateWeightKg;
        private BigDecimal utilizedWeightKg;
    }

    @Getter
    @Setter
    public static class ErectionRequest {
        private String qrCodeUid;
        private String erectedBy;
    }
}
