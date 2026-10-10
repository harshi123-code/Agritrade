package com.agritrade.service;

import com.agritrade.model.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final Key signingKey;

    public JwtService(@Value("${app.jwt.secret:}") String configuredSecret) {
        if (configuredSecret.isBlank()) {
            throw new IllegalStateException("APP_JWT_SECRET must be configured with a Base64-encoded key.");
        } else {
            signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(configuredSecret));
        }
    }

    public String createToken(UserAccount user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(60 * 60 * 12)))
                .signWith(signingKey)
                .compact();
    }

    public Claims readClaims(String token) {
        return Jwts.parser().verifyWith((javax.crypto.SecretKey) signingKey).build()
                .parseSignedClaims(token).getPayload();
    }
}
