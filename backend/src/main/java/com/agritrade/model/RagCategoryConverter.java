package com.agritrade.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter
public class RagCategoryConverter implements AttributeConverter<RagCategory, String> {
    @Override
    public String convertToDatabaseColumn(RagCategory category) {
        if (category == null) return null;
        return switch (category) {
            case CROPS -> "Crops";
            case FARMING -> "Farming";
            case PEST_MANAGEMENT -> "Pest Management";
            case MARKETING -> "Marketing";
            case GOVERNMENT_SCHEMES -> "Government Schemes";
        };
    }

    @Override
    public RagCategory convertToEntityAttribute(String value) {
        if (value == null || value.isBlank()) return null;
        String normalized = value.trim().toUpperCase(Locale.ROOT).replace(' ', '_').replace('-', '_');
        return switch (normalized) {
            case "CROP", "CROPS" -> RagCategory.CROPS;
            case "FARMING", "FARMING_PRACTICES" -> RagCategory.FARMING;
            case "PEST_MANAGEMENT", "PEST_CONTROL" -> RagCategory.PEST_MANAGEMENT;
            case "MARKETING" -> RagCategory.MARKETING;
            case "GOVERNMENT_SCHEMES", "GOVERNMENT_SCHEME" -> RagCategory.GOVERNMENT_SCHEMES;
            default -> null;
        };
    }
}
