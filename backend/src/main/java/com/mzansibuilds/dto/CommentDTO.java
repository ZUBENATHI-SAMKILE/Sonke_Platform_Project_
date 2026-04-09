package com.mzansibuilds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long projectId;
    private Long userId;
    private String text;
    private Long createdAt;
}
