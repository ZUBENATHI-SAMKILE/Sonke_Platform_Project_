package com.mzansibuilds.controller;

import com.mzansibuilds.dto.CreateProjectDTO;
import com.mzansibuilds.dto.ProjectDTO;
import com.mzansibuilds.dto.UpdateProjectDTO;
import com.mzansibuilds.service.ProjectService;
import com.mzansibuilds.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDTO>> getUserProjects(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.findByUserId(userId));
    }

    @PostMapping
public ResponseEntity<?> createProject(@RequestBody CreateProjectDTO dto, Authentication authentication) {
    try {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(projectService.create(userId, dto));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody UpdateProjectDTO dto) {
        try {
            return ResponseEntity.ok(projectService.update(id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}