package com.bofide.bip.po;

import java.util.Date;

public class Message {
	
	 /**
     * id
     */
    private Integer messageId;

    /**
     * 4s店id
     */
    private Integer storeId;
    
    /**
     * 用户id
     */
    private Integer userId;

    /**
     * 操作人id
     */
    private Integer operatorId;
    
    /**
     * 操作人名称
     */
    private String operatorName;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 消息时间
     */
    private Date messageDate;
    
    /**
     * 阅读状态 0-未阅读 1-已阅读
     */
	private Integer readStatus;
	
	/**
     * 备注
     */
    private Date remark;
    
    /**
     * 用户信息
     */
    private User user;
    //潜客id
    private Integer customerId;
    //车架号
    private String chassisNumber;
    //信息点击标志 0表示不可点击,提示潜客不再该用户名下;1表示可点击;-1表示不可点击,不提示
    private Integer clickFlag = 0;
    //潜客信息,支持点击个人信息跳转到跟踪处理页面
    private RenewalingCustomer customer;
	public Integer getMessageId() {
		return messageId;
	}

	public void setMessageId(Integer messageId) {
		this.messageId = messageId;
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getOperatorId() {
		return operatorId;
	}

	public void setOperatorId(Integer operatorId) {
		this.operatorId = operatorId;
	}

	public String getOperatorName() {
		return operatorName;
	}

	public void setOperatorName(String operatorName) {
		this.operatorName = operatorName;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getRemark() {
		return remark;
	}

	public void setRemark(Date remark) {
		this.remark = remark;
	}
	
	public Integer getReadStatus() {
		return readStatus;
	}

	public void setReadStatus(Integer readStatus) {
		this.readStatus = readStatus;
	}
	
	public Date getMessageDate() {
		return messageDate;
	}

	public void setMessageDate(Date messageDate) {
		this.messageDate = messageDate;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Integer getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}

	public String getChassisNumber() {
		return chassisNumber;
	}

	public void setChassisNumber(String chassisNumber) {
		this.chassisNumber = chassisNumber;
	}

	public Integer getClickFlag() {
		return clickFlag;
	}

	public void setClickFlag(Integer clickFlag) {
		this.clickFlag = clickFlag;
	}

	public RenewalingCustomer getCustomer() {
		return customer;
	}

	public void setCustomer(RenewalingCustomer customer) {
		this.customer = customer;
	}

}
