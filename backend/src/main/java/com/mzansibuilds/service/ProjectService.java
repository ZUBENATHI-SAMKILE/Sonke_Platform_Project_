package com.mzansibuilds.service;

import com.mzansibuilds.dto.CreateProjectDTO;
import com.mzansibuilds.dto.ProjectDTO;
import com.mzansibuilds.dto.UpdateProjectDTO;
import com.mzansibuilds.entity.Project;
import com.mzansibuilds.entity.User;
import com.mzansibuilds.repository.ProjectRepository;
import com.mzansibuilds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectDTO findById(@NonNull Long id) {
        return projectRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public List<ProjectDTO> findAll() {
        return projectRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> findByUserId(Long userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO create(@NonNull Long userId, CreateProjectDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setUser(user);
        project.setTitle(dto.getTitle());
        project.setDesc(dto.getDesc());
        project.setStage(dto.getStage());
        project.setSupport(dto.getSupport());
        project.setTech(dto.getTech());
        project.setProgress(5);
        project.setCompleted(false);

        return convertToDTO(projectRepository.save(project));
    }

    public ProjectDTO update(@NonNull Long id, UpdateProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getDesc() != null) project.setDesc(dto.getDesc());
        if (dto.getStage() != null) project.setStage(dto.getStage());
        if (dto.getSupport() != null) project.setSupport(dto.getSupport());
        if (dto.getTech() != null) project.setTech(dto.getTech());
        if (dto.getMilestones() != null) project.setMilestones(dto.getMilestones());
        if (dto.getProgress() != null) project.setProgress(dto.getProgress());
        if (dto.getCompleted() != null) project.setCompleted(dto.getCompleted());

        return convertToDTO(projectRepository.save(project));
    }

    public void delete(@NonNull Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDTO convertToDTO(Project project) {
        return new ProjectDTO(
                project.getId(),
                project.getUser().getId(),
                project.getUser().getName(),
                project.getUser().getHandle(),
                project.getTitle(),
                project.getDesc(),
                project.getStage(),
                project.getSupport(),
                project.getTech(),
                project.getMilestones(),
                project.getProgress(),
                project.getCompleted(),
                project.getCreatedAt().atZone(ZoneId.of("Africa/Johannesburg")).toInstant().toEpochMilli()
        );
    }
}
