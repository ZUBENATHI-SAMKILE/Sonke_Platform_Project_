package com.mzansibuilds.repository;

import com.mzansibuilds.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    int countByProjectId(Long projectId);
}
