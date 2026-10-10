package com.agritrade.service;

import com.agritrade.model.MarketData;
import com.agritrade.repository.MarketDataRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MarketDataService {
    private final MarketDataRepository repository;

    public MarketDataService(MarketDataRepository repository) { this.repository = repository; }
    public List<MarketData> findAll() { return repository.findAll(); }
}