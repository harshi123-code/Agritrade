package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userEmail;
    private String type;
    @Lob
    private String message;
    @Column(name = "is_read", nullable = false)
    private boolean read;
    private Instant createdAt = Instant.now();

    protected Notification() { }

    public Notification(String userEmail, String type, String message) {
        this.userEmail = userEmail;
        this.type = type;
        this.message = message;
    }

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public String getType() { return type; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public Instant getCreatedAt() { return createdAt; }
    public void markRead() { this.read = true; }
}
