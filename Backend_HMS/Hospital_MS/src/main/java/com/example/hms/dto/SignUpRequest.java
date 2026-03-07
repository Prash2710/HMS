package com.example.hms.dto;

import javax.validation.constraints.*;

//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Size;

import java.util.Set;

public class SignUpRequest {

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phone;

    private Set<String> roles;

    // No-args constructor (required by many frameworks)
    public SignUpRequest() {
    }

    // All-args constructor (optional)
    public SignUpRequest(String username, String email, String password,
                         String firstName, String lastName,
                         String phone, Set<String> roles) {

        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.roles = roles;

        // Optional manual validation (same spirit as your compact constructor)
        if (username != null && username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
    }

    // Getters and Setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        if (username != null && username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
