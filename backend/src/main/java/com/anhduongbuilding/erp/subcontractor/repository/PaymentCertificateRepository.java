package com.anhduongbuilding.erp.subcontractor.repository;

import com.anhduongbuilding.erp.subcontractor.model.PaymentCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentCertificateRepository extends JpaRepository<PaymentCertificate, Long> {
    Optional<PaymentCertificate> findByCertificateNumber(String certificateNumber);
    List<PaymentCertificate> findBySubcontractIdOrderByPeriodNumberAsc(Long subcontractId);
    Optional<PaymentCertificate> findTopBySubcontractIdOrderByPeriodNumberDesc(Long subcontractId);
}
