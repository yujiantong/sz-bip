package com.bofide.bip.po;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.bofide.bip.common.po.CoverType;
import com.bofide.common.util.DateUtil;

/**
 * 将要续保潜客
 *
 */
public class RenewalingCustomer {
	//主键
	private Integer id;
	//潜在客户id
    private Integer customerId;
   //车主
    private String carOwner;
    // 被保险人
    private String insured;
    //被保险人证件号
    private String certificateNumber;
    //联系人
    private String contact;
	//联系方式
    private String contactWay;
    //现地址
    private String address;
	//车架号
    private String chassisNumber;
    //发动机号
    private String engineNumber;
    //去年保险公司
    private String insuranceCompLY;
    //商业险到期日
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
   // 续保类型
    private Integer renewalType;
   // 去年招揽员
    private String solicitMemberLY;
    //去年优惠项目
    private String privilegeProLY;
    //去年投保险种
    private String insuranceTypeLY;
   // 续保渠道
    private String renewalWay;
    //本店投保次数
    private Integer insurNumber;
	// 去年投保日期
    private Date insurDateLY;
    //去年投保保额
    private Double insuranceCoverageLY;
   //是否本店再维修客户 0:表示“是”；1表示“否”
    private Integer isMaintainAgain;
    //去年本店维修次数
    private Integer maintainNumberLY;
    //去年出险次数
    private Integer accidentNumberLY;
    //去年本店事故生产值
    private Integer accidentOutputValueLY;
    //服务顾问id
    private Integer serviceConsultantId;
    //客户来源
    private String customerSource;
    //客户性质
    private String customerCharacter;
    //是否高意向
    private Integer sfgyx;
   //服务顾问
    private String serviceConsultant;
    //客户级别
    private String customerLevel;
    //备注
    private String remark;
    //潜客状态
    private Integer status;
   
	//是否邀约 0:表示“是”；1表示“否”
    private Integer isInvite;
    //邀约日期
    private Date inviteDate;
    //是否到店 0:表示“是”；1表示“否”
    private Integer isComeStore;
   //到店日期
    private Date comeStoreDate;
    //末次跟踪日期
    private Date lastTraceDate;
    // 当前负责人
    private String principal;
    //当前负责人id
    private Integer principalId;
   //当前业务员
    private String clerk;
   //当前业务员id
    private Integer clerkId;
   // 4s店
    private String fourSStore;
  //4s店id
    private Integer fourSStoreId;
    //保单号
    private String insuranceNumber;
    //末次跟踪结果
    private String lastTraceResult;
    //应跟踪日期
    private Date willingTraceDate;
    //是否报价
    private Integer isQuote;
    //报价日期
    private Date quoteDate;
    //到店次数
    private Integer comeStoreNumber;
 
    //初次接收日期
    private Date firstAcceptDate;
   
    //持有天数
    private long hadDays;
    //将脱保
    private boolean outInsurance;
    //虚拟的交强险到期日
    private Date virtualJqxdqr;
    //客户描述
    private String customerDescription;
    //上一年是否成交
    private Integer lastYearIsDeal;
	private CoverType coverType;
	 //潜客脱保状态
    private Integer cusLostInsurStatu;
    
    // 潜客车架号对应的保单
    private List<InsuranceBill> insuranceBills;
    //潜客的对应的分配表
    private List<CustomerAssign> customerAssigns;
    //潜客跟踪记录列表
    private List<CustomerTraceRecode> customerTraceRecodes;
    //距离脱保天数
    private Long remainLostInsurDay;
    //持有人 
    private String holder;
    //持有人 Id
    private String holderId;
    //持有人角色
    private String holderRoleId;
    //壁虎交强险到期日
    private Date bhInsuranceEndDate;
    //是否根据壁虎的信息更新，1代表更新，0代表不更新
    private Integer ifUpdate;
    private Integer createrId;
    //是否贷款
    private Integer ifLoan;
    //失销原因,为了封装数据,用于客服经理导出失销潜客
    private String sxyy;
    //伪列，虚拟的级别，在下发潜客时识别潜客原来的级别用到
    private String fictitiousCustomerLevel;
    //伪列，虚拟负责人，在下发潜客时识别潜客原来的负责人用到
    private String fictitiousprincipal;
    //伪列，虚拟负责人Id，在下发潜客时识别潜客原来的负责人用到
    private Integer fictitiousprincipalId;
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
    
