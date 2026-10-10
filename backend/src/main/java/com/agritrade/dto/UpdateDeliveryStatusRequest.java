package com.agritrade.dto;

import com.agritrade.model.DeliveryStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateDeliveryStatusRequest(@NotNull DeliveryStatus status) { }