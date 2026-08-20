package com.regulareedge.compliancecoreservice.dto.response;

import com.regulareedge.compliancecoreservice.common.enums.DocumentStatus;

import java.time.LocalDateTime;

public class DataSubmissionDocumentResponse {

    private int documentId;
    private int requestId;
    private String fileName;
    private String contentType;
    private long fileSizeBytes;
    private int uploadedById;
    private LocalDateTime uploadedDate;
    private DocumentStatus status;
    private Integer forwardedById;
    private LocalDateTime forwardedDate;

    public DataSubmissionDocumentResponse() {
    }

    public DataSubmissionDocumentResponse(int documentId, int requestId, String fileName, String contentType,
                                           long fileSizeBytes, int uploadedById, LocalDateTime uploadedDate,
                                           DocumentStatus status, Integer forwardedById, LocalDateTime forwardedDate) {
        this.documentId = documentId;
        this.requestId = requestId;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSizeBytes = fileSizeBytes;
        this.uploadedById = uploadedById;
        this.uploadedDate = uploadedDate;
        this.status = status;
        this.forwardedById = forwardedById;
        this.forwardedDate = forwardedDate;
    }

    public int getDocumentId() {
        return documentId;
    }

    public void setDocumentId(int documentId) {
        this.documentId = documentId;
    }

    public int getRequestId() {
        return requestId;
    }

    public void setRequestId(int requestId) {
        this.requestId = requestId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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
