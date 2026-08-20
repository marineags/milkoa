package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MilkProductionRepository extends JpaRepository<MilkProduction, Integer> {

    List<MilkProduction> findByCowIdOrderByProductionDateAsc(Integer cowId);

    boolean existsByCowIdAndProductionDate(
            Integer cowId,
            LocalDate productionDate
    );

    void deleteByImportId(Integer importId);
}