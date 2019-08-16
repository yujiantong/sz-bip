package com.bofide.bip.po;

import java.io.Serializable;

/**
 * 险种手续费实体bean
 * @author Bao
 *
 */
public class Factorage implements Serializable{
	
	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * 手续费Id
     */
    private Integer factorageId;

    /**
     * 4S店Id
     */
    private Integer storeId;
    /**
     * 关联保险公司主id
     */
    private Integer compPreId;

    /**
     * 险种名称
     */
    private String insuName;
    
    /**
     * 手续费百分比
     */
    private Float insuPercent;

	public Integer getCompPreId() {
		return compPreId;
	}

	public void setCompPreId(Integer compPreId) {
		this.compPreId = compPreId;
	}

	public String getInsuName() {
		return insuName;
	}

	public void setInsuName(String insuName) {
		this.insuName = insuName;
	}

	public Float getInsuPercent() {
		return insuPercent;
	}

	public void setInsuPercent(Float insuPercent) {
		this.insuPercent = insuPercent;
	}

	public Integer getFactorageId() {
		return factorageId;
	}

	public void setFactorageId(Integer factorageId) {
		this.factorageId = factorageId;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	@Override
	public String toString() {
		return "Factorage [factorageId=" + factorageId + ", storeId=" + storeId
				+ ", compPreId=" + compPreId + ", insuName=" + insuName
				+ ", insuPercent=" + insuPercent + "]";
	}
	
}
