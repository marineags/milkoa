package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Integer> {

    boolean existsByCowIdAndTypeAndStatus(
            Integer cowId,
            String type,
            String status
    );
}