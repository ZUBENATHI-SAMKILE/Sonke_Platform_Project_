package com.mzansibuilds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private Long userId;
    private String authorName;
    private String authorHandle;
    private String title;
    private String desc;
    private String stage;
    private String support;
    private List<String> tech;
    private List<String> milestones;
    private Integer progress;
    private Boolean completed;
    private Long ts;
}
