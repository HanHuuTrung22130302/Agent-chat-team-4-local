package com.anhduongbuilding.erp.subcontractor.repository;

import com.anhduongbuilding.erp.subcontractor.model.Subcontractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcontractorRepository extends JpaRepository<Subcontractor, Long> {
    Optional<Subcontractor> findByCode(String code);
    Optional<Subcontractor> findByTaxCode(String taxCode);
    List<Subcontractor> findByStatus(String status);
}
