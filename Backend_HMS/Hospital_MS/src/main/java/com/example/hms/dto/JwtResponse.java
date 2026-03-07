package com.example.hms.dto;

import java.util.List;

public class JwtResponse {

    private String token;
    private String type;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    // No-args constructor
    public JwtResponse() {
    }

    // All-args constructor
    public JwtResponse(
            String token,
            String type,
            Long id,
            String username,
            String email,
            List<String> roles
    ) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    // Custom constructor with default type = "Bearer"
    public JwtResponse(
            String token,
            Long id,
            String username,
            String email,
            List<String> roles
    ) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }
    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
