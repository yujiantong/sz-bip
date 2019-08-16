package com.bofide.bip.po;

import java.util.Date;

public class MaintenanceItem {
	private Integer id;
	private Integer storeId;//4s店id
	private String maintainNumber;//施工单号
	private String maintenanceItem;//维修项目
	private Integer workingHour;//工时
	private Double workingCost;//工时费用(元)
	private String remark;//备注
	private Date createTime;//创建时间
	
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
	public String getMaintainNumber() {
		return maintainNumber;
	}
	public void setMaintainNumber(String maintainNumber) {
		this.maintainNumber = maintainNumber;
	}
	public String getMaintenanceItem() {
		return maintenanceItem;
	}
	public void setMaintenanceItem(String maintenanceItem) {
		this.maintenanceItem = maintenanceItem;
	}
	public Integer getWorkingHour() {
		return workingHour;
	}
	public void setWorkingHour(Integer workingHour) {
		this.workingHour = workingHour;
	}
	public Double getWorkingCost() {
		return workingCost;
	}
	public void setWorkingCost(Double workingCost) {
		this.workingCost = workingCost;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
}
