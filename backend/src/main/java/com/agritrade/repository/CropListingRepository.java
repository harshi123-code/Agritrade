package com.agritrade.repository;

import com.agritrade.model.CropListing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropListingRepository extends JpaRepository<CropListing, Long> {
}