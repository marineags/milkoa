package com.milkao;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Integer> {

    List<Farm> findByUserId(Integer userId);
}