package com.anhduongbuilding.erp.boq.repository;

import com.anhduongbuilding.erp.boq.model.BOQItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BOQItemRepository extends JpaRepository<BOQItem, Long> {
    List<BOQItem> findByBoqHeaderId(Long boqHeaderId);
    List<BOQItem> findByWbsItemId(Long wbsItemId);
}
