package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;

public class UpdatePasswordRecord implements Serializable {
	
	private static final long serialVersionUID = 5896958243847923522L;
	//id
	private Integer id;
	//4s店Id
	private Integer storeId;
	//用户名
	private String userName;
	//旧密码
	private String oldPassword;
	//新密码
	private String newPassword;
	//保险公司名称
	private String insuranceCompName;
	//操作人
	private String operator;
	//操作时间
	private Date operateTime;
	//操作状态
	private Integer operateStatu=0;
	
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
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getInsuranceCompName() {
		return insuranceCompName;
	}
	public void setInsuranceCompName(String insuranceCompName) {
		this.insuranceCompName = insuranceCompName;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public Date getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}
	public Integer getOperateStatu() {
		return operateStatu;
	}
	public void setOperateStatu(Integer operateStatu) {
		this.operateStatu = operateStatu;
	}
	public String getOldPassword() {
		return oldPassword;
	}
	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	
}
