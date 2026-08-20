package com.milkao;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})

@RestController
@RequestMapping("/cows")
public class CowController {

    private final CowRepository cowRepository;
    private final MilkProductionRepository milkProductionRepository;
    private final AlertRepository alertRepository;


    public CowController(
            CowRepository cowRepository,
            MilkProductionRepository milkProductionRepository,
            AlertRepository alertRepository
    ) {
        this.cowRepository = cowRepository;
        this.milkProductionRepository = milkProductionRepository;
        this.alertRepository = alertRepository;
    }

    @GetMapping
    public List<Cow> getAllCows() {
        return cowRepository.findAll();
    }
    @GetMapping("/{id}/milk-productions")
    public List<MilkProduction> getMilkProductions(@PathVariable Integer id) {
        return milkProductionRepository.findByCowIdOrderByProductionDateAsc(id);
    }
    @GetMapping("/{id}/production-summary")
    public ProductionSummary getProductionSummary(@PathVariable Integer id) {

        List<MilkProduction> productions =
                milkProductionRepository.findByCowIdOrderByProductionDateAsc(id);

        if (productions.isEmpty()) {
            return new ProductionSummary(
                    id,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    false
            );
        }

        if (productions.size() == 1) {
            BigDecimal onlyProduction = productions.get(0).getLiters();

            return new ProductionSummary(
                    id,
                    onlyProduction,
                    BigDecimal.ZERO,
                    onlyProduction,
                    BigDecimal.ZERO,
                    false
            );
        }

        BigDecimal latestLiters = productions
                .get(productions.size() - 1)
                .getLiters();

        int latestIndex = productions.size() - 1;
        int startIndex = Math.max(0, latestIndex - 7);

        List<MilkProduction> previousProductions =
                productions.subList(startIndex, latestIndex);

        BigDecimal averageLiters = previousProductions.stream()
                .map(MilkProduction::getLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(
                        BigDecimal.valueOf(previousProductions.size()),
                        2,
                        java.math.RoundingMode.HALF_UP
                );

        BigDecimal lowestLiters = previousProductions.stream()
                .map(MilkProduction::getLiters)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        BigDecimal dropPercentage = averageLiters
                .subtract(latestLiters)
                .divide(
                        averageLiters,
                        4,
                        java.math.RoundingMode.HALF_UP
                )
                .multiply(BigDecimal.valueOf(100));

        boolean alert =
                dropPercentage.compareTo(BigDecimal.valueOf(20)) >= 0;

        if (alert) {

            boolean alreadyExists =
                    alertRepository.existsByCowIdAndTypeAndStatus(
                            id,
                            "PRODUCTION",
                            "OPEN"
                    );

            if (!alreadyExists) {
                Alert newAlert = new Alert();

                newAlert.setCowId(id);
                newAlert.setType("PRODUCTION");
                newAlert.setSeverity("URGENT");
                newAlert.setTitle("Baisse de production");
                newAlert.setMessage(
                        "Baisse de production de " + dropPercentage + " %"
                );
                newAlert.setStatus("OPEN");
                newAlert.setDetectedAt(LocalDateTime.now());

                alertRepository.save(newAlert);
            }
        }

        return new ProductionSummary(
                id,
                latestLiters,
                averageLiters,
                lowestLiters,
                dropPercentage,
                alert
        );
    }

}