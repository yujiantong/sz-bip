package com.bofide.bip.po;

public class TraceDaySet {
	
	 /**
     * id
     */
    private Integer traceSetId;

    /**
     * 4s店id
     */
    private Integer fourSStoreId;

    /**
     * 客户级别
     */
    private String customerLevel;
    
    /**
     * 天数
     */
    private Integer dayNumber;

	public Integer getFourSStoreId() {
		return fourSStoreId;
	}

	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}

	public String getCustomerLevel() {
		return customerLevel;
	}

	public void setCustomerLevel(String customerLevel) {
		this.customerLevel = customerLevel;
	}

	public Integer getDayNumber() {
		return dayNumber;
	}

	public void setDayNumber(Integer dayNumber) {
		this.dayNumber = dayNumber;
	}

	public Integer getTraceSetId() {
		return traceSetId;
	}

	public void setTraceSetId(Integer traceSetId) {
		this.traceSetId = traceSetId;
	}
    
}
