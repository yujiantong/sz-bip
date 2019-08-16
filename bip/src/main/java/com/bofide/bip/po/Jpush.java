package com.bofide.bip.po;

import java.util.Date;

public class Jpush {
	/**
	 * 自增ID
	 */
	private Integer id;
	/**
	 * 用户id
	 */
	private Integer userId;
	/**
	 * 设配标签
	 */
	private String tag;
	/**
	 * 设配ID
	 */
	private String registrationId;
	/**
	 * 设配别名
	 */
	private String alias;
	/**
	 * 修改时间
	 */
	private Date updateDate;
	/**
	 * 创建时间
	 */
	private Date createDate;
	/**
	 * 店ID
	 */
	private Integer storeId;
	/**
	 * 公司标志,1表示博福,2表示传慧嘉和
	 */
	private Integer logoFlag;
	
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
	public String getTag() {
		return tag;
	}
	public void setTag(String tag) {
		this.tag = tag;
	}
	public String getRegistrationId() {
		return registrationId;
	}
	public void setRegistrationId(String registrationId) {
		this.registrationId = registrationId;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Integer getStoreId() {
		return storeId;
	}
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	public Integer getLogoFlag() {
		return logoFlag;
	}
	public void setLogoFlag(Integer logoFlag) {
		this.logoFlag = logoFlag;
	}
	
}
