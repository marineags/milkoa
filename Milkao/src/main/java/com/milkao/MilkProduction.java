package com.milkao;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "milk_productions")
public class MilkProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cow_id")
    private Integer cowId;

    @Column(name = "production_date")
    private LocalDate productionDate;

    private BigDecimal liters;

    @Column(name = "import_id")
    private Integer importId;

    public MilkProduction() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCowId() {
        return cowId;
    }

    public void setCowId(Integer cowId) {
        this.cowId = cowId;
    }

    public LocalDate getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(LocalDate productionDate) {
        this.productionDate = productionDate;
    }

    public BigDecimal getLiters() {
        return liters;
    }

    public void setLiters(BigDecimal liters) {
        this.liters = liters;
    }
    public Integer getImportId() {
        return importId;
    }

    public void setImportId(Integer importId) {
        this.importId = importId;
    }
}