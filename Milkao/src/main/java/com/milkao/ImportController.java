package com.milkao;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;

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

    public ImportController(
            MilkProductionRepository milkProductionRepository,
            ImportHistoryRepository importHistoryRepository,
            FeedCostRepository feedCostRepository,
            CowRepository cowRepository
    ) {
        this.milkProductionRepository = milkProductionRepository;
        this.importHistoryRepository = importHistoryRepository;
        this.feedCostRepository = feedCostRepository;
        this.cowRepository = cowRepository;
    }

    @PostMapping("/production")
    public ResponseEntity<String> importProduction(
            @RequestParam("file") MultipartFile file
    ) {
        try {

            if (importHistoryRepository.existsByFileName(file.getOriginalFilename())) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé.");
            }

            // 1. On crée d'abord l'historique de l'import
            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Production");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");

            history = importHistoryRepository.save(history);

            Integer importId = history.getId();

            // 2. On lit le fichier
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

                // 3. On évite les doublons
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

                    // 4. On relie la production à son import
                    production.setImportId(importId);

                    milkProductionRepository.save(production);
                }
            }

            return ResponseEntity.ok(
                    "Import terminé avec succès"
            );

        } catch (Exception error) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Erreur pendant l'import : "
                                    + error.getMessage()
                    );
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        return ResponseEntity.ok(
                importHistoryRepository.findAll()
        );
    }

    @PostMapping("/feeding")
    public ResponseEntity<String> importFeeding(
            @RequestParam("file") MultipartFile file
    ) {
        try {

            if (importHistoryRepository.existsByFileName(file.getOriginalFilename())) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé.");
            }

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

                Long cowId = Long.parseLong(values[0].trim());

                LocalDate costDate =
                        LocalDate.parse(values[1].trim());

                BigDecimal amount =
                        new BigDecimal(values[2].trim());

                FeedCost feedCost = new FeedCost();

                feedCost.setCowId(cowId);
                feedCost.setCostDate(costDate);
                feedCost.setAmount(amount);

                feedCostRepository.save(feedCost);
            }

            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Alimentation");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");

            importHistoryRepository.save(history);

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
    @PostMapping("/cows")
    public ResponseEntity<String> importCows(
            @RequestParam("file") MultipartFile file
    ) {
        try {

            if (importHistoryRepository.existsByFileName(file.getOriginalFilename())) {
                return ResponseEntity
                        .badRequest()
                        .body("Ce fichier a déjà été importé.");
            }

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

                Integer farmId =
                        Integer.parseInt(values[0].trim());

                String identifier =
                        values[1].trim();

                String name =
                        values[2].trim();

                Integer lactationNumber =
                        Integer.parseInt(values[3].trim());

                Integer lactationDays =
                        Integer.parseInt(values[4].trim());

                String status =
                        values[5].trim();

                Cow cow = new Cow();

                cow.setFarmId(farmId);
                cow.setIdentifier(identifier);
                cow.setName(name);
                cow.setLactationNumber(lactationNumber);
                cow.setLactationDays(lactationDays);
                cow.setStatus(status);
                cow.setCreatedAt(java.time.LocalDateTime.now());

                cowRepository.save(cow);
            }

            ImportHistory history = new ImportHistory();

            history.setFileName(file.getOriginalFilename());
            history.setType("Vaches");
            history.setImportDate(java.time.LocalDateTime.now());
            history.setStatus("Importé");

            importHistoryRepository.save(history);

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
    @GetMapping("/production")
    public ResponseEntity<?> getProductions() {
        return ResponseEntity.ok(
                milkProductionRepository.findAll()
        );
    }
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImport(@PathVariable Integer id) {
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
