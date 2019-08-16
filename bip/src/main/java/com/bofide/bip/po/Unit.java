package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class Unit implements Serializable{
	private static final long serialVersionUID = 1L;
	
	//自增ID
	private Integer id;
	//所属集团ID
	private Integer jtId;
	//事业部名字
	private String unitName;
	//创建时间
	private Date recordTime;
	//负责人姓名
	private String userName;
	//管辖店
	private List<Store> storeList;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getJtId() {
		return jtId;
	}
	public void setJtId(Integer jtId) {
		this.jtId = jtId;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public Date getRecordTime() {
		return recordTime;
	}
	public void setRecordTime(Date recordTime) {
		this.recordTime = recordTime;
	}
	public List<Store> getStoreList() {
		return storeList;
	}
	public void setStoreList(List<Store> storeList) {
		this.storeList = storeList;
	}
	
}
