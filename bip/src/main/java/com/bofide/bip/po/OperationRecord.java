package com.bofide.bip.po;

import java.util.Date;


public class OperationRecord {
	
	private Integer id;
	/**
	 * 用户id
	 */
	private Integer userId;
	/**
	 * 潜客id
	 */
	private Integer customerId;
	/**
	 * 投保类型标志
	 */
	private Integer coverType;
	/**
	 * 操作标志
	 */
	private Integer operationFlag;
	/**
	 * 操作时间
	 */
	private Date operationDate;
	/**
	 * 虚拟保险到日
	 */
	private Date virtualJqxdqr;
	/**
	 * 分配来源,1:销售顾问跟踪完成分配,2:服务顾问跟踪完成分配
	 */
	private Integer assignSource;
	
	public Integer getAssignSource() {
		return assignSource;
	}
	public void setAssignSource(Integer assignSource) {
		this.assignSource = assignSource;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}
	public Integer getCoverType() {
		return coverType;
	}
	public void setCoverType(Integer coverType) {
		this.coverType = coverType;
	}
	public Integer getOperationFlag() {
		return operationFlag;
	}
	public void setOperationFlag(Integer operationFlag) {
		this.operationFlag = operationFlag;
	}
	public Date getOperationDate() {
		return operationDate;
	}
	public void setOperationDate(Date operationDate) {
		this.operationDate = operationDate;
	}
	public Date getVirtualJqxdqr() {
		return virtualJqxdqr;
	}
	public void setVirtualJqxdqr(Date virtualJqxdqr) {
		this.virtualJqxdqr = virtualJqxdqr;
	}
	
}
