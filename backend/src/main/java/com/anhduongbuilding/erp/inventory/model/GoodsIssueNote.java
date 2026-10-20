package com.anhduongbuilding.erp.inventory.model;

import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.model.WBSItem;
import com.anhduongbuilding.erp.subcontractor.model.Subcontractor;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goods_issue_notes", schema = "inventory_mgmt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsIssueNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gin_number", nullable = false, unique = true, length = 50)
    private String ginNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wbs_item_id")
    private WBSItem wbsItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcontractor_id")
    private Subcontractor subcontractor;

    @Column(name = "recipient_name", nullable = false, length = 150)
    private String recipientName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "issue_date", nullable = false)
    @Builder.Default
    private LocalDate issueDate = LocalDate.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "gin_id")
    @Builder.Default
    private List<GoodsIssueItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
