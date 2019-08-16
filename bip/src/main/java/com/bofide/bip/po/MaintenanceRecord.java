package com.bofide.bip.po;

import java.util.Date;

public class MaintenanceRecord {
	private Integer id;
	private Integer storeId;//4s店ID
	private String maintainNumber;//施工单号
	private String reportNumber;//报案号
	private Date maintenanceTimeStart;//维修开始时间
	private Date maintenanceTimeEnd;//维修结束时间
	private String carLicenseNumber;//车牌号
	private String entrustor;//托修人
	private String entrustorPhone;//托修人联系方式
	private String maintenanceType;//维修种类
	private Double certainCost;//定损金额(元)
	private Double maintainCost;//维修金额(元)
	private Double realCost;//实收金额(元)
	private Integer consultantId;//服务顾问id
	private String consultantName;//服务顾问名字
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
	public String getReportNumber() {
		return reportNumber;
	}
	public void setReportNumber(String reportNumber) {
		this.reportNumber = reportNumber;
	}
	public Date getMaintenanceTimeStart() {
		return maintenanceTimeStart;
	}
	public void setMaintenanceTimeStart(Date maintenanceTimeStart) {
		this.maintenanceTimeStart = maintenanceTimeStart;
	}
	public Date getMaintenanceTimeEnd() {
		return maintenanceTimeEnd;
	}
	public void setMaintenanceTimeEnd(Date maintenanceTimeEnd) {
		this.maintenanceTimeEnd = maintenanceTimeEnd;
	}
	public String getCarLicenseNumber() {
		return carLicenseNumber;
	}
	public void setCarLicenseNumber(String carLicenseNumber) {
		this.carLicenseNumber = carLicenseNumber;
	}
	public String getEntrustor() {
		return entrustor;
	}
	public void setEntrustor(String entrustor) {
		this.entrustor = entrustor;
	}
	public String getEntrustorPhone() {
		return entrustorPhone;
	}
	public void setEntrustorPhone(String entrustorPhone) {
		this.entrustorPhone = entrustorPhone;
	}
	public String getMaintenanceType() {
		return maintenanceType;
	}
	public void setMaintenanceType(String maintenanceType) {
		this.maintenanceType = maintenanceType;
	}
	public Double getCertainCost() {
		return certainCost;
	}
	public void setCertainCost(Double certainCost) {
		this.certainCost = certainCost;
	}
	public Double getMaintainCost() {
		return maintainCost;
	}
	public void setMaintainCost(Double maintainCost) {
		this.maintainCost = maintainCost;
	}
	public Double getRealCost() {
		return realCost;
	}
	public void setRealCost(Double realCost) {
		this.realCost = realCost;
	}
	public Integer getConsultantId() {
		return consultantId;
	}
	public void setConsultantId(Integer consultantId) {
		this.consultantId = consultantId;
	}
	public String getConsultantName() {
		return consultantName;
	}
	public void setConsultantName(String consultantName) {
		this.consultantName = consultantName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	
}
