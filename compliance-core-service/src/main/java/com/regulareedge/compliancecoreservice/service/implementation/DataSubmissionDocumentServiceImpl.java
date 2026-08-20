package com.regulareedge.compliancecoreservice.service.implementation;

import com.regulareedge.compliancecoreservice.common.enums.DocumentStatus;
import com.regulareedge.compliancecoreservice.dto.response.DataSubmissionDocumentResponse;
import com.regulareedge.compliancecoreservice.entity.DataCollectionRequest;
import com.regulareedge.compliancecoreservice.entity.DataSubmissionDocument;
import com.regulareedge.compliancecoreservice.exception.InvalidRequestException;
import com.regulareedge.compliancecoreservice.exception.ResourceNotFoundException;
import com.regulareedge.compliancecoreservice.mapper.DataSubmissionDocumentMapper;
import com.regulareedge.compliancecoreservice.repository.DataCollectionRequestRepository;
import com.regulareedge.compliancecoreservice.repository.DataSubmissionDocumentRepository;
import com.regulareedge.compliancecoreservice.service.interfaces.AuditLogService;
import com.regulareedge.compliancecoreservice.service.interfaces.DataSubmissionDocumentService;
import com.regulareedge.compliancecoreservice.service.interfaces.UserValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DataSubmissionDocumentServiceImpl implements DataSubmissionDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DataSubmissionDocumentServiceImpl.class);
    private static final String PDF_CONTENT_TYPE = "application/pdf";

    private final DataSubmissionDocumentRepository documentRepository;
    private final DataCollectionRequestRepository requestRepository;
    private final UserValidationService userValidationService;
    private final AuditLogService auditLogService;
    private final Path uploadDir;

    public DataSubmissionDocumentServiceImpl(DataSubmissionDocumentRepository documentRepository,
                                              DataCollectionRequestRepository requestRepository,
                                              UserValidationService userValidationService,
                                              AuditLogService auditLogService,
                                              @Value("${file.upload-dir}") String uploadDirProperty) {
        this.documentRepository = documentRepository;
        this.requestRepository = requestRepository;
        this.userValidationService = userValidationService;
        this.auditLogService = auditLogService;
        this.uploadDir = Paths.get(uploadDirProperty, "data-submissions").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload directory: " + this.uploadDir, e);
        }
    }
    @Override
    public DataSubmissionDocumentResponse upload(int requestId, MultipartFile file, int uploadedById) {
        DataCollectionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Data collection request not found with id: " + requestId));

        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("A file is required.");
        }
        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        boolean isPdfContentType = PDF_CONTENT_TYPE.equalsIgnoreCase(file.getContentType());
        boolean isPdfExtension = originalName.toLowerCase().endsWith(".pdf");
        if (!isPdfContentType && !isPdfExtension) {
            throw new InvalidRequestException("Only PDF files are accepted.");
        }

        if (!userValidationService.userExists(uploadedById)) {
            logger.warn("Uploader userId={} was reported as not found by auth-service", uploadedById);
            throw new InvalidRequestException("Uploading user not found with id: " + uploadedById);
        }

        String storedFileName = UUID.randomUUID() + ".pdf";
        Path target = uploadDir.resolve(storedFileName);
        try {
            file.transferTo(target);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store uploaded file", e);
        }

        DataSubmissionDocument document = new DataSubmissionDocument();
        document.setRequest(request);
        document.setFileName(originalName.isEmpty() ? storedFileName : originalName);
        document.setStoredFileName(storedFileName);
        document.setContentType(PDF_CONTENT_TYPE);
        document.setFileSizeBytes(file.getSize());
        document.setUploadedById(uploadedById);
        document.setUploadedDate(LocalDateTime.now());
        document.setStatus(DocumentStatus.SUBMITTED);

        DataSubmissionDocument saved = documentRepository.save(document);
        auditLogService.log(uploadedById, "DATA_SUBMISSION_DOCUMENT_UPLOADED", "DataSubmissionDocument",
                saved.getDocumentId());
        return DataSubmissionDocumentMapper.toResponse(saved);
    }

    @Override
    public List<DataSubmissionDocumentResponse> getByRequest(int requestId) {
        return documentRepository.findByRequest_RequestId(requestId).stream()
                .map(DataSubmissionDocumentMapper::toResponse)
                .toList();
    }

    @Override
    public DataSubmissionDocument getDocument(int documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
    }

    @Override
    public Resource loadFile(DataSubmissionDocument document) {
        Path filePath = uploadDir.resolve(document.getStoredFileName());
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Stored file missing for document id: " + document.getDocumentId());
        }
        return new FileSystemResource(filePath);
    }
}
