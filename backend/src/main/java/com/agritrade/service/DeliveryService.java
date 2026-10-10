package com.agritrade.service;

import com.agritrade.dto.UpdateDeliveryStatusRequest;
import com.agritrade.model.Delivery;
import com.agritrade.model.DeliveryStatus;
import com.agritrade.model.OrderStatus;
import com.agritrade.repository.DeliveryRepository;
import com.agritrade.repository.TradeOrderRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveries;
    private final TradeOrderRepository orders;
    private final NotificationService notifications;

    public DeliveryService(DeliveryRepository deliveries, TradeOrderRepository orders, NotificationService notifications) {
        this.deliveries = deliveries;
        this.orders = orders;
        this.notifications = notifications;
    }

    public List<Delivery> findMine(String email) { return deliveries.findByLogisticsEmailOrderByIdDesc(email); }

    @Transactional
    public Delivery assign(String email, Long orderId) {
        var order = orders.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));
        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only accepted orders can be assigned for delivery.");
        }
        if (deliveries.existsByOrderId(orderId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This order already has a delivery assignment.");
        }
        order.setStatus(OrderStatus.ASSIGNED);
        orders.save(order);
        notifications.create(order.getFarmerEmail(), "DELIVERY_ASSIGNED", "A logistics partner accepted delivery " + orderId + ".");
        notifications.create(order.getBuyerEmail(), "DELIVERY_ASSIGNED", "A logistics partner has been assigned to your order.");
        return deliveries.save(new Delivery(order, email));
    }

    @Transactional
    public Delivery update(String email, Long id, UpdateDeliveryStatusRequest request) {
        Delivery delivery = deliveries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found."));
        if (!Objects.equals(delivery.getLogisticsEmail(), email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This delivery is assigned to another logistics account.");
        }
        DeliveryStatus current = delivery.getStatus();
        if (request.status().ordinal() != current.ordinal() + 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delivery statuses must be updated in order.");
        }
        delivery.setStatus(request.status());
        if (request.status() == DeliveryStatus.DELIVERED) {
            delivery.getOrder().setStatus(OrderStatus.DELIVERED);
            orders.save(delivery.getOrder());
            notifications.create(delivery.getOrder().getBuyerEmail(), "PRODUCE_DELIVERED", "Your crop order was delivered.");
            notifications.create(delivery.getOrder().getFarmerEmail(), "PRODUCE_DELIVERED", "Your crop order was delivered.");
        }
        return deliveries.save(delivery);
    }
}