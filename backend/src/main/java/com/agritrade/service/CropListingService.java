package com.agritrade.service;

import com.agritrade.dto.CreateCropListingRequest;
import com.agritrade.model.CropListing;
import com.agritrade.repository.CropListingRepository;
import com.agritrade.repository.UserAccountRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CropListingService {
    private final CropListingRepository repository;
    private final UserAccountRepository users;

    public CropListingService(CropListingRepository repository, UserAccountRepository users) {
        this.repository = repository;
        this.users = users;
    }

    public List<CropListing> findAll() {
        return repository.findAll();
    }

    public CropListing create(CreateCropListingRequest request, String farmerEmail) {
        CropListing listing = new CropListing(request.cropName().trim(), request.quantity(), request.unit(),
                request.pricePerUnit(), request.location().trim(), request.farmerName().trim());
        listing.setFarmer(users.findByEmail(farmerEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Farmer account was not found.")));
        return repository.save(listing);
    }
}