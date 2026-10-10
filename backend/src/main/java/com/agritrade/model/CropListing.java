package com.agritrade.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "produce")
public class CropListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max = 80)
    @Column(name = "crop_name")
    private String cropName;
    @DecimalMin("0.01")
    @Column(name = "available_quantity")
    private BigDecimal quantity;
    @NotBlank @Size(max = 20)
    private String unit;
    @DecimalMin("0.01")
    @Column(name = "expected_price")
    private BigDecimal pricePerUnit;
    @NotBlank @Size(max = 120)
    private String location;
    @NotBlank @Size(max = 100)
    @Transient
    private String farmerName;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private UserAccount farmer;

    protected CropListing() { }

    public CropListing(String cropName, BigDecimal quantity, String unit, BigDecimal pricePerUnit, String location, String farmerName) {
        this.cropName = cropName;
        this.quantity = quantity;
        this.unit = unit;
        this.pricePerUnit = pricePerUnit;
        this.location = location;
        this.farmerName = farmerName;
    }

    public void setFarmer(UserAccount farmer) { this.farmer = farmer; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public Long getId() { return id; }
    public String getCropName() { return cropName; }
    public BigDecimal getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public String getLocation() { return location; }
    public String getFarmerName() { return farmer != null ? farmer.getName() : farmerName; }
    @JsonIgnore
    public String getFarmerEmail() { return farmer == null ? null : farmer.getEmail(); }
    @JsonIgnore
    public UserAccount getFarmer() { return farmer; }
}