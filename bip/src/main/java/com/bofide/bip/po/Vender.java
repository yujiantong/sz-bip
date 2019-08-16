package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;

public class Vender implements Serializable{
	private static final long serialVersionUID = 1L;
	
	/**
	 * 自增id
	 */
	private Integer id;
	/**
	 * 厂家名字
	 */
	private String venderName;
	/**
	 * 厂家英文
	 */
	private String venderEnglish;
	/**
	 * 备注
	 */
	private String venderRemark;
	/**
	 * 创建时间
	 */
	private Date recordTime;
	
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getVenderName() {
		return venderName;
	}
	public void setVenderName(String venderName) {
		this.venderName = venderName;
	}
	public String getVenderEnglish() {
		return venderEnglish;
	}
	public void setVenderEnglish(String venderEnglish) {
		this.venderEnglish = venderEnglish;
	}
	public String getVenderRemark() {
		return venderRemark;
	}
	public void setVenderRemark(String venderRemark) {
		this.venderRemark = venderRemark;
	}
	public Date getRecordTime() {
		return recordTime;
	}
	public void setRecordTime(Date recordTime) {
		this.recordTime = recordTime;
	}
}
