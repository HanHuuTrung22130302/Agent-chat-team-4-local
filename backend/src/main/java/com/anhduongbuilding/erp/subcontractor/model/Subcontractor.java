package com.anhduongbuilding.erp.subcontractor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "subcontractors", schema = "subcontractor_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcontractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "tax_code", nullable = false, unique = true, length = 30)
    private String taxCode;

    @Column(length = 150)
    private String representative;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String specialty;

    @Column(name = "rating_grade", length = 10)
    private String ratingGrade = "B"; // A, B, C, BLACKLISTED

    @Column(length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, SUSPENDED

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt = ZonedDateTime.now();
}
