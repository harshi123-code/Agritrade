package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "market_data")
public class MarketData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "crop_name")
    private String crop;
    @Column(name = "market_name")
    private String market;
    private String location;
    @Column(name = "market_price")
    private BigDecimal currentPrice;
    @Column(name = "demand_level")
    private String demand;
    @Column(name = "recorded_date")
    private LocalDate priceDate;

    protected MarketData() { }

    public MarketData(String crop, String market, String location, BigDecimal currentPrice, String demand, LocalDate priceDate, boolean sampleData) {
        this.crop = crop;
        this.market = market;
        this.location = location;
        this.currentPrice = currentPrice;
        this.demand = demand;
        this.priceDate = priceDate;
    }

    public Long getId() { return id; }
    public String getCrop() { return crop; }
    public String getMarket() { return market; }
    public String getLocation() { return location; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public String getDemand() { return demand; }
    public LocalDate getPriceDate() { return priceDate; }
    public boolean isSampleData() { return true; }
    public String getSourceType() { return "SAMPLE"; }
}