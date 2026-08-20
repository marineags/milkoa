package com.milkao;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cows")
public class Cow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "import_id")
    private Integer importId;

    @Column(name = "farm_id")
    private Integer farmId;

    private String identifier;

    private String name;

    @Column(name = "lactation_number")
    private Integer lactationNumber;

    @Column(name = "lactation_days")
    private Integer lactationDays;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Cow() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFarmId() {
        return farmId;
    }

    public void setFarmId(Integer farmId) {
        this.farmId = farmId;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLactationNumber() {
        return lactationNumber;
    }

    public void setLactationNumber(Integer lactationNumber) {
        this.lactationNumber = lactationNumber;
    }

    public Integer getLactationDays() {
        return lactationDays;
    }

    public void setLactationDays(Integer lactationDays) {
        this.lactationDays = lactationDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getImportId() {
        return importId;
    }

    public void setImportId(Integer importId) {
        this.importId = importId;
    }
}