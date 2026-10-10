package com.agritrade.service;

import com.agritrade.model.Notification;
import com.agritrade.repository.NotificationRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {
    private final NotificationRepository repository;
    public NotificationService(NotificationRepository repository) { this.repository = repository; }
    public void create(String email, String type, String message) { repository.save(new Notification(email, type, message)); }
    public List<Notification> findFor(String email) { return repository.findByUserEmailOrderByCreatedAtDesc(email); }
    public long unreadCount(String email) { return repository.countByUserEmailAndReadFalse(email); }

    @Transactional
    public Notification markRead(String email, Long id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));
        if (!notification.getUserEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This notification belongs to another account.");
        }
        notification.markRead();
        return repository.save(notification);
    }
}