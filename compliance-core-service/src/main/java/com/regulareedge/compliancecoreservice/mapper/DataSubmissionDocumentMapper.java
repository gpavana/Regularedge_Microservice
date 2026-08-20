package com.regulareedge.compliancecoreservice.mapper;

import com.regulareedge.compliancecoreservice.dto.response.DataSubmissionDocumentResponse;
import com.regulareedge.compliancecoreservice.entity.DataSubmissionDocument;

public final class DataSubmissionDocumentMapper {

    private DataSubmissionDocumentMapper() {
    }

    public static DataSubmissionDocumentResponse toResponse(DataSubmissionDocument document) {
        if (document == null) {
            return null;
        }
        return new DataSubmissionDocumentResponse(
                document.getDocumentId(),
                document.getRequestId(),
                document.getFileName(),
                document.getContentType(),
                document.getFileSizeBytes(),
                document.getUploadedById(),
                document.getUploadedDate(),
                document.getStatus(),
                document.getForwardedById(),
                document.getForwardedDate());
    }
}
