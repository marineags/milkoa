package com.milkao;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @PutMapping("/{id}/resolve")
    public Alert resolveAlert(@PathVariable Integer id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow();

        alert.setStatus("RESOLVED");
        alert.setResolvedAt(LocalDateTime.now());

        return alertRepository.save(alert);
    }
}