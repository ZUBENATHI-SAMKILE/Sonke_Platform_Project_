package com.mzansibuilds.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", name = "\"desc\"")
    private String desc;

    @Column(nullable = false)
    private String stage; 

    private String support; 

    @ElementCollection
    @CollectionTable(name = "project_tech", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology")
    private List<String> tech;

    @ElementCollection
    @CollectionTable(name = "project_milestones", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "milestone", columnDefinition = "TEXT")
    private List<String> milestones;

    private Integer progress = 5;
    private Boolean completed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @ManyToMany(mappedBy = "collaboratedProjects", fetch = FetchType.LAZY)
    private List<User> collaborators;
}
