package com.agritrade.controller;

import com.agritrade.dto.CreateCropListingRequest;
import com.agritrade.model.CropListing;
import com.agritrade.service.CropListingService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crops")
public class CropListingController {
    private final CropListingService service;
    public CropListingController(CropListingService service) { this.service = service; }

    @GetMapping
    public List<CropListing> findAll() { return service.findAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CropListing create(Principal principal, @Valid @RequestBody CreateCropListingRequest request) {
        return service.create(request, principal.getName());
    }
}