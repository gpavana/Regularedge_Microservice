package com.regulareedge.compliancecoreservice.exception;

/**
 * Thrown when an entity cannot be deactivated/deleted because other active
 * records still reference it (e.g. a Regulator with active obligations).
 * Maps to HTTP 409 Conflict.
 */
public class ResourceInUseException extends RuntimeException {

    public ResourceInUseException(String message) {
        super(message);
    }
}
