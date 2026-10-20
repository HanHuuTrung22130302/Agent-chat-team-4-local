package com.anhduongbuilding.erp.project.service;

import com.anhduongbuilding.erp.project.model.DailySiteDiary;
import com.anhduongbuilding.erp.project.model.Project;
import com.anhduongbuilding.erp.project.model.WBSItem;
import com.anhduongbuilding.erp.project.repository.DailySiteDiaryRepository;
import com.anhduongbuilding.erp.project.repository.ProjectRepository;
import com.anhduongbuilding.erp.project.repository.WBSItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WBSItemRepository wbsItemRepository;
    private final DailySiteDiaryRepository dailySiteDiaryRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<WBSItem> getProjectWBSTree(Long projectId) {
        List<WBSItem> allItems = wbsItemRepository.findByProjectIdOrderByWbsCodeAsc(projectId);
        Map<Long, WBSItem> itemMap = new HashMap<>();
        List<WBSItem> rootItems = new ArrayList<>();

        for (WBSItem item : allItems) {
            item.setChildren(new ArrayList<>());
            itemMap.put(item.getId(), item);
        }

        for (WBSItem item : allItems) {
            if (item.getParentId() != null && itemMap.containsKey(item.getParentId())) {
                itemMap.get(item.getParentId()).getChildren().add(item);
            } else {
                rootItems.add(item);
            }
        }

        return rootItems;
    }

    @Transactional
    public WBSItem updateWBSProgress(Long wbsId, BigDecimal progressPercentage) {
        WBSItem item = wbsItemRepository.findById(wbsId)
                .orElseThrow(() -> new RuntimeException("WBS item not found: " + wbsId));

        item.setProgressPercentage(progressPercentage);
        if (progressPercentage.compareTo(BigDecimal.valueOf(100)) >= 0) {
            item.setStatus("COMPLETED");
        } else if (progressPercentage.compareTo(BigDecimal.ZERO) > 0) {
            item.setStatus("IN_PROGRESS");
        }
        wbsItemRepository.save(item);

        // Recalculate overall project progress
        recalculateProjectProgress(item.getProjectId());
        return item;
    }

    private void recalculateProjectProgress(Long projectId) {
        List<WBSItem> items = wbsItemRepository.findByProjectIdOrderByWbsCodeAsc(projectId);
        BigDecimal totalWeightedProgress = BigDecimal.ZERO;
        BigDecimal totalWeight = BigDecimal.ZERO;

        for (WBSItem it : items) {
            if (it.getWeightPercentage() != null && it.getWeightPercentage().compareTo(BigDecimal.ZERO) > 0) {
                totalWeight = totalWeight.add(it.getWeightPercentage());
                BigDecimal weighted = it.getProgressPercentage().multiply(it.getWeightPercentage());
                totalWeightedProgress = totalWeightedProgress.add(weighted);
            }
        }

        if (totalWeight.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal overallProgress = totalWeightedProgress.divide(totalWeight, 2, RoundingMode.HALF_UP);
            projectRepository.findById(projectId).ifPresent(p -> {
                p.setProgressPercentage(overallProgress);
                projectRepository.save(p);
            });
        }
    }

    public List<DailySiteDiary> getSiteDiaries(Long projectId) {
        return dailySiteDiaryRepository.findByProjectIdOrderByDiaryDateDesc(projectId);
    }

    @Transactional
    public DailySiteDiary createSiteDiary(DailySiteDiary diary) {
        return dailySiteDiaryRepository.save(diary);
    }
}
