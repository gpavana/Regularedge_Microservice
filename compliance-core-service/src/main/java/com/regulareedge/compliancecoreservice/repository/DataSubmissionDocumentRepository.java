package com.regulareedge.compliancecoreservice.repository;

import com.regulareedge.compliancecoreservice.common.enums.DocumentStatus;
import com.regulareedge.compliancecoreservice.entity.DataSubmissionDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataSubmissionDocumentRepository extends JpaRepository<DataSubmissionDocument, Integer> {

    List<DataSubmissionDocument> findByRequest_RequestId(int requestId);

    List<DataSubmissionDocument> findByStatus(DocumentStatus status);
}
