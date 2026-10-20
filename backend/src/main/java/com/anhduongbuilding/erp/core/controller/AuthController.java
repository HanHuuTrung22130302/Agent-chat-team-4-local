package com.anhduongbuilding.erp.core.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & IAM", description = "Xác thực người dùng & Cấp quyền JWT")
public class AuthController {

    @Data
    @Builder
    public static class LoginResponse {
        private String accessToken;
        private String tokenType;
        private String username;
        private String fullName;
        private String role;
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống ERP")
    public ResponseEntity<LoginResponse> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.getOrDefault("username", "admin");
        
        // Return standard JWT session for ERP access
        LoginResponse response = LoginResponse.builder()
                .accessToken("eyJhbGciOiJIUzI1NiJ9.adb-erp-mock-jwt-token.signature")
                .tokenType("Bearer")
                .username(username)
                .fullName(username.equals("admin") ? "Quản trị viên Hệ thống" : username)
                .role("ROLE_BOD")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản hiện tại")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        return ResponseEntity.ok(Map.of(
                "username", "admin",
                "fullName", "Quản trị viên Hệ thống",
                "role", "ROLE_BOD",
                "company", "Ánh Dương Building Co., Ltd",
                "license", "Hạng I (Grade I Construction License)"
        ));
    }
}
