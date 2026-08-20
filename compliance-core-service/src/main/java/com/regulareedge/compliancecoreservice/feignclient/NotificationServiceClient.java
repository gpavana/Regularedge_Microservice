package com.regulareedge.compliancecoreservice.feignclient;

import com.regulareedge.compliancecoreservice.config.FeignConfig;
import com.regulareedge.compliancecoreservice.dto.request.CreateNotificationRequest;
import com.regulareedge.compliancecoreservice.feignclient.fallback.NotificationServiceClientFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name = "notification-service", configuration = FeignConfig.class,
        fallback = NotificationServiceClientFallback.class)
public interface NotificationServiceClient {

    @PostMapping("/notifications")
    void create(@RequestBody CreateNotificationRequest request);
}
