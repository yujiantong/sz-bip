package com.bofide.bip.po;

import java.util.Date;

/**
 * 赠送信息
 * @author wangchuang
 *
 */
public class GivingInformation {
	
	private Integer id;
	private Integer approvalBillId;
	private String zsxx;//赠送信息
	/**
	 * 赠品编码
	 * */
	private String giftCode;
	/**
	 * 赠品名称
	 * */
	private String giftName;
	/**
	 * 赠品类型,1:服务类;2.精品类;3.礼包类
	 * */
	private Integer giftType;
	/**
	 * 有效期至
	 * */
	private Date validDate;
	/**
	 * 指导价
	 * */
	private Double guidePrice;
	/**
	 * 销售成本
	 * */
	private Double salePrice;
	/**
	 * 实际成本
	 * */
	private Double actualPrice;
	/**
	 * 折扣
	 * */
	private Double discount;
	/**
	 * 销售价
	 * */
	private Double sellingPrice;
	/**
	 * 数量
	 * */
	private Integer amount;
	/**
	 * 总金额
	 * */
	private Double amountMoney;
	/**
	 * 备注
	 * */
	private String remark;
	/**
	 * 创建时间
	 * */
	private Date createTime;
	/**
	 * 剩余数量
	 */
	private Integer surplusNum;
	/**
	 * 本次使用数量
	 */
	private Integer thisUseNum;
	
	/**
	 * 礼包类的赠送记录的ID,如果为0则表示不属于礼包,如果不为0则属于此ID的礼包类
	 */
	private Integer givingInformationId;
	/**
	 * 额度
	 */
	private Integer quota;
	/**
	 * 本次消费明细
	 * */
	private String bcxfDetail;
	
	
	public Integer getQuota() {
		return quota;
	}
	public void setQuota(Integer quota) {
		this.quota = quota;
	}
	public String getBcxfDetail() {
		return bcxfDetail;
	}
	public void setBcxfDetail(String bcxfDetail) {
		this.bcxfDetail = bcxfDetail;
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
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
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
	public Double getDiscount() {
		return discount;
	}
	public void setDiscount(Double discount) {
		this.discount = discount;
	}
	public Double getSellingPrice() {
		return sellingPrice;
	}
	public void setSellingPrice(Double sellingPrice) {
		this.sellingPrice = sellingPrice;
	}
	public Integer getAmount() {
		return amount;
	}
	public void setAmount(Integer amount) {
		this.amount = amount;
	}
	public Double getAmountMoney() {
		return amountMoney;
	}
	public void setAmountMoney(Double amountMoney) {
		this.amountMoney = amountMoney;
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
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getApprovalBillId() {
		return approvalBillId;
	}
	public void setApprovalBillId(Integer approvalBillId) {
		this.approvalBillId = approvalBillId;
	}
	public String getZsxx() {
		return zsxx;
	}
	public void setZsxx(String zsxx) {
		this.zsxx = zsxx;
	}
	public Integer getSurplusNum() {
		return surplusNum;
	}
	public void setSurplusNum(Integer surplusNum) {
		this.surplusNum = surplusNum;
	}
	public Integer getThisUseNum() {
		return thisUseNum;
	}
	public void setThisUseNum(Integer thisUseNum) {
		this.thisUseNum = thisUseNum;
	}
	public Integer getGivingInformationId() {
		return givingInformationId;
	}
	public void setGivingInformationId(Integer givingInformationId) {
		this.givingInformationId = givingInformationId;
	}
	@Override
	public String toString() {
		return "GivingInformation [id=" + id + ", approvalBillId="
				+ approvalBillId + ", zsxx=" + zsxx + ", giftCode=" + giftCode
				+ ", giftName=" + giftName + ", giftType=" + giftType
				+ ", validDate=" + validDate + ", guidePrice=" + guidePrice
				+ ", salePrice=" + salePrice + ", actualPrice=" + actualPrice
				+ ", discount=" + discount + ", sellingPrice=" + sellingPrice
				+ ", amount=" + amount + ", amountMoney=" + amountMoney
				+ ", remark=" + remark + ", createTime=" + createTime
				+ ", surplusNum=" + surplusNum + ", thisUseNum=" + thisUseNum
				+ ", givingInformationId="+givingInformationId+"]";
	}
	
}
