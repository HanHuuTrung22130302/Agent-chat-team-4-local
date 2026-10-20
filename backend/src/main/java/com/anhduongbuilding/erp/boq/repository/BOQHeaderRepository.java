package com.anhduongbuilding.erp.boq.repository;

import com.anhduongbuilding.erp.boq.model.BOQHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BOQHeaderRepository extends JpaRepository<BOQHeader, Long> {
    Optional<BOQHeader> findByProjectIdAndIsActiveTrue(Long projectId);
}
