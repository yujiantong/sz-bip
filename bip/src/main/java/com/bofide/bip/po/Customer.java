package com.bofide.bip.po;

import java.text.ParseException;
import java.util.Date;

/**
 * 潜在客户总表
 *
 */
public class Customer {
    //潜在客户id
    private Integer customerId;
    //4s店
    private String fourSStore;
    //4s店id
    private Integer fourSStoreId;
    //车主
    private String carOwner;
    //被保险人
    private String insured;
    //联系人
    private String contact;
    // 联系方式
    private String contactWay;
    //现地址
    private String address;
    //车架号
    private String chassisNumber;
    //发动机号
    private String engineNumber;
    //去年保险公司
    private String insuranceCompLY;
    //商业险结束日期
    private Date syxrqEnd;
    //交强险到期日
    private Date jqxrqEnd;
    //最低折扣
    private Double zdZheKou;
    //汽车品牌
    private String carBrand;
    //车辆型号
    private String vehicleModel;
	//车牌号
    private String carLicenseNumber;
    //上牌日期
    private Date registrationDate;
    //续保类型
    private Integer renewalType;
    //去年招揽员
    private String solicitMemberLY;
    //去年投保险种
    private String insuranceTypeLY;
    //续保渠道
    private String renewalWay;
    //本店投保次数
    private Integer insurNumber;
    //去年投保日期
    private Date insurDateLY;
    //是否本店再维修客户 0:表示“否”；1表示“是”
    private Integer isMaintainAgain;
    //去年本店维修次数
    private Integer maintainNumberLY;
    //去年出险次数
    private Integer accidentNumberLY;
    //去年本店事故生产值
    private Integer accidentOutputValueLY;
    //服务顾问
    private String serviceConsultant;
    //客户级别
    private String customerLevel;
    //备注
    private String remark;
    //负责人
    private String principal;
    //负责人Id
    private Integer principalId;
   //去年优惠项目
    private String privilegeProLY;
    //去年投保保额
    private Double insuranceCoverageLY;
    //保单号
    private String insuranceNumber;
    //被保险人证件号
    private String certificateNumber;
    //服务顾问id
    private Integer serviceConsultantId;
    //客户来源
    private String customerSource;
    //客户性质
    private String customerCharacter;
    //是否高意向
    private Integer sfgyx;
    //潜客状态
    private Integer status;
    //虚拟的交强险到期日
    private Date virtualJqxdqr;
    //业务员
    private String clerk;
    //业务员id
    private Integer clerkId;
    //客户描述
    private String customerDescription;
    //上一年是否成交保单
    private Integer lastYearIsDeal;
    //潜客脱保状态
    private Integer cusLostInsurStatu;
    //距离脱保天数
    private long remainLostInsurDay;
    //导入记录的行数
    private int rowNumber;
    //壁虎交强险到期日
    private Date bhInsuranceEndDate;
    //是否根据壁虎的信息更新，1代表更新，0代表不更新
    private Integer ifUpdate;
    //建档人
    private Integer createrId;
    //是否贷款
    private Integer ifLoan;
    //壁虎查询的保险信息
    private String bxInfo;
    //壁虎更新状态
    private Integer updateStatus;
    //战败线索生成潜客的标志
    private Integer defeatFlag;
    /**
     * 厂牌型号
     */
    private String factoryLicenseType;
    
    /**
     * 车辆年审日期
     */
    private Date carAnnualCheckUpDate;
    
    /**
     * 去年被保险人
     */
    private String insuredLY;
    
    /**
     * 是否本店购买车辆
     */
    private Integer buyfromThisStore;
    
    /**
     * 接通次数
     */
    private Integer gotThroughNum;
    //自动获取壁虎保险续险信息的修改时间
    private Date bhUpdateTime;
    /**
     * 备用联系方式
     */
  	private String contactWayReserve;
  	/**
  	 * 导入标志
  	 * @return
  	 */
  	private Integer importFlag;
  	/**
  	 *伪列shopId,定时任务更新导入潜客信息需要
  	 * @return
  	 */
  	private String shopId;
  	/**
  	 * 伪列token,定时任务更新导入潜客信息需要
  	 */
  	private String token;
  	/**
  	 * 伪列定时任务导入更新需要
  	 * @return
  	 */
    private Integer userId;
    

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getShopId() {
		return shopId;
	}

