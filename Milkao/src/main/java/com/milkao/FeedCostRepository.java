package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedCostRepository extends JpaRepository<FeedCost, Long> {

    void deleteByImportId(Integer importId);
}