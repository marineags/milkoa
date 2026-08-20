package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportHistoryRepository
        extends JpaRepository<ImportHistory, Integer> {

    boolean existsByFileNameAndFarmId(
            String fileName,
            Integer farmId
    );

    List<ImportHistory> findByFarmIdOrderByImportDateDesc(
            Integer farmId
    );
}