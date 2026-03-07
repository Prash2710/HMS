package com.example.hms.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ROLES")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

	@Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "ROLE_SEQ_GEN"
    )
    @SequenceGenerator(
        name = "ROLE_SEQ_GEN",
        sequenceName = "ROLE_SEQ",
        allocationSize = 1
    )
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, unique = true)
    private RoleName name;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RoleName getName() {
		return name;
	}

	public void setName(RoleName name) {
		this.name = name;
	}

	public enum RoleName {
        ROLE_ADMIN("Administrator"),
        ROLE_DOCTOR("Doctor"),
        ROLE_PATIENT("Patient"),
        ROLE_RECEPTIONIST("Receptionist");
        
        private final String displayName;
        
        RoleName(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}