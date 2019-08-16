package com.bofide.bip.vo;

import java.io.Serializable;
import java.util.List;

public class BHCarInfoVo implements Serializable{
	private static final long serialVersionUID = 5024740564280319370L;
	
	//使用性质
	private Integer carUsedType;
	//车牌号
	private String licenseNo;
	//车主姓名
	private String licenseOwner;
	//被保险人（新增）
	private String insuredName;
	//投保人（新增）
	private String postedName;
	//证件类型
	private Integer idType;
	//证件号码(车主本人)
	private String credentislasNum;
	//城市Id
	private Integer cityCode;
	//发动机号
	private String engineNo;
	//品牌型号
	private String modleName;
	//车架号
	private String carVin;
	//车辆注册日期
	private String registerDate;
	//交强险到期时间
	private String forceExpireDate;
	//商业险到期时间
	private String businessExpireDate;
	//下年的交强起保日期
	private String nextForceStartDate;
	//下年的商业险起保日期
	private String nextBusinessStartDate;
	//新车购置价格（新增）
	private Double purchasePrice;
	//座位数量
	private Integer seatCount;
	//燃料种类
	private Integer fuelType;
	//条款种类
	private Integer proofType;
	//号牌底色
	private Integer licenseColor;
	//条款类型
	private Integer clauseType;
	//行驶区域
	private Integer runRegion;
	//被保人证件号
	private String insuredIdCard;
	//被保人证件类型
	private Integer insuredIdType;
	//被保人手机号
	private String insuredMobile;
	//投保人证件号
	private String holderIdCard;
	//投保人证件类型
	private Integer holderIdType;
	//投保人联系方式
	private String holderMobile;
	//费率系数1（无赔款系数）
	private Double rateFactor1;
	//费率系数2（自主渠道系数）
	private Double rateFactor2;
	//费率系数3（自主核保系数）
	private Double rateFactor3;
	//费率系数4（交通违法浮动系数）
	private Double rateFactor4;
	//0：续保失败，无法获取该属性 1：公车 2：私车
	private Integer isPublic;
	public Integer getCarUsedType() {
		return carUsedType;
	}
	public void setCarUsedType(Integer carUsedType) {
		this.carUsedType = carUsedType;
	}
	public String getLicenseNo() {
		return licenseNo;
	}
	public void setLicenseNo(String licenseNo) {
		this.licenseNo = licenseNo;
	}
	public String getLicenseOwner() {
		return licenseOwner;
	}
	public void setLicenseOwner(String licenseOwner) {
		this.licenseOwner = licenseOwner;
	}
	public String getInsuredName() {
		return insuredName;
	}
	public void setInsuredName(String insuredName) {
		this.insuredName = insuredName;
	}
	public String getPostedName() {
		return postedName;
	}
	public void setPostedName(String postedName) {
		this.postedName = postedName;
	}
	public Integer getIdType() {
		return idType;
	}
	public void setIdType(Integer idType) {
		this.idType = idType;
	}
	public String getCredentislasNum() {
		return credentislasNum;
	}
	public void setCredentislasNum(String credentislasNum) {
		this.credentislasNum = credentislasNum;
	}
	public Integer getCityCode() {
		return cityCode;
	}
	public void setCityCode(Integer cityCode) {
		this.cityCode = cityCode;
	}
	public String getEngineNo() {
		return engineNo;
	}
	public void setEngineNo(String engineNo) {
		this.engineNo = engineNo;
	}
	public String getModleName() {
		return modleName;
	}
	public void setModleName(String modleName) {
		this.modleName = modleName;
	}
	public String getCarVin() {
		return carVin;
	}
	public void setCarVin(String carVin) {
		this.carVin = carVin;
	}
	public String getRegisterDate() {
		return registerDate;
	}
	public void setRegisterDate(String registerDate) {
		this.registerDate = registerDate;
	}
	public String getForceExpireDate() {
		return forceExpireDate;
	}
	public void setForceExpireDate(String forceExpireDate) {
		this.forceExpireDate = forceExpireDate;
	}
	public String getBusinessExpireDate() {
		return businessExpireDate;
	}
	public void setBusinessExpireDate(String businessExpireDate) {
		this.businessExpireDate = businessExpireDate;
	}
	public String getNextForceStartDate() {
		return nextForceStartDate;
	}
	public void setNextForceStartDate(String nextForceStartDate) {
		this.nextForceStartDate = nextForceStartDate;
	}
	public String getNextBusinessStartDate() {
		return nextBusinessStartDate;
	}
	public void setNextBusinessStartDate(String nextBusinessStartDate) {
		this.nextBusinessStartDate = nextBusinessStartDate;
	}
	public Double getPurchasePrice() {
		return purchasePrice;
	}
	public void setPurchasePrice(Double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}
	public Integer getSeatCount() {
		return seatCount;
	}
	public void setSeatCount(Integer seatCount) {
		this.seatCount = seatCount;
	}
	public Integer getFuelType() {
		return fuelType;
	}
	public void setFuelType(Integer fuelType) {
		this.fuelType = fuelType;
	}
	public Integer getProofType() {
		return proofType;
	}
	public void setProofType(Integer proofType) {
		this.proofType = proofType;
	}
	public Integer getLicenseColor() {
		return licenseColor;
	}
	public void setLicenseColor(Integer licenseColor) {
		this.licenseColor = licenseColor;
	}
	public Integer getClauseType() {
		return clauseType;
	}
	public void setClauseType(Integer clauseType) {
		this.clauseType = clauseType;
	}
	public Integer getRunRegion() {
		return runRegion;
	}
	public void setRunRegion(Integer runRegion) {
		this.runRegion = runRegion;
	}
	public String getInsuredIdCard() {
		return insuredIdCard;
	}
	public void setInsuredIdCard(String insuredIdCard) {
		this.insuredIdCard = insuredIdCard;
	}
	public Integer getInsuredIdType() {
		return insuredIdType;
	}
	public void setInsuredIdType(Integer insuredIdType) {
		this.insuredIdType = insuredIdType;
	}
	public String getInsuredMobile() {
		return insuredMobile;
	}
	public void setInsuredMobile(String insuredMobile) {
		this.insuredMobile = insuredMobile;
	}
	public String getHolderIdCard() {
		return holderIdCard;
	}
	public void setHolderIdCard(String holderIdCard) {
		this.holderIdCard = holderIdCard;
	}
	public Integer getHolderIdType() {
		return holderIdType;
	}
	public void setHolderIdType(Integer holderIdType) {
		this.holderIdType = holderIdType;
	}
	public String getHolderMobile() {
		return holderMobile;
	}
	public void setHolderMobile(String holderMobile) {
		this.holderMobile = holderMobile;
	}
	public Double getRateFactor1() {
		return rateFactor1;
	}
	public void setRateFactor1(Double rateFactor1) {
		this.rateFactor1 = rateFactor1;
	}
	public Double getRateFactor2() {
		return rateFactor2;
	}
	public void setRateFactor2(Double rateFactor2) {
		this.rateFactor2 = rateFactor2;
	}
	public Double getRateFactor3() {
		return rateFactor3;
	}
	public void setRateFactor3(Double rateFactor3) {
		this.rateFactor3 = rateFactor3;
	}
	public Double getRateFactor4() {
		return rateFactor4;
	}
	public void setRateFactor4(Double rateFactor4) {
		this.rateFactor4 = rateFactor4;
	}
	public Integer getIsPublic() {
		return isPublic;
	}
	public void setIsPublic(Integer isPublic) {
		this.isPublic = isPublic;
	}
	
	public String carUsedTypeToString(){
		String str = "";
		if(carUsedType==1){
			str = "家庭自用车";
		}else if(carUsedType==2){
			str = "党政机关、事业团体";
		}else if(carUsedType==3){
			str = "非营业企业客车";
		}else if(carUsedType==4){
			str = "不区分营业非营业（仅人保）";
		}else if(carUsedType==5){
			str = "出租租赁（仅人保）";
		}else if(carUsedType==6){
			str = "营业货车（仅人保）";
		}else if(carUsedType==7){
			str = "非营业货车（仅人保）";
		}
		return str;
	}

}
