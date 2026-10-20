package com.anhduongbuilding.erp.winsteel.repository;

import com.anhduongbuilding.erp.winsteel.model.SteelComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SteelComponentRepository extends JpaRepository<SteelComponent, Long> {
    Optional<SteelComponent> findByQrCodeUid(String qrCodeUid);
    List<SteelComponent> findBySteelOrderId(Long steelOrderId);
}
