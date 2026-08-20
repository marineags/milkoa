package com.milkao;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/milk-productions")
public class MilkProductionController {

    private final MilkProductionRepository milkProductionRepository;

    public MilkProductionController(MilkProductionRepository milkProductionRepository) {
        this.milkProductionRepository = milkProductionRepository;
    }

    @GetMapping
    public List<MilkProduction> getAllMilkProductions() {
        return milkProductionRepository.findAll();
    }
}