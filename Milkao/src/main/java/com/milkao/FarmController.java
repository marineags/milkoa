package com.milkao;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farms")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmController {

    private final FarmRepository farmRepository;

    public FarmController(FarmRepository farmRepository) {
        this.farmRepository = farmRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Farm> getFarmsByUser(@PathVariable Integer userId) {
        return farmRepository.findByUserId(userId);
    }
    @PostMapping
    public Farm createFarm(@RequestBody Farm farm) {
        return farmRepository.save(farm);
    }
}