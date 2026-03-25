package com.example.hms.entity;

import javax.persistence.*;

@Entity
@Table(name = "RECEPTIONISTS")
public class Receptionist {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "receptionist_seq")
    @SequenceGenerator(
            name = "receptionist_seq",
            sequenceName = "RECEPTIONIST_SEQ",
            allocationSize = 1
    )
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String shift;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getShift() {
        return shift;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }
}