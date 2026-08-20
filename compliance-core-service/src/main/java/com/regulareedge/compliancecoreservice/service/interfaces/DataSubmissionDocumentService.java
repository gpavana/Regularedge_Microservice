package com.regulareedge.compliancecoreservice.service.interfaces;

import com.regulareedge.compliancecoreservice.dto.response.DataSubmissionDocumentResponse;
import com.regulareedge.compliancecoreservice.entity.DataSubmissionDocument;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DataSubmissionDocumentService {

    DataSubmissionDocumentResponse upload(int requestId, MultipartFile file, int uploadedById);

    List<DataSubmissionDocumentResponse> getByRequest(int requestId);

    DataSubmissionDocument getDocument(int documentId);

    Resource loadFile(DataSubmissionDocument document);
}
