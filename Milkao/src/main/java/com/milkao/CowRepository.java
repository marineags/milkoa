package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CowRepository extends JpaRepository<Cow, Integer> {

    List<Cow> findByImportId(Integer importId);

    void deleteByImportId(Integer importId);
}