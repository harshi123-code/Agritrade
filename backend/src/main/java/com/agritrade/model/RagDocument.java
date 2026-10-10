package com.agritrade.model;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "rag_documents")
public class RagDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String source;
    @Convert(converter = RagCategoryConverter.class)
    private RagCategory category;
    @Column(name = "file_path")
    private String filePath;
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected RagDocument() { }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSource() { return source; }
    public RagCategory getCategory() { return category; }
    public String getFilePath() { return filePath; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
}
