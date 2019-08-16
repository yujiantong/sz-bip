package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

/**
 * 赠品管理
 * @author huliangqing
 */
public class GiftManagement {
	
	private Integer id;
	/**
	 * 4s店Id
	 */
	private Integer storeId;
	/**
	 * 赠品编码
	 */
	private String giftCode;
	/**
	 * 赠品名称
	 */
	private String giftName;
	/**
	 * 赠品型号
	 */
	private String giftModel;
	/**
	 * 赠品类型,1:服务类;2.精品类;3.礼包类
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
	 * 礼包指导价
	 */
	private Double packageGuidePrice;
	/**
	 * 礼包销售成本
	 */
	private Double packageSalePrice;
	/**
	 * 礼包实际成本
	 */
	private Double packageActualPrice;
	/**
	 * 有效时限
	 */
	private Integer validLength;
	/**
	 * 生效时间
	 */
	private Date effectiveTime;
	/**
	 * 失效时间
	 */
	private Date failureTime;
	/**
	 * 状态,1,生效中;2.未生效
	 */
	private Integer status;
	/**
	 * 备注
	 */
	private String remark;
	/**
	 * 创建时间
	 */
	private Date createTime;
	/**
	 * 修改时间
	 */
	private Date updateTime;
	/**
	 * 礼包明细
	 */
	private List<GiftPackageDetail> giftPackageDetails;
	/**
	 * 额度,储值卡与会员积分专有
	 */
	private Integer quota;
	
	
	public Integer getQuota() {
		return quota;
	}
	public void setQuota(Integer quota) {
		this.quota = quota;
	}
	public String getGiftModel() {
		return giftModel;
	}
	public void setGiftModel(String giftModel) {
		this.giftModel = giftModel;
	}
	public List<GiftPackageDetail> getGiftPackageDetails() {
		return giftPackageDetails;
	}
	public void setGiftPackageDetails(List<GiftPackageDetail> giftPackageDetails) {
		this.giftPackageDetails = giftPackageDetails;
	}
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
	public Double getPackageGuidePrice() {
		return packageGuidePrice;
	}
	public void setPackageGuidePrice(Double packageGuidePrice) {
		this.packageGuidePrice = packageGuidePrice;
	}
	public Double getPackageSalePrice() {
		return packageSalePrice;
	}
	public void setPackageSalePrice(Double packageSalePrice) {
		this.packageSalePrice = packageSalePrice;
	}
	public Double getPackageActualPrice() {
		return packageActualPrice;
	}
	public void setPackageActualPrice(Double packageActualPrice) {
		this.packageActualPrice = packageActualPrice;
	}
	public Integer getValidLength() {
		return validLength;
	}
	public void setValidLength(Integer validLength) {
		this.validLength = validLength;
	}
	public Date getEffectiveTime() {
		return effectiveTime;
	}
	public void setEffectiveTime(Date effectiveTime) {
		this.effectiveTime = effectiveTime;
	}
	public Date getFailureTime() {
		return failureTime;
	}
	public void setFailureTime(Date failureTime) {
		this.failureTime = failureTime;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
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

}
