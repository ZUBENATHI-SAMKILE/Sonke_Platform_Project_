package com.mzansibuilds.controller;

import com.mzansibuilds.dto.AuthResponseDTO;
import com.mzansibuilds.dto.LoginRequestDTO;
import com.mzansibuilds.dto.RegisterRequestDTO;
import com.mzansibuilds.dto.UserDTO;
import com.mzansibuilds.entity.User;
import com.mzansibuilds.service.JwtService;
import com.mzansibuilds.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            UserDTO user = userService.findByEmail(dto.getEmail());
            User userEntity = userService.findUserEntity(user.getId());
            
            if (!passwordEncoder.matches(dto.getPassword(), userEntity.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            String token = jwtService.generateToken(user.getId());
            
            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getHandle(),
                    user.getBio(),
                    user.getStack(),
                    user.getCollabs(),
                    user.getCompleted(),
                    token
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO dto) {
        try {
            User user = new User();
            user.setEmail(dto.getEmail());
            user.setPassword(dto.getPassword());
            user.setName(dto.getName());
            user.setHandle(dto.getHandle());
            user.setBio(dto.getBio());
            user.setStack(dto.getStack());
            user.setCollabs(0);
            user.setCompleted(0);

            UserDTO savedUser = userService.save(user);
            String token = jwtService.generateToken(savedUser.getId());

            AuthResponseDTO response = new AuthResponseDTO(
                    savedUser.getId(),
                    savedUser.getEmail(),
                    savedUser.getName(),
                    savedUser.getHandle(),
                    savedUser.getBio(),
                    savedUser.getStack(),
                    savedUser.getCollabs(),
                    savedUser.getCompleted(),
                    token
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
