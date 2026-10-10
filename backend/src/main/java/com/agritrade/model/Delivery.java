package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "deliveries")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    private TradeOrder order;
    private String logisticsEmail;
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    protected Delivery() { }

    public Delivery(TradeOrder order, String logisticsEmail) {
        this.order = order;
        this.logisticsEmail = logisticsEmail;
        this.status = DeliveryStatus.ASSIGNED;
    }

    public Long getId() { return id; }
    public TradeOrder getOrder() { return order; }
    public String getLogisticsEmail() { return logisticsEmail; }
    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }
}