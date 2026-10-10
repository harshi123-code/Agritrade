package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class TradeOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    private CropListing produce;
    private String buyerEmail;
    private String farmerEmail;
    private BigDecimal quantity;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Instant createdAt;

    protected TradeOrder() { }

    public TradeOrder(CropListing produce, String buyerEmail, String farmerEmail, BigDecimal quantity) {
        this.produce = produce;
        this.buyerEmail = buyerEmail;
        this.farmerEmail = farmerEmail;
        this.quantity = quantity;
        this.status = OrderStatus.PLACED;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public CropListing getProduce() { return produce; }
    public String getBuyerEmail() { return buyerEmail; }
    public String getFarmerEmail() { return farmerEmail; }
    public BigDecimal getQuantity() { return quantity; }
    public OrderStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setStatus(OrderStatus status) { this.status = status; }
}