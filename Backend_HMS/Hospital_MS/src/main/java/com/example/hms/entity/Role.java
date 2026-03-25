package com.example.hms.entity;

import javax.persistence.*;

@Entity
@Table(name = "ROLES")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_SEQ_GEN")
    @SequenceGenerator(
            name = "ROLE_SEQ_GEN",
            sequenceName = "ROLE_SEQ",
            allocationSize = 1
    )
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "NAME", length = 50, unique = true)
    private RoleName name;

    public Role() {}

    public Role(Long id, RoleName name) {
        this.id = id;
        this.name = name;
    }

    public Role(RoleName name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public RoleName getName() { return name; }

    public void setId(Long id) { this.id = id; }
    public void setName(RoleName name) { this.name = name; }

    public enum RoleName {
        ADMIN,
        DOCTOR,
        RECEPTIONIST,
        PATIENT
    }
    
    
}