package com.bofide.bip.po;

import java.util.Date;

/**
 * <p>Title: SentBihuInfo</p>
 * <p>Description: 存放调用壁虎接口信息(记录每一次发送的主要信息)</p>
 *
 * @author lixuhua
 * @date 2016年12月27日 下午2:43:52
 */
public class SentBihuInfo {
	
	/**
	 * id
	 */
	private Integer id;
	
	/**
	 * 店id
	 */
	private Integer storeId;
	
	/**
	 * 用户id
	 */
	private Integer userId;
	
	/**
	 * 壁虎渠道码
	 */
	private String agent;
	
	/**
	 * 调用时间
	 */
	private Date transferTime;
	
	/**
	 * 调用类型,默认为0,1:查询续保,2:发起报价,3:获取报价,4:获取核保,5:获取出险
	 */
	private Integer transferType;
	
	/**
	 * 车牌号
	 */
	private String licenseNo;
	
	/**
	 * 发动机号
	 */
	private String engineNo;
	
	/**
	 * 车架号
	 */
	private String carVin;
	
	/**
	 * 客户端标识
	 */
	private String custKey;
	
	/**
	 * 壁虎保险资源枚举
	 */
	private Integer source;

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
	 * 用户id  
	 * @return userId   用户id  
	 */
	public Integer getUserId() {
		return userId;
	}

	/**  
	 * 用户id  
	 * @param userId  用户id  
	 */
	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	/**  
	 * 壁虎渠道码  
	 * @return agent   壁虎渠道码  
	 */
	public String getAgent() {
		return agent;
	}

	/**  
	 * 壁虎渠道码  
	 * @param agent  壁虎渠道码  
	 */
	public void setAgent(String agent) {
		this.agent = agent;
	}

	/**  
	 * 调用时间  
	 * @return transferTime   调用时间  
	 */
	public Date getTransferTime() {
		return transferTime;
	}

	/**  
	 * 调用时间  
	 * @param transferTime  调用时间  
	 */
	public void setTransferTime(Date transferTime) {
		this.transferTime = transferTime;
	}

	/**  
	 * 调用类型默认为01:查询续保2:发起报价3:获取报价4:获取核保5:获取出险  
	 * @return transferType   调用类型默认为01:查询续保2:发起报价3:获取报价4:获取核保5:获取出险  
	 */
	public Integer getTransferType() {
		return transferType;
	}

	/**  
	 * 调用类型默认为01:查询续保2:发起报价3:获取报价4:获取核保5:获取出险  
	 * @param transferType  调用类型默认为01:查询续保2:发起报价3:获取报价4:获取核保5:获取出险  
	 */
	public void setTransferType(Integer transferType) {
		this.transferType = transferType;
	}

	/**  
	 * 车牌号  
	 * @return licenseNo   车牌号  
	 */
	public String getLicenseNo() {
		return licenseNo;
	}

	/**  
	 * 车牌号  
	 * @param licenseNo  车牌号  
	 */
	public void setLicenseNo(String licenseNo) {
		this.licenseNo = licenseNo;
	}

	/**  
	 * 客户端标识  
	 * @return custKey   客户端标识  
	 */
	public String getCustKey() {
		return custKey;
	}

	/**  
	 * 客户端标识  
	 * @param custKey  客户端标识  
	 */
	public void setCustKey(String custKey) {
		this.custKey = custKey;
	}

	/**  
	 * 壁虎保险资源枚举  
	 * @return source   壁虎保险资源枚举  
	 */
	public Integer getSource() {
		return source;
	}

	/**  
	 * 壁虎保险资源枚举  
	 * @param source  壁虎保险资源枚举  
	 */
	public void setSource(Integer source) {
		this.source = source;
	}

	/**  
	 * 发动机号  
	 * @return engineNo   发动机号  
	 */
	public String getEngineNo() {
		return engineNo;
	}

	/**  
	 * 发动机号  
	 * @param engineNo  发动机号  
	 */
	public void setEngineNo(String engineNo) {
		this.engineNo = engineNo;
	}

	/**  
	 * 车架号  
	 * @return carVin   车架号  
	 */
	public String getCarVin() {
		return carVin;
	}

	/**  
	 * 车架号  
	 * @param carVin  车架号  
	 */
	public void setCarVin(String carVin) {
		this.carVin = carVin;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "SentBihuInfo [id=" + id + ", storeId=" + storeId + ", userId="
				+ userId + ", agent=" + agent + ", transferTime="
				+ transferTime + ", transferType=" + transferType
				+ ", licenseNo=" + licenseNo + ", engineNo=" + engineNo
				+ ", carVin=" + carVin + ", custKey=" + custKey + ", source="
				+ source + "]";
	}
	
}
