package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Integer> {

    boolean existsByCowIdAndTypeAndStatus(
            Integer cowId,
            String type,
            String status
    );

    void deleteByCowIdIn(List<Integer> cowIds);
}