package com.anhduongbuilding.erp.inventory.repository;

import com.anhduongbuilding.erp.inventory.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByProjectId(Long projectId);
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
}
