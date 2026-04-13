package com.mzansibuilds.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String handle;
    private String bio;
    private List<String> stack;
    private Integer collabs;
    private Integer completed;
    private String token;
}
