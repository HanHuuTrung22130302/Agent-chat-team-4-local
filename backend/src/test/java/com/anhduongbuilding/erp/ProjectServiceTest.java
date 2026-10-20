package com.anhduongbuilding.erp;

import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.model.WBSItem;
import com.anhduongbuilding.erp.project.repository.DailySiteDiaryRepository;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import com.anhduongbuilding.erp.project.repository.WBSItemRepository;
import com.anhduongbuilding.erp.project.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private WBSItemRepository wbsItemRepository;

    @Mock
    private DailySiteDiaryRepository dailySiteDiaryRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project sampleProject;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L)
                .code("DA-ADB-2026-001")
                .name("Nhà máy Cơ khí Chính xác Ánh Dương")
                .clientName("Ánh Dương Group")
                .location("Bình Dương")
                .projectType("INDUSTRIAL_FACTORY")
                .contractValue(new BigDecimal("185000000000.00"))
                .startDate(LocalDate.now())
                .plannedEndDate(LocalDate.now().plusMonths(10))
                .progressPercentage(new BigDecimal("35.00"))
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Should return all active construction projects")
    void testGetAllProjects() {
        when(projectRepository.findAll()).thenReturn(List.of(sampleProject));

        List<Project> result = projectService.getAllProjects();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("DA-ADB-2026-001", result.get(0).getCode());
        verify(projectRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should update WBS progress and mark completed when reaches 100%")
    void testUpdateWBSProgressToComplete() {
        WBSItem wbsItem = WBSItem.builder()
                .id(10L)
                .projectId(1L)
                .wbsCode("WBS-1.0")
                .name("Cọc thí nghiệm")
                .weightPercentage(new BigDecimal("10.00"))
                .progressPercentage(BigDecimal.ZERO)
                .status("NOT_STARTED")
                .build();

        when(wbsItemRepository.findById(10L)).thenReturn(Optional.of(wbsItem));
        when(wbsItemRepository.save(any(WBSItem.class))).thenAnswer(i -> i.getArgument(0));
        when(wbsItemRepository.findByProjectIdOrderByWbsCodeAsc(1L)).thenReturn(List.of(wbsItem));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        WBSItem updated = projectService.updateWBSProgress(10L, new BigDecimal("100.00"));

        assertEquals(new BigDecimal("100.00"), updated.getProgressPercentage());
        assertEquals("COMPLETED", updated.getStatus());
        verify(wbsItemRepository, times(1)).save(wbsItem);
    }
}
