package com.milkao;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/imports")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class ImportController {

    private final MilkProductionRepository milkProductionRepository;
    private final ImportHistoryRepository importHistoryRepository;
    private final FeedCostRepository feedCostRepository;
    private final CowRepository cowRepository;
    private final AlertRepository alertRepository;

    public ImportController(
            MilkProductionRepository milkProductionRepository,
            ImportHistoryRepository importHistoryRepository,
            FeedCostRepository feedCostRepository,
            CowRepository cowRepository,
            AlertRepository alertRepository
    ) {
        this.milkProductionRepository = milkProductionRepository;
        this.importHistoryRepository = importHistoryRepository;
        this.feedCostRepository = feedCostRepository;
        this.cowRepository = cowRepository;
        this.alertRepository = alertRepository;
    }

    // =========================
    // IMPORT PRODUCTION
    // =========================

    @PostMapping("/production")
    public ResponseEntity<String> importProduction(
            @RequestParam("file") MultipartFile file,
            @RequestParam("farmId") Integer farmId
    ) {
        try {

            if (importHistoryRepository.existsByFileNameAndFarmId(
                    file.getOriginalFilename(),
                    farmId
            )) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé pour cette ferme.");
            }

            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Production");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");
            history.setFarmId(farmId);

            history = importHistoryRepository.save(history);

            Integer importId = history.getId();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                if (line.isBlank()) {
                    continue;
                }

                String[] values = line.split(",");

                Integer cowId =
                        Integer.parseInt(values[0].trim());

                LocalDate productionDate =
                        LocalDate.parse(values[1].trim());

                BigDecimal liters =
                        new BigDecimal(values[2].trim());

                if (!milkProductionRepository
                        .existsByCowIdAndProductionDate(
                                cowId,
                                productionDate
                        )) {

                    MilkProduction production =
                            new MilkProduction();

                    production.setCowId(cowId);
                    production.setProductionDate(productionDate);
                    production.setLiters(liters);
                    production.setImportId(importId);

                    milkProductionRepository.save(production);
                }
            }

            return ResponseEntity.ok(
                    "Import production terminé avec succès"
            );

        } catch (Exception error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Erreur pendant l'import production : "
                                    + error.getMessage()
                    );
        }
    }

    // =========================
    // IMPORT ALIMENTATION
    // =========================

    @PostMapping("/feeding")
    public ResponseEntity<String> importFeeding(
            @RequestParam("file") MultipartFile file,
            @RequestParam("farmId") Integer farmId
    ) {
        try {

            if (importHistoryRepository.existsByFileNameAndFarmId(
                    file.getOriginalFilename(),
                    farmId
            )) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé pour cette ferme.");
            }

            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Alimentation");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");
            history.setFarmId(farmId);

            history = importHistoryRepository.save(history);

            Integer importId = history.getId();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                if (line.isBlank()) {
                    continue;
                }

                String[] values = line.split(",");

                Long cowId =
                        Long.parseLong(values[0].trim());

                LocalDate costDate =
                        LocalDate.parse(values[1].trim());

                BigDecimal amount =
                        new BigDecimal(values[2].trim());

                FeedCost feedCost = new FeedCost();

                feedCost.setCowId(cowId);
                feedCost.setCostDate(costDate);
                feedCost.setAmount(amount);
                feedCost.setImportId(importId);

                feedCostRepository.save(feedCost);
            }

            return ResponseEntity.ok(
                    "Import alimentation terminé avec succès"
            );

        } catch (Exception error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Erreur pendant l'import alimentation : "
                                    + error.getMessage()
                    );
        }
    }

    // =========================
    // IMPORT VACHES
    // =========================

    @PostMapping("/cows")
    public ResponseEntity<String> importCows(
            @RequestParam("file") MultipartFile file,
            @RequestParam("farmId") Integer farmId
    ) {
        try {

            if (importHistoryRepository.existsByFileNameAndFarmId(
                    file.getOriginalFilename(),
                    farmId
            )) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé pour cette ferme.");
            }

            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Vaches");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");
            history.setFarmId(farmId);

            history = importHistoryRepository.save(history);

            Integer importId = history.getId();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream())
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                if (line.isBlank()) {
                    continue;
                }

                String[] values = line.split(",");

                String identifier =
                        values[0].trim();

                String name =
                        values[1].trim();

                Integer lactationNumber =
                        Integer.parseInt(values[2].trim());

                Integer lactationDays =
                        Integer.parseInt(values[3].trim());

                String status =
                        values[4].trim();

                Cow cow = new Cow();

                cow.setFarmId(farmId);
                cow.setIdentifier(identifier);
                cow.setName(name);
                cow.setLactationNumber(lactationNumber);
                cow.setLactationDays(lactationDays);
                cow.setStatus(status);
                cow.setCreatedAt(java.time.LocalDateTime.now());
                cow.setImportId(importId);

                cowRepository.save(cow);
            }

            return ResponseEntity.ok(
                    "Import des vaches terminé avec succès"
            );

        } catch (Exception error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Erreur pendant l'import des vaches : "
                                    + error.getMessage()
                    );
        }
    }

    // =========================
    // HISTORIQUE PAR FERME
    // =========================

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam("farmId") Integer farmId
    ) {
        return ResponseEntity.ok(
                importHistoryRepository
                        .findByFarmIdOrderByImportDateDesc(farmId)
        );
    }

    // =========================
    // PRODUCTIONS
    // =========================

    @GetMapping("/production")
    public ResponseEntity<?> getProductions() {
        return ResponseEntity.ok(
                milkProductionRepository.findAll()
        );
    }

    // =========================
    // SUPPRESSION D'UN IMPORT
    // =========================

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImport(
            @PathVariable Integer id
    ) {
        try {

            ImportHistory history = importHistoryRepository
                    .findById(id)
                    .orElse(null);

            if (history == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            if ("Production".equals(history.getType())) {
                milkProductionRepository.deleteByImportId(id);
            }

            if ("Alimentation".equals(history.getType())) {
                feedCostRepository.deleteByImportId(id);
            }

            if ("Vaches".equals(history.getType())) {

                List<Cow> cowsToDelete =
                        cowRepository.findByImportId(id);

                List<Integer> cowIds = cowsToDelete
                        .stream()
                        .map(Cow::getId)
                        .toList();

                if (!cowIds.isEmpty()) {
                    alertRepository.deleteByCowIdIn(cowIds);
                }

                cowRepository.deleteByImportId(id);
            }

            importHistoryRepository.deleteById(id);

            return ResponseEntity.ok(
                    "Import supprimé avec succès"
            );

        } catch (Exception error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Erreur pendant la suppression : "
                                    + error.getMessage()
                    );
        }
    }
}