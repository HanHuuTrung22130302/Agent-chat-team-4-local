package com.anhduongbuilding.erp.inventory.repository;

import com.anhduongbuilding.erp.inventory.model.StockBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockBalanceRepository extends JpaRepository<StockBalance, Long> {
    List<StockBalance> findByProjectId(Long projectId);
    Optional<StockBalance> findByProjectIdAndMaterialId(Long projectId, Long materialId);
}
