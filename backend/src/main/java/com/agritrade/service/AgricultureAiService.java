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

    public AgricultureAiService(AiChatHistoryRepository history, RagDocumentRepository documents,
            UserAccountRepository users,
            @Value("${app.ai.api-key:}") String apiKey,
            @Value("${app.ai.model:gemini-3.5-flash-lite}") String model) {
        this.history = history;
        this.documents = documents;
        this.users = users;
        this.apiKey = apiKey;
        this.model = model;
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
                    "AgriAI is not configured. Set GEMINI_API_KEY on the backend to enable the assistant.");
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
        String systemPrompt = "You are AgriAI, a friendly, conversational assistant. Answer the user's actual question across general topics, and give special attention to AgriTrade and agriculture when relevant. "
                + "Use the conversation so far to understand follow-up questions and references. Give practical, clear answers. "
                + "When a useful recommendation depends on missing details, ask one concise follow-up question. "
                + "Use the reference context only when relevant. "
                + "Do not invent market prices, government benefits, pesticide dosages, or guaranteed outcomes. "
                + "Explain uncertainty and advise checking local agricultural extension guidance for safety-critical decisions. "
                + "The catalog entries below are metadata only; the PDF contents are not available. Do not treat titles or filenames as evidence, "
                + "and answer from general knowledge without claiming to have read or cited those documents.\n\n"
                + "Reference catalog metadata:\n" + context;
        Map<?, ?> result;
        try {
            List<Map<String, Object>> chatContents = new ArrayList<>();
            List<AiChatHistory> priorTurns = new ArrayList<>(history.findTop50ByUserIdOrderByCreatedAtDesc(userId));
            Collections.reverse(priorTurns);
            priorTurns.stream().skip(Math.max(0, priorTurns.size() - 8L)).forEach(turn -> {
                chatContents.add(geminiContent("user", turn.getQuestion()));
                chatContents.add(geminiContent("model", turn.getAnswer()));
            });
            chatContents.add(geminiContent("user", question));
            Map<String, Object> request = Map.of(
                    "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                    "contents", chatContents,
                    "generationConfig", Map.of("temperature", 0.4, "maxOutputTokens", 1024));
            result = RestClient.create().post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .body(request)
                    .retrieve().body(Map.class);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 401 || exception.getStatusCode().value() == 403) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Gemini rejected the configured key or model access. Check GEMINI_API_KEY and GEMINI_MODEL.");
            }
            if (exception.getStatusCode().value() == 429) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "Gemini is temporarily at its request limit. Please try again shortly.");
            }
            if (exception.getStatusCode().is4xxClientError() || exception.getStatusCode().is5xxServerError()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Gemini could not complete the request. Check the configured model and Google AI quota.");
            }
            throw exception;
        } catch (RestClientException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "AgriAI cannot reach Gemini right now. Please try again shortly.");
        }
        String answer = extractAnswer(result);
        history.save(new AiChatHistory(userId, question, answer));
        return new ChatResponse(answer, List.of(), true);
    }

    private Map<String, Object> geminiContent(String role, String text) {
        return Map.of("role", role, "parts", List.of(Map.of("text", text)));
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
            List<?> candidates = (List<?>) response.get("candidates");
            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) candidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            String answer = parts.stream()
                    .map(part -> (String) ((Map<?, ?>) part).get("text"))
                    .filter(text -> text != null && !text.isBlank())
                    .reduce((first, next) -> first + next)
                    .orElseThrow();
            return answer;
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini returned an empty or unexpected response.");
        }
    }
}
