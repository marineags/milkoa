package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportHistoryRepository
        extends JpaRepository<ImportHistory, Integer> {

    boolean existsByFileName(String fileName);
}