package com.bofide.bip.po;

import java.util.Date;

public class ReportData {
	private Integer id;
	private Integer xId;
	private String xName;
	private Integer yId;
	private String yName;
	private Integer stack;
	private String stackName;
	private Double value;
	private Date recordTime;
	private Integer storeId;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getxId() {
		return xId;
	}
	public void setxId(Integer xId) {
		this.xId = xId;
	}
	public String getxName() {
		return xName;
	}
	public void setxName(String xName) {
		this.xName = xName;
	}
	public Integer getyId() {
		return yId;
	}
	public void setyId(Integer yId) {
		this.yId = yId;
	}
	public String getyName() {
		return yName;
	}
	public void setyName(String yName) {
		this.yName = yName;
	}
	public Integer getStack() {
		return stack;
	}
	public void setStack(Integer stack) {
		this.stack = stack;
	}
	public String getStackName() {
		return stackName;
	}
	public void setStackName(String stackName) {
		this.stackName = stackName;
	}
	public Double getValue() {
		return value;
	}
	public void setValue(Double value) {
		this.value = value;
	}
	public Date getRecordTime() {
		return recordTime;
	}
	public void setRecordTime(Date recordTime) {
		this.recordTime = recordTime;
	}
	public Integer getStoreId() {
		return storeId;
	}
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	@Override
	public String toString() {
		return "ReportData [id=" + id + ", xId=" + xId + ", xName=" + xName
				+ ", yId=" + yId + ", yName=" + yName + ", stack=" + stack
				+ ", stackName=" + stackName + ", value=" + value
				+ ", recordTime=" + recordTime + ", storeId=" + storeId + "]";
	}
	
	
	
}
