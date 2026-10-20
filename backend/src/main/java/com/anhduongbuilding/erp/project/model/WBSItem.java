package com.anhduongbuilding.erp.project.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wbs_items", schema = "project_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WBSItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "wbs_code", nullable = false, length = 50)
    private String wbsCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(name = "planned_start_date")
    private LocalDate plannedStartDate;

    @Column(name = "planned_end_date")
    private LocalDate plannedEndDate;

    @Column(name = "actual_start_date")
    private LocalDate actualStartDate;

    @Column(name = "actual_end_date")
    private LocalDate actualEndDate;

    @Column(name = "weight_percentage", precision = 5, scale = 2)
    private BigDecimal weightPercentage = BigDecimal.ZERO;

    @Column(name = "progress_percentage", precision = 5, scale = 2)
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(length = 50)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Transient
    private List<WBSItem> children = new ArrayList<>();
}
