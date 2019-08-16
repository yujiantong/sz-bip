package com.bofide.bip.po;

import java.util.Date;

/**
 * 营销模板bean
 */
public class SmsTemplate {
	private Integer id;
	/**
     * 店的id
     */
    private Integer storeId;
	/**
     * 模板名称
     */
    private String templateName;
	/**
     * 活动详情
     */
    private String details;
    /**
     * 活动开始时间
     */
    private Date startTime;
    /**
     * 活动结束时间
     */
    private Date endTime;
	/**
     * 创建人
     */
    private String establishName;
    /**
     * 创建时间
     */
    private Date establishTime;
    /**
     * 启用状态
     */
    private Integer enabledState;
	/**
     * 最后操作人
     */
    private String endOperationName;
    /**
     * 最后操作时间
     */
    private Date endOperationTime;
    /**
     * 是否删除
     */
    private Integer deleted;
    /**
     * 店的信息
     */
    private Store store;
    
    
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getDeleted() {
		return deleted;
	}
	public void setDeleted(Integer deleted) {
		this.deleted = deleted;
	}
	public Integer getStoreId() {
		return storeId;
	}
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	public String getDetails() {
		return details;
	}
	public void setDetails(String details) {
		this.details = details;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public String getEstablishName() {
		return establishName;
	}
	public void setEstablishName(String establishName) {
		this.establishName = establishName;
	}
	public Date getEstablishTime() {
		return establishTime;
	}
	public void setEstablishTime(Date establishTime) {
		this.establishTime = establishTime;
	}
	public Integer getEnabledState() {
		return enabledState;
	}
	public void setEnabledState(Integer enabledState) {
		this.enabledState = enabledState;
	}
	public String getEndOperationName() {
		return endOperationName;
	}
	public void setEndOperationName(String endOperationName) {
		this.endOperationName = endOperationName;
	}
	public Date getEndOperationTime() {
		return endOperationTime;
	}
	public void setEndOperationTime(Date endOperationTime) {
		this.endOperationTime = endOperationTime;
	}
	public Store getStore() {
		return store;
	}
	public void setStore(Store store) {
		this.store = store;
	}

}
