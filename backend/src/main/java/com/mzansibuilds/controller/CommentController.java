package com.mzansibuilds.controller;

import com.mzansibuilds.dto.CommentDTO;
import com.mzansibuilds.dto.CreateCommentDTO;
import com.mzansibuilds.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/comments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getProjectComments(@PathVariable Long projectId) {
        return ResponseEntity.ok(commentService.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<?> createComment(@PathVariable Long projectId, @RequestBody CreateCommentDTO dto, Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            return ResponseEntity.ok(commentService.create(projectId, userId, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long projectId, @PathVariable Long id) {
        try {
            commentService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
