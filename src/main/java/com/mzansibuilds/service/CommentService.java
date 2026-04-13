package com.mzansibuilds.service;

import com.mzansibuilds.dto.CommentDTO;
import com.mzansibuilds.dto.CreateCommentDTO;
import com.mzansibuilds.entity.Comment;
import com.mzansibuilds.repository.CommentRepository;
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
public class CommentService {
    private final CommentRepository commentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<CommentDTO> findByProjectId(@NonNull Long projectId) {
        return commentRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO create(@NonNull Long projectId, @NonNull Long userId, CreateCommentDTO dto) {
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setProject(project);
        comment.setUser(user);
        comment.setText(dto.getText());

        return convertToDTO(commentRepository.save(comment));
    }

    public void delete(@NonNull Long id) {
        commentRepository.deleteById(id);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getProject().getId(),
                comment.getUser().getId(),
                comment.getText(),
                comment.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        );
    }
}
