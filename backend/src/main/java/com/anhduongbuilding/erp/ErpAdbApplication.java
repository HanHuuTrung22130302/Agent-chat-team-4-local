package com.anhduongbuilding.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Application Entry Point for ERP Ánh Dương Building.
 * Covers full enterprise Design & Build lifecycle:
 * Core IAM, Project WBS, Site Diary, BOQ Costing, Subcontractors, WinSteel, WIP.
 */
@SpringBootApplication
@EnableJpaAuditing
public class ErpAdbApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpAdbApplication.class, args);
    }
}
