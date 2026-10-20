package com.anhduongbuilding.erp.project.model;

import com.anhduongbuilding.erp.core.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "projects", schema = "project_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "client_name", nullable = false, length = 255)
    private String clientName;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "project_type", nullable = false, length = 50)
    private String projectType; // INDUSTRIAL_FACTORY, LOGISTICS, COMMERCIAL

    @Column(name = "contract_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal contractValue;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "planned_end_date", nullable = false)
    private LocalDate plannedEndDate;

    @Column(name = "actual_end_date")
    private LocalDate actualEndDate;

    @Column(name = "progress_percentage", precision = 5, scale = 2)
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(length = 50)
    private String status = "ACTIVE"; // PLANNING, ACTIVE, SUSPENDED, COMPLETED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_director_id")
    private User projectDirector;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "site_manager_id")
    private User siteManager;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt = ZonedDateTime.now();
}
