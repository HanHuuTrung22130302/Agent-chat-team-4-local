package com.anhduongbuilding.erp.project.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "daily_site_diaries", schema = "project_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailySiteDiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate;

    @Column(name = "weather_morning", length = 100)
    private String weatherMorning;

    @Column(name = "weather_afternoon", length = 100)
    private String weatherAfternoon;

    @Column(name = "temperature_celsius", precision = 4, scale = 1)
    private BigDecimal temperatureCelsius;

    @Column(name = "is_weather_stoppage")
    private Boolean isWeatherStoppage = false;

    @Column(name = "stoppage_hours", precision = 4, scale = 1)
    private BigDecimal stoppageHours = BigDecimal.ZERO;

    @Column(name = "direct_manpower_count")
    private Integer directManpowerCount = 0;

    @Column(name = "subcontractor_manpower_count")
    private Integer subcontractorManpowerCount = 0;

    @Column(name = "work_performed_summary", nullable = false, columnDefinition = "TEXT")
    private String workPerformedSummary;

    @Column(name = "issues_and_risks", columnDefinition = "TEXT")
    private String issuesAndRisks;

    @Column(name = "safety_notes", columnDefinition = "TEXT")
    private String safetyNotes;

    @Column(name = "site_manager_signature", length = 100)
    private String siteManagerSignature;

    @Column(name = "consultant_signature", length = 100)
    private String consultantSignature;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
