package com.agritrade.dto;

import com.agritrade.model.UserRole;

public record AuthResponse(String token, Long userId, String name, String email, UserRole role) { }