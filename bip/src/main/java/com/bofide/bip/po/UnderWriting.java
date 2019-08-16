package com.bofide.bip.po;
/**
 * 核保类
 * @author qiumingyu
 *
 */
public class UnderWriting {
	/**
	 * id
	 */
	private Integer id;
	/**
	 * 壁虎保险资源枚举
	 */
	private Integer Source;
	/**
	 * 核保状态
	 */
	private Integer SubmitStatus;
	/**
	 * 核保状态描述
	 */
	private String SubmitResult;
	/**
	 * 商业险投保单号
	 */
	private String BizNo;
	/**
	 * 交强险投保单号
	 */
	private String ForceNo;
	/**
	 * 商业险费率（核保通过才会有值）
	 */
	private Double BizRate;
	/**
	 * 交强车船险费率（核保通过之后才会有值）
	 */
	private Double ForceRate;
	/**
	 * 店id
	 */
	private Integer storeId;
	/**
	 * 潜客id
	 */
	private Integer customerId;
	/**
	 * 报价id
	 */
	private Integer bjId;
	/**  
	 * id  
	 * @return id   id  
	 */
	public Integer getId() {
		return id;
	}
	/**  
	 * id  
	 * @param id  id  
	 */
	public void setId(Integer id) {
		this.id = id;
	}
	/**  
	 * source  
	 * @return source   source  
	 */
	public Integer getSource() {
		return Source;
	}
	/**  
	 * source  
	 * @param source  source  
	 */
	public void setSource(Integer source) {
		Source = source;
	}
	/**  
	 * submitStatus  
	 * @return submitStatus   submitStatus  
	 */
	public Integer getSubmitStatus() {
		return SubmitStatus;
	}
	/**  
	 * submitStatus  
	 * @param submitStatus  submitStatus  
	 */
	public void setSubmitStatus(Integer submitStatus) {
		SubmitStatus = submitStatus;
	}
	/**  
	 * submitResult  
	 * @return submitResult   submitResult  
	 */
	public String getSubmitResult() {
		return SubmitResult;
	}
	/**  
	 * submitResult  
	 * @param submitResult  submitResult  
	 */
	public void setSubmitResult(String submitResult) {
		SubmitResult = submitResult;
	}
	/**  
	 * bizNo  
	 * @return bizNo   bizNo  
	 */
	public String getBizNo() {
		return BizNo;
	}
	/**  
	 * bizNo  
	 * @param bizNo  bizNo  
	 */
	public void setBizNo(String bizNo) {
		BizNo = bizNo;
	}
	/**  
	 * forceNo  
	 * @return forceNo   forceNo  
	 */
	public String getForceNo() {
		return ForceNo;
	}
	/**  
	 * forceNo  
	 * @param forceNo  forceNo  
	 */
	public void setForceNo(String forceNo) {
		ForceNo = forceNo;
	}
	/**  
	 * bizRate  
	 * @return bizRate   bizRate  
	 */
	public Double getBizRate() {
		return BizRate;
	}
	/**  
	 * bizRate  
	 * @param bizRate  bizRate  
	 */
	public void setBizRate(Double bizRate) {
		BizRate = bizRate;
	}
	/**  
	 * forceRate  
	 * @return forceRate   forceRate  
	 */
	public Double getForceRate() {
		return ForceRate;
	}
	/**  
	 * forceRate  
	 * @param forceRate  forceRate  
	 */
	public void setForceRate(Double forceRate) {
		ForceRate = forceRate;
	}
	/**  
	 * 店id  
	 * @return storeId   店id  
	 */
	public Integer getStoreId() {
		return storeId;
	}
	/**  
	 * 店id  
	 * @param storeId  店id  
	 */
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	/**  
	 * 潜客id  
	 * @return customerId   潜客id  
	 */
	public Integer getCustomerId() {
		return customerId;
	}
	/**  
	 * 潜客id  
	 * @param customerId  潜客id  
	 */
	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}
	/**  
	 * 报价id  
	 * @return bjId   报价id  
	 */
	public Integer getBjId() {
		return bjId;
	}
	/**  
	 * 报价id  
	 * @param bjId  报价id  
	 */
	public void setBjId(Integer bjId) {
		this.bjId = bjId;
	}
	
	
}
