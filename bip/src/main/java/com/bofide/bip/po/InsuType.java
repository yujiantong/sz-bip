package com.bofide.bip.po;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class InsuType {
	/**
	 * 自增id
	 */
	private Integer id;
	/**
	 * 4s店ID
	 */
	private Integer storeId;
	/**
	 * 保单或者审批单ID
	 */
	private Integer insuId;
	/**
	 * 险种名称
	 */
	private String typeName;
	/**
	 * 保额
	 */
	private Double coverage;
	/**
	 * 1表示保单，2表示审批单
	 */
	private Integer type;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getInsuId() {
		return insuId;
	}

	public void setInsuId(Integer insuId) {
		this.insuId = insuId;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Double getCoverage() {
		return coverage;
	}

	public void setCoverage(Double coverage) {
		this.coverage = coverage;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	@Override
	public String toString() {
		return "InsuType [id=" + id + ", storeId=" + storeId + ", insuId="
				+ insuId + ", typeName=" + typeName + ", coverage=" + coverage
				+ ", type=" + type + "]";
	}

}
