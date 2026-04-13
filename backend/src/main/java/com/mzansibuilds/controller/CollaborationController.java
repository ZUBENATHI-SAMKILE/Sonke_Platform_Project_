package com.mzansibuilds.controller;

import com.mzansibuilds.repository.ProjectRepository;
import com.mzansibuilds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects/{projectId}/collaborators")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CollaborationController {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getCollaborators(@PathVariable @NonNull Long projectId) {
        try {
            var project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            return ResponseEntity.ok(project.getCollaborators().stream().map(u -> u.getId()).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleCollaborator(@PathVariable @NonNull Long projectId, Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            var project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getCollaboratedProjects().contains(project)) {
                user.getCollaboratedProjects().remove(project);
                project.getCollaborators().remove(user);
            } else {
                user.getCollaboratedProjects().add(project);
                project.getCollaborators().add(user);
            }
            user.setCollabs(user.getCollaboratedProjects().size());
            userRepository.save(user);
            projectRepository.save(project);

            return ResponseEntity.ok(project.getCollaborators().stream().map(u -> u.getId()).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
