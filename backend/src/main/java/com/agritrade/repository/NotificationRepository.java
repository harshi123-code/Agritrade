package com.agritrade.repository;

import com.agritrade.model.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    long countByUserEmailAndReadFalse(String userEmail);
}