    /**
     * 备用联系方式
     */
  	private String contactWayReserve;
  	//自动获取壁虎保险续险信息的修改时间
  	private Date bhUpdateTime;
  	//建档(创建)时间
  	private Date createTime;
  	//当前跟踪次数
  	private Integer gzCount;
  	//昵称
  	private String nicheng;
  	//战败线索生成潜客的标志
  	private Integer defeatFlag;
  	
  	
    public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
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


	public Integer getCreaterId() {
		return createrId;
	}

	public void setCreaterId(Integer createrId) {
		this.createrId = createrId;
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
    public String getHolderRoleId() {
		return holderRoleId;
	}

	public void setHolderRoleId(String holderRoleId) {
		this.holderRoleId = holderRoleId;
	}

	public String getHolderId() {
		return holderId;
	}

	public void setHolderId(String holderId) {
		this.holderId = holderId;
	}

	public String getHolder() {
		return holder;
	}

	public void setHolder(String holder) {
		this.holder = holder;
	}

	public Long getRemainLostInsurDay() {
		return remainLostInsurDay;
	}

	public void setRemainLostInsurDay(Long remainLostInsurDay) {
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

	public CoverType getCoverType() {
		return coverType;
	}

	public void setCoverType(CoverType coverType) {
		this.coverType = coverType;
	}

	public String getCertificateNumber() {
		return certificateNumber;
	}

	public void setCertificateNumber(String certificateNumber) {
		this.certificateNumber = certificateNumber;
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

    
    public Date getVirtualJqxdqr() {
		return virtualJqxdqr;
	}
    
    public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}
	public void setVirtualJqxdqr(Date virtualJqxdqr) throws ParseException {
		this.virtualJqxdqr = virtualJqxdqr;
		//如果是未分配或者是已失销或者是出保单了则都不计算该值
		if(this.status != 1){
			if("O".equals(this.customerLevel) || "F".equals(this.customerLevel) || "S".equals(this.customerLevel)){
				this.remainLostInsurDay = null;
			}else{
				Calendar curCal = Calendar.getInstance();
				Date curDay = DateUtil.formatDate(curCal);
				Calendar vjCal = Calendar.getInstance();
				vjCal.setTime(this.virtualJqxdqr);
				long curTime = curDay.getTime();
				long vjTime = vjCal.getTimeInMillis();
				long between_days = 0;
				between_days = vjTime-curTime;
				
				long remainDay = between_days/(1000*3600*24); 
				this.remainLostInsurDay = remainDay;
			}
		}else{
			this.remainLostInsurDay = null;
		}
	}
    
    public List<InsuranceBill> getInsuranceBills() {
		return insuranceBills;
	}
	public void setInsuranceBills(List<InsuranceBill> insuranceBills) {
		this.insuranceBills = insuranceBills;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
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
	public Integer getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
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
	public Double getInsuranceCoverageLY() {
		return insuranceCoverageLY;
	}
	public void setInsuranceCoverageLY(Double insuranceCoverageLY) {
		this.insuranceCoverageLY = insuranceCoverageLY;
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
	public Integer getIsInvite() {
		return isInvite;
	}
	public void setIsInvite(Integer isInvite) {
		this.isInvite = isInvite;
	}
	public Date getInviteDate() {
		return inviteDate;
	}
	public void setInviteDate(Date inviteDate) {
		this.inviteDate = inviteDate;
	}
	public Integer getIsComeStore() {
		return isComeStore;
	}
	public void setIsComeStore(Integer isComeStore) {
		this.isComeStore = isComeStore;
	}
	public Date getComeStoreDate() {
		return comeStoreDate;
	}
	public void setComeStoreDate(Date comeStoreDate) {
		this.comeStoreDate = comeStoreDate;
	}
	public Date getLastTraceDate() {
		return lastTraceDate;
	}
	public void setLastTraceDate(Date lastTraceDate) {
		this.lastTraceDate = lastTraceDate;
	}
	public String getPrincipal() {
		return principal;
	}
	public void setPrincipal(String principal) {
		this.principal = principal;
	}
	public Integer getPrincipalId() {
		return principalId;
	}
	public void setPrincipalId(Integer principalId) {
		this.principalId = principalId;
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
	public String getInsuranceNumber() {
		return insuranceNumber;
	}
	public void setInsuranceNumber(String insuranceNumber) {
		this.insuranceNumber = insuranceNumber;
	}
	public String getLastTraceResult() {
		return lastTraceResult;
	}
	public void setLastTraceResult(String lastTraceResult) {
		this.lastTraceResult = lastTraceResult;
	}
	public Date getWillingTraceDate() {
		return willingTraceDate;
	}
	public void setWillingTraceDate(Date willingTraceDate) {
		this.willingTraceDate = willingTraceDate;
	}
	public Integer getIsQuote() {
		return isQuote;
	}
	public void setIsQuote(Integer isQuote) {
		this.isQuote = isQuote;
	}
	public Date getQuoteDate() {
		return quoteDate;
	}
	public void setQuoteDate(Date quoteDate) {
		this.quoteDate = quoteDate;
	}
	public Integer getComeStoreNumber() {
		return comeStoreNumber;
	}
	public void setComeStoreNumber(Integer comeStoreNumber) {
		this.comeStoreNumber = comeStoreNumber;
	}
	
	public Date getFirstAcceptDate() {
		return firstAcceptDate;
	}
	public void setFirstAcceptDate(Date firstAcceptDate) {
		this.firstAcceptDate = firstAcceptDate;
	}
	
	public long getHadDays() {
		return hadDays;
	}
	public void setHadDays(long hadDays) {
		this.hadDays = hadDays;
	}
	public boolean isOutInsurance() {
		return outInsurance;
	}
	public void setOutInsurance(boolean outInsurance) {
		this.outInsurance = outInsurance;
	}
	public List<CustomerAssign> getCustomerAssigns() {
		return customerAssigns;
	}
	public void setCustomerAssigns(List<CustomerAssign> customerAssigns) {
		this.customerAssigns = customerAssigns;
	}
	public List<CustomerTraceRecode> getCustomerTraceRecodes() {
		return customerTraceRecodes;
	}
	public void setCustomerTraceRecodes(List<CustomerTraceRecode> customerTraceRecodes) {
		this.customerTraceRecodes = customerTraceRecodes;
	}
	public String getPrivilegeProLY() {
		return privilegeProLY;
	}
	public void setPrivilegeProLY(String privilegeProLY) {
		this.privilegeProLY = privilegeProLY;
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

	public Integer getIfLoan() {
		return ifLoan;
	}

	public void setIfLoan(Integer ifLoan) {
		this.ifLoan = ifLoan;
	}

	public Date getBhUpdateTime() {
		return bhUpdateTime;
	}

	public void setBhUpdateTime(Date bhUpdateTime) {
		this.bhUpdateTime = bhUpdateTime;
	}

	public String getSxyy() {
		return sxyy;
	}

	public void setSxyy(String sxyy) {
		this.sxyy = sxyy;
	}

	public Integer getGzCount() {
		return gzCount;
	}

	public void setGzCount(Integer gzCount) {
		this.gzCount = gzCount;
	}

	public String getNicheng() {
		return nicheng;
	}

	public void setNicheng(String nicheng) {
		this.nicheng = nicheng;
	}

	public Integer getDefeatFlag() {
		return defeatFlag;
	}

	public void setDefeatFlag(Integer defeatFlag) {
		this.defeatFlag = defeatFlag;
	}

	public String getFictitiousCustomerLevel() {
		return fictitiousCustomerLevel;
	}

	public void setFictitiousCustomerLevel(String fictitiousCustomerLevel) {
		this.fictitiousCustomerLevel = fictitiousCustomerLevel;
	}

	public String getFictitiousprincipal() {
		return fictitiousprincipal;
	}

	public void setFictitiousprincipal(String fictitiousprincipal) {
		this.fictitiousprincipal = fictitiousprincipal;
	}

	public Integer getFictitiousprincipalId() {
		return fictitiousprincipalId;
	}

	public void setFictitiousprincipalId(Integer fictitiousprincipalId) {
		this.fictitiousprincipalId = fictitiousprincipalId;
	}

}