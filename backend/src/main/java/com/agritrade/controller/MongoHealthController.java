package com.agritrade.controller;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class MongoHealthController {
    private final MongoTemplate mongoTemplate;

    public MongoHealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/mongodb")
    public ResponseEntity<Map<String, String>> checkMongoConnection() {
        try {
            mongoTemplate.executeCommand("{ ping: 1 }");
            return ResponseEntity.ok(Map.of("status", "UP", "service", "MongoDB Atlas"));
        } catch (DataAccessException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "DOWN", "message",
                            "MongoDB is unreachable. Check MONGO_URL and the Atlas Network Access allowlist."));
        }
    }
}
