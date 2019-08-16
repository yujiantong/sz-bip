package com.bofide.bip.po;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 礼包明细
 * @author huliangqing
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class GiftPackageDetail {
	
	private Integer id;
	/**
	 * 礼包Id
	 */
	private Integer packageId;
	/**
	 * 赠品编码
	 */
	private String giftCode;
	/**
	 * 赠品名称
	 */
	private String giftName;
	/**
	 * 赠品类型,1:服务类;2.精品类
	 */
	private Integer giftType;
	/**
	 * 指导价
	 */
	private Double guidePrice;
	/**
	 * 销售成本
	 */
	private Double salePrice;
	/**
	 * 实际成本
	 */
	private Double actualPrice;
	/**
	 * 数量
	 */
	private Integer number;
	/**
	 * 创建时间
	 */
	private Date createTime;
	/**
	 * 修改时间
	 */
	private Date updateTime;
	
	public Integer getPackageId() {
		return packageId;
	}
	public void setPackageId(Integer packageId) {
		this.packageId = packageId;
	}
	public String getGiftCode() {
		return giftCode;
	}
	public void setGiftCode(String giftCode) {
		this.giftCode = giftCode;
	}
	public String getGiftName() {
		return giftName;
	}
	public void setGiftName(String giftName) {
		this.giftName = giftName;
	}
	public Integer getGiftType() {
		return giftType;
	}
	public void setGiftType(Integer giftType) {
		this.giftType = giftType;
	}
	public Integer getNumber() {
		return number;
	}
	public void setNumber(Integer number) {
		this.number = number;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Double getGuidePrice() {
		return guidePrice;
	}
	public void setGuidePrice(Double guidePrice) {
		this.guidePrice = guidePrice;
	}
	public Double getSalePrice() {
		return salePrice;
	}
	public void setSalePrice(Double salePrice) {
		this.salePrice = salePrice;
	}
	public Double getActualPrice() {
		return actualPrice;
	}
	public void setActualPrice(Double actualPrice) {
		this.actualPrice = actualPrice;
	}
	
}
