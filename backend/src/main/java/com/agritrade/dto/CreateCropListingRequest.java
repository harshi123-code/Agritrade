package com.agritrade.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateCropListingRequest(
        @NotBlank @Size(max = 80) String cropName,
        @NotNull @DecimalMin("0.01") BigDecimal quantity,
        @NotBlank @Size(max = 20) String unit,
        @NotNull @DecimalMin("0.01") BigDecimal pricePerUnit,
        @NotBlank @Size(max = 120) String location,
        @NotBlank @Size(max = 100) String farmerName) {
}