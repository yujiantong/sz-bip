package com.bofide.bip.po;

import java.io.Serializable;

public class CustomerUpdate implements Serializable{
	private static final long serialVersionUID = 1L;
	private Integer id;
	private Integer storeId;
	private Integer customerId;
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
	public Integer getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}
	
	
}
