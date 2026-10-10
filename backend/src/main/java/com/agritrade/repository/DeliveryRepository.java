package com.agritrade.repository;

import com.agritrade.model.Delivery;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByLogisticsEmailOrderByIdDesc(String logisticsEmail);
    boolean existsByOrderId(Long orderId);
}