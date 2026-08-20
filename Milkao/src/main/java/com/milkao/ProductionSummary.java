package com.milkao;

import java.math.BigDecimal;

public class ProductionSummary {

    private Integer cowId;
    private BigDecimal latestLiters;
    private BigDecimal averageLiters;
    private BigDecimal lowestLiters;
    private BigDecimal dropPercentage;
    private Boolean alert;

    public ProductionSummary(
            Integer cowId,
            BigDecimal latestLiters,
            BigDecimal averageLiters,
            BigDecimal lowestLiters,
            BigDecimal dropPercentage,
            Boolean alert
    ) {
        this.cowId = cowId;
        this.latestLiters = latestLiters;
        this.averageLiters = averageLiters;
        this.lowestLiters = lowestLiters;
        this.dropPercentage = dropPercentage;
        this.alert = alert;
    }

    public Integer getCowId() {
        return cowId;
    }

    public BigDecimal getLatestLiters() {
        return latestLiters;
    }

    public BigDecimal getAverageLiters() {
        return averageLiters;
    }

    public BigDecimal getLowestLiters() {
        return lowestLiters;
    }
    public BigDecimal getDropPercentage() {
        return dropPercentage;
    }
    public Boolean getAlert() {
        return alert;
    }
}