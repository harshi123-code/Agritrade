package com.agritrade.controller;

import com.agritrade.dto.ChatRequest;
import com.agritrade.dto.ChatResponse;
import com.agritrade.model.AiChatHistory;
import com.agritrade.service.AgricultureAiService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AgricultureAiController {
    private final AgricultureAiService service;

    public AgricultureAiController(AgricultureAiService service) { this.service = service; }

    @PostMapping("/chat")
    public ChatResponse ask(Principal principal, @Valid @RequestBody ChatRequest request) {
        return service.ask(principal.getName(), request.question().trim());
    }

    @GetMapping("/history")
    public List<AiChatHistory> history(Principal principal) { return service.historyFor(principal.getName()); }
}