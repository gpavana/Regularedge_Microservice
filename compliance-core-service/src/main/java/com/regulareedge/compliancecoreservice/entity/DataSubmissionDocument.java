package com.regulareedge.compliancecoreservice.entity;

import com.regulareedge.compliancecoreservice.common.enums.DocumentStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * A PDF submitted by a Data Owner against a DataCollectionRequest. A
 * Compliance Officer reviews it (status=SUBMITTED) and forwards it to the
 * CCO (status=FORWARDED). The file itself lives on disk under
 * file.upload-dir; this row only tracks the metadata + workflow state.
 */
@Entity
@Table(name = "data_submission_document")
public class DataSubmissionDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private DataCollectionRequest request;

    private String fileName;
    private String storedFileName;
    private String contentType;
    private long fileSizeBytes;

    /** External user id (owned by auth-service) - plain int, not a JPA relationship. */
    private int uploadedById;
    private LocalDateTime uploadedDate;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private Integer forwardedById;
    private LocalDateTime forwardedDate;

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public DataCollectionRequest getRequest() {
        return request;
    }

    public void setRequest(DataCollectionRequest request) {
        this.request = request;
    }

    /** Convenience accessor delegating to the associated DataCollectionRequest. */
    public int getRequestId() {
        return request != null ? request.getRequestId() : 0;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public int getUploadedById() {
        return uploadedById;
    }

    public void setUploadedById(int uploadedById) {
        this.uploadedById = uploadedById;
    }

    public LocalDateTime getUploadedDate() {
        return uploadedDate;
    }

    public void setUploadedDate(LocalDateTime uploadedDate) {
        this.uploadedDate = uploadedDate;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public Integer getForwardedById() {
        return forwardedById;
    }

    public void setForwardedById(Integer forwardedById) {
        this.forwardedById = forwardedById;
    }

    public LocalDateTime getForwardedDate() {
        return forwardedDate;
    }

    public void setForwardedDate(LocalDateTime forwardedDate) {
        this.forwardedDate = forwardedDate;
    }
}
