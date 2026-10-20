package com.anhduongbuilding.erp.subcontractor.repository;

import com.anhduongbuilding.erp.subcontractor.model.Subcontract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcontractRepository extends JpaRepository<Subcontract, Long> {
    Optional<Subcontract> findByContractNumber(String contractNumber);
    List<Subcontract> findByProjectId(Long projectId);
    List<Subcontract> findBySubcontractorId(Long subcontractorId);
}
