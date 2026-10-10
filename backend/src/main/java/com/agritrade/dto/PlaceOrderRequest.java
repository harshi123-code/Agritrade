package com.agritrade.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PlaceOrderRequest(@NotNull Long produceId, @NotNull @DecimalMin("0.01") BigDecimal quantity) { }