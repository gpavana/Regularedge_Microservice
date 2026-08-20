package com.regulareedge.compliancecoreservice.dto.request;


public class CreateNotificationRequest {

    private int userId;
    private String message;
    private String category;

    public CreateNotificationRequest() {
    }

    public CreateNotificationRequest(int userId, String message, String category) {
        this.userId = userId;
        this.message = message;
        this.category = category;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
