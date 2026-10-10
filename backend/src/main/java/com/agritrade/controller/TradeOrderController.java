package com.agritrade.controller;

import com.agritrade.dto.PlaceOrderRequest;
import com.agritrade.dto.UpdateOrderStatusRequest;
import com.agritrade.model.TradeOrder;
import com.agritrade.service.TradeOrderService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class TradeOrderController {
    private final TradeOrderService service;

    public TradeOrderController(TradeOrderService service) { this.service = service; }

    @GetMapping
    public List<TradeOrder> findMine(Principal principal) { return service.findFor(principal.getName()); }

    @GetMapping("/ready-for-delivery")
    @PreAuthorize("hasRole('LOGISTICS')")
    public List<TradeOrder> findReadyForDelivery() { return service.findReadyForDelivery(); }

    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    @ResponseStatus(HttpStatus.CREATED)
    public TradeOrder place(Principal principal, @Valid @RequestBody PlaceOrderRequest request) {
        return service.place(principal.getName(), request);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('FARMER')")
    public TradeOrder updateStatus(Principal principal, @PathVariable Long orderId,
                                   @Valid @RequestBody UpdateOrderStatusRequest request) {
        return service.updateStatus(principal.getName(), orderId, request);
    }
}