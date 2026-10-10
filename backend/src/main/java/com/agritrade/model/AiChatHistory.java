package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "ai_chat_history")
public class AiChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Lob
    private String question;
    @Lob
    private String answer;
    private Instant createdAt = Instant.now();

    protected AiChatHistory() { }

    public AiChatHistory(Long userId, String question, String answer) {
        this.userId = userId;
        this.question = question;
        this.answer = answer;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public Instant getCreatedAt() { return createdAt; }
}
