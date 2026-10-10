package com.agritrade.service;

import com.agritrade.dto.PlaceOrderRequest;
import com.agritrade.dto.UpdateOrderStatusRequest;
import com.agritrade.model.OrderStatus;
import com.agritrade.model.TradeOrder;
import com.agritrade.repository.CropListingRepository;
import com.agritrade.repository.TradeOrderRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TradeOrderService {
    private final TradeOrderRepository orders;
    private final CropListingRepository crops;
    private final NotificationService notifications;

    public TradeOrderService(TradeOrderRepository orders, CropListingRepository crops, NotificationService notifications) {
        this.orders = orders;
        this.crops = crops;
        this.notifications = notifications;
    }

    @Transactional
    public TradeOrder place(String buyerEmail, PlaceOrderRequest request) {
        var crop = crops.findById(request.produceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produce listing not found."));
        if (Objects.equals(crop.getFarmerEmail(), buyerEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot order your own listing.");
        }
        if (request.quantity().compareTo(crop.getQuantity()) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order quantity exceeds available produce.");
        }
        crop.setQuantity(crop.getQuantity().subtract(request.quantity()));
        crops.save(crop);
        TradeOrder order = orders.save(new TradeOrder(crop, buyerEmail, crop.getFarmerEmail(), request.quantity()));
        notifications.create(crop.getFarmerEmail(), "NEW_BUYER_ORDER", "A buyer placed an order for " + crop.getCropName() + ".");
        return order;
    }

    public List<TradeOrder> findFor(String email) {
        return orders.findByBuyerEmailOrFarmerEmailOrderByCreatedAtDesc(email, email);
    }

    public List<TradeOrder> findReadyForDelivery() {
        return orders.findByStatusOrderByCreatedAtDesc(OrderStatus.ACCEPTED);
    }

    @Transactional
    public TradeOrder updateStatus(String email, Long orderId, UpdateOrderStatusRequest request) {
        TradeOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));
        if (!Objects.equals(order.getFarmerEmail(), email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the listing farmer can update this order.");
        }
        if (order.getStatus() != OrderStatus.PLACED || (request.status() != OrderStatus.ACCEPTED && request.status() != OrderStatus.REJECTED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A new order can only be accepted or rejected.");
        }
        if (request.status() == OrderStatus.REJECTED) {
            var crop = order.getProduce();
            crop.setQuantity(crop.getQuantity().add(order.getQuantity()));
            crops.save(crop);
        }
        order.setStatus(request.status());
        TradeOrder savedOrder = orders.save(order);
        String notificationType = request.status() == OrderStatus.ACCEPTED ? "ORDER_ACCEPTED" : "ORDER_REJECTED";
        String notificationMessage = request.status() == OrderStatus.ACCEPTED
            ? "The farmer accepted your order for " + order.getProduce().getCropName() + "."
            : "The farmer rejected your order for " + order.getProduce().getCropName() + ".";
        notifications.create(order.getBuyerEmail(), notificationType, notificationMessage);
        return savedOrder;
    }
}