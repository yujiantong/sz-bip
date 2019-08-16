package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;

public class Reason implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3620302481441319852L;
	/**
	 * 自增id
	 */
	private Integer id;
	/**
	 * 4s店Id
	 */
	private Integer storeId;
	/**
	 * 回退失销原因
	 */
	private String reason;
	/**
	 * 排序
	 */
	private Integer sort;
	/**
	 * 启用状态,1表示启用,2表示禁用
	 */
	private Integer status;
	/**
	 * 是否可编辑删除, 0表示不可以,1表示可以
	 */
	private Integer disable;
	/**
	 * 创建时间
	 */
	private Date createTime;
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
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public Integer getSort() {
		return sort;
	}
	public void setSort(Integer sort) {
		this.sort = sort;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getDisable() {
		return disable;
	}
	public void setDisable(Integer disable) {
		this.disable = disable;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
}
