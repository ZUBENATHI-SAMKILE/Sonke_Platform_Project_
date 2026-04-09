package com.mzansibuilds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.mzansibuilds.entity")
public class MzansiBuildsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MzansiBuildsApplication.class, args);
    }
}