	public void setShopId(String shopId) {
		this.shopId = shopId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Integer getImportFlag() {
		return importFlag;
	}

	public void setImportFlag(Integer importFlag) {
		this.importFlag = importFlag;
	}

	public String getContactWayReserve() {
		return contactWayReserve;
	}

	public void setContactWayReserve(String contactWayReserve) {
		this.contactWayReserve = contactWayReserve;
	}

	public Integer getGotThroughNum() {
		return gotThroughNum;
	}

	public void setGotThroughNum(Integer gotThroughNum) {
		this.gotThroughNum = gotThroughNum;
	}

	public String getFactoryLicenseType() {
		return factoryLicenseType;
	}

	public void setFactoryLicenseType(String factoryLicenseType) {
		this.factoryLicenseType = factoryLicenseType;
	}


	public Date getCarAnnualCheckUpDate() {
		return carAnnualCheckUpDate;
	}

	public void setCarAnnualCheckUpDate(Date carAnnualCheckUpDate) {
		this.carAnnualCheckUpDate = carAnnualCheckUpDate;
	}

	public String getInsuredLY() {
		return insuredLY;
	}

	public void setInsuredLY(String insuredLY) {
		this.insuredLY = insuredLY;
	}

	public Integer getBuyfromThisStore() {
		return buyfromThisStore;
	}

	public void setBuyfromThisStore(Integer buyfromThisStore) {
		this.buyfromThisStore = buyfromThisStore;
	}

	public long getRemainLostInsurDay() {
		return remainLostInsurDay;
	}

	public void setRemainLostInsurDay(long remainLostInsurDay) {
		this.remainLostInsurDay = remainLostInsurDay;
	}

	public Integer getCusLostInsurStatu() {
		return cusLostInsurStatu;
	}

	public void setCusLostInsurStatu(Integer cusLostInsurStatu) {
		this.cusLostInsurStatu = cusLostInsurStatu;
	}

	public Integer getLastYearIsDeal() {
		return lastYearIsDeal;
	}

	public void setLastYearIsDeal(Integer lastYearIsDeal) {
		this.lastYearIsDeal = lastYearIsDeal;
	}

	public String getCustomerDescription() {
		return customerDescription;
	}

	public void setCustomerDescription(String customerDescription) {
		this.customerDescription = customerDescription;
	}

	public String getClerk() {
		return clerk;
	}

	public void setClerk(String clerk) {
		this.clerk = clerk;
	}

	public Integer getClerkId() {
		return clerkId;
	}

	public void setClerkId(Integer clerkId) {
		this.clerkId = clerkId;
	}

	public Date getVirtualJqxdqr() {
		return virtualJqxdqr;
	}

	public void setVirtualJqxdqr(Date virtualJqxdqr) throws ParseException {
		this.virtualJqxdqr = virtualJqxdqr;
		/*//如果是未分配或者是已失销或者是出保单了则都不计算该值
		if(!this.customerLevel.equals("O") || !this.customerLevel.equals("F")){
			Calendar curCal = Calendar.getInstance();
			String year = new Integer(curCal.get(Calendar.YEAR)).toString();
			String month = new Integer(curCal.get(Calendar.MONTH)+1).toString();
			String day = new Integer(curCal.get(Calendar.DAY_OF_MONTH)).toString();
			StringBuffer sb = new StringBuffer();
			sb.append(year);
			sb.append("-");
			sb.append(month);
			sb.append("-");
			sb.append(day);
			String curDayStr = sb.toString();
			SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd");
			Date curDay = null;
			curDay = sdf.parse(curDayStr);
			Calendar vjCal = Calendar.getInstance();
			vjCal.setTime(this.virtualJqxdqr);
			int vjYear = vjCal.get(Calendar.YEAR);
			int vjMonth = vjCal.get(Calendar.MONTH)+1;
			int vjDay = vjCal.get(Calendar.DAY_OF_MONTH);
			int lastYear = vjYear-1;
			String lastYearStr = new Integer(lastYear).toString();
			String monthStr = new Integer(vjMonth).toString();
			String dayStr = new Integer(vjDay).toString();
			StringBuffer sb2 = new StringBuffer();
			sb2.append(lastYearStr);
			sb2.append("-");
			sb2.append(monthStr);
			sb2.append("-");
			sb2.append(dayStr);
			String lastVjStr = sb2.toString();
			SimpleDateFormat sdf2 = new SimpleDateFormat("yy-MM-dd");
			Date lastVj = null;
			lastVj = sdf2.parse(lastVjStr);
			long curTime = curDay.getTime();
			long vjTime = vjCal.getTimeInMillis();
			long lastVjTime = lastVj.getTime();
			long between_days = 0;
			if(this.cusLostInsurStatu == 2){
				between_days = lastVjTime-curTime;
			}else{
				between_days = vjTime-curTime;
			}
			long remainDay = between_days/(1000*3600*24); 
			this.remainLostInsurDay = remainDay;
		}*/
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getCertificateNumber() {
		return certificateNumber;
	}

	public void setCertificateNumber(String certificateNumber) {
		this.certificateNumber = certificateNumber;
	}

	public Integer getServiceConsultantId() {
		return serviceConsultantId;
	}

	public void setServiceConsultantId(Integer serviceConsultantId) {
		this.serviceConsultantId = serviceConsultantId;
	}

	public String getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(String customerSource) {
		this.customerSource = customerSource;
	}

	public String getCustomerCharacter() {
		return customerCharacter;
	}

	public void setCustomerCharacter(String customerCharacter) {
		this.customerCharacter = customerCharacter;
	}

	public Integer getSfgyx() {
		return sfgyx;
	}

	public void setSfgyx(Integer sfgyx) {
		this.sfgyx = sfgyx;
	}

   
    public String getInsuranceNumber() {
		return insuranceNumber;
	}

	public void setInsuranceNumber(String insuranceNumber) {
		this.insuranceNumber = insuranceNumber;
	}

	public Integer getPrincipalId() {
  		return principalId;
  	}

  	public void setPrincipalId(Integer principalId) {
  		this.principalId = principalId;
  	}
    
	public Double getInsuranceCoverageLY() {
		return insuranceCoverageLY;
	}

	public void setInsuranceCoverageLY(Double insuranceCoverageLY) {
		this.insuranceCoverageLY = insuranceCoverageLY;
	}

	public Integer getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}

	public String getFourSStore() {
		return fourSStore;
	}

	public void setFourSStore(String fourSStore) {
		this.fourSStore = fourSStore;
	}

	public Integer getFourSStoreId() {
		return fourSStoreId;
	}

	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}

