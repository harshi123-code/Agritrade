package com.agritrade.repository;

import com.agritrade.model.TradeOrder;
import com.agritrade.model.OrderStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeOrderRepository extends JpaRepository<TradeOrder, Long> {
    List<TradeOrder> findByBuyerEmailOrFarmerEmailOrderByCreatedAtDesc(String buyerEmail, String farmerEmail);
    List<TradeOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);
}