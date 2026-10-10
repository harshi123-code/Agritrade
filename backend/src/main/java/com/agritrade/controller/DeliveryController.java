package com.agritrade.controller;

import com.agritrade.dto.UpdateDeliveryStatusRequest;
import com.agritrade.model.Delivery;
import com.agritrade.service.DeliveryService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliveries")
@PreAuthorize("hasRole('LOGISTICS')")
public class DeliveryController {
    private final DeliveryService service;
    public DeliveryController(DeliveryService service) { this.service = service; }
    @GetMapping
    public List<Delivery> findMine(Principal principal) { return service.findMine(principal.getName()); }
    @PostMapping("/orders/{orderId}/assign")
    public Delivery assign(Principal principal, @PathVariable Long orderId) { return service.assign(principal.getName(), orderId); }
    @PutMapping("/{id}/status")
    public Delivery update(Principal principal, @PathVariable Long id, @Valid @RequestBody UpdateDeliveryStatusRequest request) {
        return service.update(principal.getName(), id, request);
    }
}