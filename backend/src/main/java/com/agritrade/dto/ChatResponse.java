package com.agritrade.dto;

import java.util.List;

public record ChatResponse(String answer, List<String> sources, boolean liveAi) { }