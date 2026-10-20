package com.anhduongbuilding.erp.winsteel.repository;

import com.anhduongbuilding.erp.winsteel.model.SteelOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SteelOrderRepository extends JpaRepository<SteelOrder, Long> {
    Optional<SteelOrder> findByOrderNumber(String orderNumber);
    List<SteelOrder> findByProjectId(Long projectId);
}
