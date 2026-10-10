package com.agritrade.repository;

import com.agritrade.model.AiChatHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiChatHistoryRepository extends JpaRepository<AiChatHistory, Long> {
    List<AiChatHistory> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);
}
