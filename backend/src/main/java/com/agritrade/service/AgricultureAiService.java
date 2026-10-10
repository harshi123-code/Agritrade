package com.agritrade.service;

import com.agritrade.dto.ChatResponse;
import com.agritrade.model.AiChatHistory;
import com.agritrade.model.RagDocument;
import com.agritrade.repository.UserAccountRepository;
import com.agritrade.repository.AiChatHistoryRepository;
import com.agritrade.repository.RagDocumentRepository;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AgricultureAiService {
    private final AiChatHistoryRepository history;
    private final RagDocumentRepository documents;
    private final UserAccountRepository users;
    private final String apiKey;
    private final String model;
    private final String baseUrl;

    public AgricultureAiService(AiChatHistoryRepository history, RagDocumentRepository documents,
            UserAccountRepository users,
            @Value("${app.ai.api-key:}") String apiKey,
            @Value("${app.ai.model:gpt-4o-mini}") String model,
            @Value("${app.ai.base-url:https://api.openai.com/v1}") String baseUrl) {
        this.history = history;
        this.documents = documents;
        this.users = users;
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
    }

    public List<AiChatHistory> historyFor(String email) {
        return users.findByEmail(email)
                .map(user -> {
                    List<AiChatHistory> items = new ArrayList<>(history.findTop50ByUserIdOrderByCreatedAtDesc(user.getId()));
                    Collections.reverse(items);
                    return items;
                })
                .orElseGet(List::of);
    }

    public ChatResponse ask(String email, String question) {
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AgriAI is not configured. Set APP_AI_API_KEY to enable the assistant.");
        }
        Long userId = users.findByEmail(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Your AgriTrade account could not be found. Please sign in again."));
        List<RagDocument> relevantDocuments = findRelevantDocuments(question);
        String context = relevantDocuments.stream()
                .map(document -> "Document catalog entry: " + document.getTitle() + " ("
                        + document.getCategory() + ", " + document.getSource() + ")")
                .reduce((first, second) -> first + "\n" + second)
                .orElse("No matching agricultural document records are available.");
        String systemPrompt = "You are AgriAI, a friendly, conversational agricultural assistant. Use the conversation so far to understand follow-up questions and references. "
                + "Give practical, clear steps. When a useful recommendation depends on missing details, ask one concise follow-up question. "
                + "Use the reference context when relevant. "
                + "Do not invent market prices, government benefits, pesticide dosages, or guaranteed outcomes. "
                + "Explain uncertainty and advise checking local agricultural extension guidance for safety-critical decisions. "
                + "The catalog entries below are metadata only; the PDF contents are not available. Do not treat titles or filenames as evidence, "
                + "and answer from general knowledge without claiming to have read or cited those documents.\n\n"
                + "Reference catalog metadata:\n" + context;
        Map<?, ?> result;
        try {
            List<Map<String, String>> chatMessages = new ArrayList<>();
            chatMessages.add(Map.of("role", "system", "content", systemPrompt));
            List<AiChatHistory> priorTurns = new ArrayList<>(history.findTop50ByUserIdOrderByCreatedAtDesc(userId));
            Collections.reverse(priorTurns);
            priorTurns.stream().skip(Math.max(0, priorTurns.size() - 8L)).forEach(turn -> {
                chatMessages.add(Map.of("role", "user", "content", turn.getQuestion()));
                chatMessages.add(Map.of("role", "assistant", "content", turn.getAnswer()));
            });
            chatMessages.add(Map.of("role", "user", "content", question));
            result = RestClient.create().post().uri(baseUrl + "/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .body(Map.of("model", model, "temperature", 0.4, "messages", chatMessages))
                    .retrieve().body(Map.class);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 403) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The configured AI provider denied AgriAI access. Check APP_AI_API_KEY and APP_AI_BASE_URL.");
            }
            if (exception.getStatusCode().is4xxClientError() || exception.getStatusCode().is5xxServerError()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The configured AI provider could not complete the request. Check its connection and model settings.");
            }
            throw exception;
        } catch (RestClientException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "AgriAI cannot reach the configured AI provider. Check APP_AI_BASE_URL and make sure the provider is running.");
        }
        String answer = extractAnswer(result);
        history.save(new AiChatHistory(userId, question, answer));
        return new ChatResponse(answer, List.of(), true);
    }

    private List<RagDocument> findRelevantDocuments(String question) {
        List<String> terms = List.of(question.toLowerCase().split("\\W+")).stream().filter(term -> term.length() > 3).toList();
        return documents.findAll().stream()
                .sorted(Comparator.comparingInt((RagDocument document) -> relevance(document, terms)).reversed())
                .filter(document -> relevance(document, terms) > 0)
                .limit(3).toList();
    }

    private int relevance(RagDocument document, List<String> terms) {
        String text = (document.getTitle() + " " + document.getCategory() + " " + document.getSource() + " "
                + document.getFilePath()).toLowerCase();
        return (int) terms.stream().filter(text::contains).count();
    }

    private String extractAnswer(Map<?, ?> response) {
        try {
            List<?> choices = (List<?>) response.get("choices");
            Map<?, ?> choice = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            return (String) message.get("content");
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AgriAI returned an unexpected response.");
        }
    }
}
