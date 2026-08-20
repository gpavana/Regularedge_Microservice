package com.regulareedge.compliancecoreservice.feignclient.fallback;

import com.regulareedge.compliancecoreservice.dto.request.CreateNotificationRequest;
import com.regulareedge.compliancecoreservice.feignclient.NotificationServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class NotificationServiceClientFallback implements NotificationServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceClientFallback.class);

    @Override
    public void create(CreateNotificationRequest request) {
        logger.warn("Failed to deliver notification to userId={} category={}: {}",
                request.getUserId(), request.getCategory(), request.getMessage());
    }
}
