package com.passgen.passgen.controller;

import com.passgen.passgen.service.PasswordService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final PasswordService service;

    public PasswordController(PasswordService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(
            @RequestBody PasswordRequest request) {

        try {
            String password = service.generate(
                request.length(),
                request.lowercase(),
                request.uppercase(),
                request.numbers(),
                request.symbols()
            );

            return ResponseEntity.ok(
                Map.of("password", password)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }

    public record PasswordRequest(
        int length,
        boolean lowercase,
        boolean uppercase,
        boolean numbers,
        boolean symbols
    ) {}
}