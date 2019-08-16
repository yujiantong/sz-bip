package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;


public class Suggest implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;//此id之前是integer类型的，现在改为String类型，将建议存到bomp库中，共同管理
	private String uuId;
	private Integer userId;//建议人id,之前是integer类型的，现在改为String类型，将建议存到bomp库中，共同管理
	private String storeName;//建议人店铺名称
	private String userRoleName;//建议人角色名称
	private String userName;//建议人姓名
	private String userPhone;//建议人电话
	private String title;//建议标题
	private String content;//建议内容
	private Date proposeTime;//提出时间
	private Integer status;//客服就问题的处理状态
	private Integer customId;//处理人id
	private Date solveTime;//处理时间
	private String disContent;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUuId() {
		return uuId;
	}
	public void setUuId(String uuId) {
		this.uuId = uuId;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getStoreName() {
		return storeName;
	}
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	public String getUserRoleName() {
		return userRoleName;
	}
	public void setUserRoleName(String userRoleName) {
		this.userRoleName = userRoleName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserPhone() {
		return userPhone;
	}
	public void setUserPhone(String userPhone) {
		this.userPhone = userPhone;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getProposeTime() {
		return proposeTime;
	}
	public void setProposeTime(Date proposeTime) {
		this.proposeTime = proposeTime;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getCustomId() {
		return customId;
	}
	public void setCustomId(Integer customId) {
		this.customId = customId;
	}
	public Date getSolveTime() {
		return solveTime;
	}
	public void setSolveTime(Date solveTime) {
		this.solveTime = solveTime;
	}
	public String getDisContent() {
		return disContent;
	}
	public void setDisContent(String disContent) {
		this.disContent = disContent;
	}
	
	
}
