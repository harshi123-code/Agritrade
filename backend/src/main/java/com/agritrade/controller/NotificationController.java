package com.agritrade.controller;

import com.agritrade.model.Notification;
import com.agritrade.service.NotificationService;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;
    public NotificationController(NotificationService service) { this.service = service; }
    @GetMapping
    public List<Notification> findMine(Principal principal) { return service.findFor(principal.getName()); }
    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Principal principal) { return Map.of("count", service.unreadCount(principal.getName())); }
    @PutMapping("/{id}/read")
    public Notification markRead(Principal principal, @PathVariable Long id) { return service.markRead(principal.getName(), id); }
}