	public String getCarOwner() {
		return carOwner;
	}

	public void setCarOwner(String carOwner) {
		this.carOwner = carOwner;
	}

	public String getInsured() {
		return insured;
	}

	public void setInsured(String insured) {
		this.insured = insured;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getContactWay() {
		return contactWay;
	}

	public void setContactWay(String contactWay) {
		this.contactWay = contactWay;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getChassisNumber() {
		return chassisNumber;
	}

	public void setChassisNumber(String chassisNumber) {
		this.chassisNumber = chassisNumber;
	}

	public String getEngineNumber() {
		return engineNumber;
	}

	public void setEngineNumber(String engineNumber) {
		this.engineNumber = engineNumber;
	}

	public String getInsuranceCompLY() {
		return insuranceCompLY;
	}

	public void setInsuranceCompLY(String insuranceCompLY) {
		this.insuranceCompLY = insuranceCompLY;
	}

	

	public String getCarBrand() {
		return carBrand;
	}

	public void setCarBrand(String carBrand) {
		this.carBrand = carBrand;
	}

	public String getVehicleModel() {
		return vehicleModel;
	}

	public void setVehicleModel(String vehicleModel) {
		this.vehicleModel = vehicleModel;
	}

	public String getCarLicenseNumber() {
		return carLicenseNumber;
	}

	public void setCarLicenseNumber(String carLicenseNumber) {
		this.carLicenseNumber = carLicenseNumber;
	}

	public Date getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}

	public Integer getRenewalType() {
		return renewalType;
	}

	public void setRenewalType(Integer renewalType) {
		this.renewalType = renewalType;
	}

	public String getSolicitMemberLY() {
		return solicitMemberLY;
	}

	public void setSolicitMemberLY(String solicitMemberLY) {
		this.solicitMemberLY = solicitMemberLY;
	}

	public String getInsuranceTypeLY() {
		return insuranceTypeLY;
	}

	public void setInsuranceTypeLY(String insuranceTypeLY) {
		this.insuranceTypeLY = insuranceTypeLY;
	}

	public String getRenewalWay() {
		return renewalWay;
	}

	public void setRenewalWay(String renewalWay) {
		this.renewalWay = renewalWay;
	}

	public Integer getInsurNumber() {
		return insurNumber;
	}

	public void setInsurNumber(Integer insurNumber) {
		this.insurNumber = insurNumber;
	}

	public Date getInsurDateLY() {
		return insurDateLY;
	}

	public void setInsurDateLY(Date insurDateLY) {
		this.insurDateLY = insurDateLY;
	}

	public Integer getIsMaintainAgain() {
		return isMaintainAgain;
	}

	public void setIsMaintainAgain(Integer isMaintainAgain) {
		this.isMaintainAgain = isMaintainAgain;
	}

	public Integer getMaintainNumberLY() {
		return maintainNumberLY;
	}

	public void setMaintainNumberLY(Integer maintainNumberLY) {
		this.maintainNumberLY = maintainNumberLY;
	}

	public Integer getAccidentNumberLY() {
		return accidentNumberLY;
	}

	public void setAccidentNumberLY(Integer accidentNumberLY) {
		this.accidentNumberLY = accidentNumberLY;
	}

	public Integer getAccidentOutputValueLY() {
		return accidentOutputValueLY;
	}

	public void setAccidentOutputValueLY(Integer accidentOutputValueLY) {
		this.accidentOutputValueLY = accidentOutputValueLY;
	}

	public String getServiceConsultant() {
		return serviceConsultant;
	}

	public void setServiceConsultant(String serviceConsultant) {
		this.serviceConsultant = serviceConsultant;
	}

	public String getCustomerLevel() {
		return customerLevel;
	}

	public void setCustomerLevel(String customerLevel) {
		this.customerLevel = customerLevel;
	}


	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPrincipal() {
		return principal;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	public String getPrivilegeProLY() {
		return privilegeProLY;
	}

	public void setPrivilegeProLY(String privilegeProLY) {
		this.privilegeProLY = privilegeProLY;
	}
	
	public Date getSyxrqEnd() {
		return syxrqEnd;
	}

	public void setSyxrqEnd(Date syxrqEnd) {
		this.syxrqEnd = syxrqEnd;
	}
	 public Date getJqxrqEnd() {
		return jqxrqEnd;
	}

	public void setJqxrqEnd(Date jqxrqEnd) {
		this.jqxrqEnd = jqxrqEnd;
	}
    
	public Double getZdZheKou() {
		return zdZheKou;
	}

	public void setZdZheKou(Double zdZheKou) {
		this.zdZheKou = zdZheKou;
	}

	public int getRowNumber() {
		return rowNumber;
	}

	public void setRowNumber(int rowNumber) {
		this.rowNumber = rowNumber;
	}

	public Date getBhInsuranceEndDate() {
		return bhInsuranceEndDate;
	}

	public void setBhInsuranceEndDate(Date bhInsuranceEndDate) {
		this.bhInsuranceEndDate = bhInsuranceEndDate;
	}

	public Integer getIfUpdate() {
		return ifUpdate;
	}

	public void setIfUpdate(Integer ifUpdate) {
		this.ifUpdate = ifUpdate;
	}

	public Integer getCreaterId() {
		return createrId;
	}

	public void setCreaterId(Integer createrId) {
		this.createrId = createrId;
	}

	public Integer getIfLoan() {
		return ifLoan;
	}

	public void setIfLoan(Integer ifLoan) {
		this.ifLoan = ifLoan;
	}

	public String getBxInfo() {
		return bxInfo;
	}

	public void setBxInfo(String bxInfo) {
		this.bxInfo = bxInfo;
	}

	public Date getBhUpdateTime() {
		return bhUpdateTime;
	}

	public void setBhUpdateTime(Date bhUpdateTime) {
		this.bhUpdateTime = bhUpdateTime;
	}

	public Integer getUpdateStatus() {
		return updateStatus;
	}

	public void setUpdateStatus(Integer updateStatus) {
		this.updateStatus = updateStatus;
	}

	public Integer getDefeatFlag() {
		return defeatFlag;
	}

	public void setDefeatFlag(Integer defeatFlag) {
		this.defeatFlag = defeatFlag;
	}
	
	
	
}