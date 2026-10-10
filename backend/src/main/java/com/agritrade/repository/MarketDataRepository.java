package com.agritrade.repository;

import com.agritrade.model.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketDataRepository extends JpaRepository<MarketData, Long> { }