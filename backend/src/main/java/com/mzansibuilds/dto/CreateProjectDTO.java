package com.mzansibuilds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectDTO {
    private String title;
    private String desc;
    private String stage;
    private String support;
    private List<String> tech;
}
