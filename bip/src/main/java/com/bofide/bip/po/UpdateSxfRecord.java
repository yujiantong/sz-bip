package com.bofide.bip.po;

import java.util.Date;

public class UpdateSxfRecord {
	/**
	 * 自增id
	 */
	private Integer id;
	/**
	 * 4S店id
	 */
	private Integer storeId;
	/**
	 * 保险公司id
	 */
	private Integer insurerComId;
	/**
	 * 险种名称
	 */
	private String insuranceName;
	/**
	 * 修改前的手续费百分比
	 */
	private Float percentBefore;
	/**
	 * 修改后的手续费百分比
	 */
	private Float percentAfter;
	/**
	 * 修改人
	 */
	private String changer;
	/**
	 * 修改人Id
	 */
	private Integer changerId;
	/**
	 * 修改时间
	 */
	private Date changeTime;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getStoreId() {
		return storeId;
	}
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	public Integer getInsurerComId() {
		return insurerComId;
	}
	public void setInsurerComId(Integer insurerComId) {
		this.insurerComId = insurerComId;
	}
	public String getInsuranceName() {
		return insuranceName;
	}
	public void setInsuranceName(String insuranceName) {
		this.insuranceName = insuranceName;
	}
	public Float getPercentBefore() {
		return percentBefore;
	}
	public void setPercentBefore(Float percentBefore) {
		this.percentBefore = percentBefore;
	}
	public Float getPercentAfter() {
		return percentAfter;
	}
	public void setPercentAfter(Float percentAfter) {
		this.percentAfter = percentAfter;
	}
	public String getChanger() {
		return changer;
	}
	public void setChanger(String changer) {
		this.changer = changer;
	}
	public Integer getChangerId() {
		return changerId;
	}
	public void setChangerId(Integer changerId) {
		this.changerId = changerId;
	}
	public Date getChangeTime() {
		return changeTime;
	}
	public void setChangeTime(Date changeTime) {
		this.changeTime = changeTime;
	}
	@Override
	public String toString() {
		return "UpdateSxfRecord [id=" + id + ", storeId=" + storeId
				+ ", insurerComId=" + insurerComId + ", insuranceName="
				+ insuranceName + ", percentBefore=" + percentBefore
				+ ", percentAfter=" + percentAfter + ", changer=" + changer
				+ ", changerId=" + changerId + ", changeTime=" + changeTime
				+ "]";
	}
	
}
