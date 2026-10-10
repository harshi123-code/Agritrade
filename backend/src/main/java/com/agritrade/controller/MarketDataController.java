package com.agritrade.controller;

import com.agritrade.model.MarketData;
import com.agritrade.service.MarketDataService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/market-data")
public class MarketDataController {
    private final MarketDataService service;

    public MarketDataController(MarketDataService service) { this.service = service; }

    @GetMapping
    public List<MarketData> findAll() { return service.findAll(); }
}