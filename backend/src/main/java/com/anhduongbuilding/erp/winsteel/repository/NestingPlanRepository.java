package com.anhduongbuilding.erp.winsteel.repository;

import com.anhduongbuilding.erp.winsteel.model.NestingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NestingPlanRepository extends JpaRepository<NestingPlan, Long> {
    List<NestingPlan> findBySteelOrderId(Long steelOrderId);
}
