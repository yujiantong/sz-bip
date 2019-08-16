package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.bofide.bip.common.po.CoverType;
import com.bofide.common.util.JsonDateDeserializerUtil;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

/**
 * 保单
 *
 */
public class InsuranceBill implements Serializable {
	private static final long serialVersionUID = 1L;

	//保单id
    private Integer insuranceBillId;
    //4s店id
    private Integer fourSStoreId;
    //4s店
    private String foursStore;
    //车牌号
    private String carLicenseNumber;
    //车架号
    private String chassisNumber;
    //发动机号
    private String engineNumber;
    //上牌日期
    private Date registrationDate;
    //汽车品牌
    private String carBrand;
    //车辆型号
    private String vehicleModel;
    //商业保险单号
    private String binsuranceNumber;
    //商业险保额
    private Double binsuranceCoverage;
    //车船税金额
    private Double vehicleTax;
    //优惠项目
    private String privilegePro;
    //续保渠道
    private String renewalWay;
    //本店投保次数
    private Integer insurNumber;
    //交强险单号
    private String cinsuranceNumber;
    //交强险保额
    private Double cinsuranceCoverage;
    //保费合计
    private Double premiumCount;
    //优惠金额
    private Double privilegeSum;
	//赠送成本合计
    private Double donateCostCount;
    //手续费合计
    private Double factorageCount;
    //实收金额
    private Double realPay;
    //付款方式
    private String payWay;
    //运单方式
    private String sdfs;
    //利润
    private Double profit;
    //承保类型
    private Integer coverType;
    //投保日期
    private Date insurDate;
    //商业险开始日期
    @JsonDeserialize(using = JsonDateDeserializerUtil.class)
    private Date syxrqStart;
    //商业险结束日期
    @JsonDeserialize(using = JsonDateDeserializerUtil.class)
    private Date syxrqEnd;
    //交强险开始日期
    @JsonDeserialize(using = JsonDateDeserializerUtil.class)
    private Date jqxrqStart;
    //交强险结束日期
    @JsonDeserialize(using = JsonDateDeserializerUtil.class)
    private Date jqxrqEnd;
    //去年保额
    private Double qnbe;
    //去年商业险金额
    private Double qnsyxje;
    //去年交强险金额
    private Double qnjqxje;
    //去年车船税金额
    private Double qnccsje;
    //开票名称
    private String invoiceName;
    //保险公司
    private String insuranceCompName;
    //商业险险种
    private String insuranceType;
    //车损投保金额(伪列，数据库没有)
    private String chesuntbje;
    //备注
    private String remark;
    //负责人id
    private Integer principalId;
    // 负责人
    private String principal;
    //业务员和销售员id
    private Integer clerkId;
    //业务员或者销售员
    private String clerk;
    //出单员id
    private Integer insuranceWriterId;
    //出单员
    private String insuranceWriter;
    //收银员
    private String cashier;
    //招揽员id
    private Integer solicitMemberId;
    //招揽员
    private String solicitMember;
    //车主
    private String carOwner;
	//被保险人
    private String insured;
    //被保险人证件号
    private String certificateNumber;
    //联系人
    private String contact;
    //联系方式
    private String contactWay;
    //客户来源
    private String customerSource;
    //客户性质
    private String customerCharacter;
    //现地址
    private String address;
    //出单日期
    private Date cdrq;
    //承保开始日期(查询条件)
    private Date cbrqStart;
    //承保结束日期(查询条件)
    private Date cbrqEnd;
    //导入记录行数
    private int rowNumber;
    //审批单id
    private Integer approvalBillId;
    //创建时间
    private Date foundDate;
    
    /**
     * 是否贷款
     */
    private Integer sfdk;
    //赠送优惠
    private Double giftDiscount;
    //综合优惠
    private Double comprehensiveDiscount;
    //现金优惠点位
    private Double xjyhdw;
    //储值卡金额
    private Double czkje;
    //储值卡金额点位
    private Double czkjedw;
    //商业险险种信息
    List<InsuType> insuTypes;
    //商业险手续费百分比
    private Float syxsxfRate;
    //交强险手续费百分比
    private Float jqxsxfRate;
    
    public List<InsuType> getInsuTypes() {
		return insuTypes;
	}

	public void setInsuTypes(List<InsuType> insuTypes) {
		this.insuTypes = insuTypes;
	}

	public Integer getApprovalBillId() {
		return approvalBillId;
	}

	public void setApprovalBillId(Integer approvalBillId) {
		this.approvalBillId = approvalBillId;
	}

	public Date getCdrq() {
		return cdrq;
	}

	public void setCdrq(Date cdrq) {
		this.cdrq = cdrq;
	}

	private CoverType coverTypeName;

	public Integer getInsuranceBillId() {
		return insuranceBillId;
	}

	public void setInsuranceBillId(Integer insuranceBillId) {
		this.insuranceBillId = insuranceBillId;
	}

	public Integer getFourSStoreId() {
		return fourSStoreId;
	}

	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}

	public String getFoursStore() {
		return foursStore;
	}

	public void setFoursStore(String foursStore) {
		this.foursStore = foursStore;
	}

	public String getCarLicenseNumber() {
		return carLicenseNumber;
	}

	public void setCarLicenseNumber(String carLicenseNumber) {
		this.carLicenseNumber = carLicenseNumber;
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

	public Date getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
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

	public String getBinsuranceNumber() {
		return binsuranceNumber;
	}

	public void setBinsuranceNumber(String binsuranceNumber) {
		this.binsuranceNumber = binsuranceNumber;
	}

	public Double getBinsuranceCoverage() {
		return binsuranceCoverage;
	}

	public void setBinsuranceCoverage(Double binsuranceCoverage) {
		this.binsuranceCoverage = binsuranceCoverage;
	}
	
	public String getPrivilegePro() {
		return privilegePro;
	}

	public void setPrivilegePro(String privilegePro) {
		this.privilegePro = privilegePro;
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

	public String getCinsuranceNumber() {
		return cinsuranceNumber;
	}

	public void setCinsuranceNumber(String cinsuranceNumber) {
		this.cinsuranceNumber = cinsuranceNumber;
	}

	public String getPayWay() {
		return payWay;
	}

	public void setPayWay(String payWay) {
		this.payWay = payWay;
	}

	public String getSdfs() {
		return sdfs;
	}

	public void setSdfs(String sdfs) {
		this.sdfs = sdfs;
	}
	
	public Integer getCoverType() {
		return coverType;
	}

	public void setCoverType(Integer coverType) {
		this.coverType = coverType;
	}

	public Date getInsurDate() {
		return insurDate;
	}

	public void setInsurDate(Date insurDate) {
		this.insurDate = insurDate;
	}

	public Date getSyxrqStart() {
		return syxrqStart;
	}

	public void setSyxrqStart(Date syxrqStart) {
		this.syxrqStart = syxrqStart;
	}

	public Date getSyxrqEnd() {
		return syxrqEnd;
	}

	public void setSyxrqEnd(Date syxrqEnd) {
		this.syxrqEnd = syxrqEnd;
	}

	public Date getJqxrqStart() {
		return jqxrqStart;
	}

	public void setJqxrqStart(Date jqxrqStart) {
		this.jqxrqStart = jqxrqStart;
	}

	public Date getJqxrqEnd() {
		return jqxrqEnd;
	}

	public void setJqxrqEnd(Date jqxrqEnd) {
		this.jqxrqEnd = jqxrqEnd;
	}

	public String getInvoiceName() {
		return invoiceName;
	}

	public void setInvoiceName(String invoiceName) {
		this.invoiceName = invoiceName;
	}

	public String getInsuranceCompName() {
		return insuranceCompName;
	}

	public void setInsuranceCompName(String insuranceCompName) {
		this.insuranceCompName = insuranceCompName;
	}

	public String getInsuranceType() {
		return insuranceType;
	}

	public void setInsuranceType(String insuranceType) {
		this.insuranceType = insuranceType;
	}

	public String getChesuntbje() {
		return chesuntbje;
	}

	public void setChesuntbje(String chesuntbje) {
		this.chesuntbje = chesuntbje;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getPrincipalId() {
		return principalId;
	}

	public void setPrincipalId(Integer principalId) {
		this.principalId = principalId;
	}

	public String getPrincipal() {
		return principal;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	public Integer getClerkId() {
		return clerkId;
	}

	public void setClerkId(Integer clerkId) {
		this.clerkId = clerkId;
	}

	public String getClerk() {
		return clerk;
	}

	public void setClerk(String clerk) {
		this.clerk = clerk;
	}

	public Integer getInsuranceWriterId() {
		return insuranceWriterId;
	}

	public void setInsuranceWriterId(Integer insuranceWriterId) {
		this.insuranceWriterId = insuranceWriterId;
	}

	public String getInsuranceWriter() {
		return insuranceWriter;
	}

	public void setInsuranceWriter(String insuranceWriter) {
		this.insuranceWriter = insuranceWriter;
	}

	public String getCashier() {
		return cashier;
	}

	public void setCashier(String cashier) {
		this.cashier = cashier;
	}

	public Integer getSolicitMemberId() {
		return solicitMemberId;
	}

	public void setSolicitMemberId(Integer solicitMemberId) {
		this.solicitMemberId = solicitMemberId;
	}

	public String getSolicitMember() {
		return solicitMember;
	}

	public void setSolicitMember(String solicitMember) {
		this.solicitMember = solicitMember;
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

	public String getCertificateNumber() {
		return certificateNumber;
	}

	public void setCertificateNumber(String certificateNumber) {
		this.certificateNumber = certificateNumber;
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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public CoverType getCoverTypeName() {
		return coverTypeName;
	}

	public void setCoverTypeName(CoverType coverTypeName) {
		this.coverTypeName = coverTypeName;
	}
	
	

	public Date getCbrqStart() {
		return cbrqStart;
	}

	public void setCbrqStart(Date cbrqStart) {
		this.cbrqStart = cbrqStart;
	}

	public Date getCbrqEnd() {
		return cbrqEnd;
	}

	public void setCbrqEnd(Date cbrqEnd) {
		this.cbrqEnd = cbrqEnd;
	}

	public Double getVehicleTax() {
		return vehicleTax;
	}

	public void setVehicleTax(Double vehicleTax) {
		this.vehicleTax = vehicleTax;
	}

	public Double getCinsuranceCoverage() {
		return cinsuranceCoverage;
	}

	public void setCinsuranceCoverage(Double cinsuranceCoverage) {
		this.cinsuranceCoverage = cinsuranceCoverage;
	}

	public Double getPremiumCount() {
		return premiumCount;
	}

	public void setPremiumCount(Double premiumCount) {
		this.premiumCount = premiumCount;
	}

	public Double getPrivilegeSum() {
		return privilegeSum;
	}

	public void setPrivilegeSum(Double privilegeSum) {
		this.privilegeSum = privilegeSum;
	}

	public Double getDonateCostCount() {
		return donateCostCount;
	}

	public void setDonateCostCount(Double donateCostCount) {
		this.donateCostCount = donateCostCount;
	}

	public Double getFactorageCount() {
		return factorageCount;
	}

	public void setFactorageCount(Double factorageCount) {
		this.factorageCount = factorageCount;
	}

	public Double getRealPay() {
		return realPay;
	}

	public void setRealPay(Double realPay) {
		this.realPay = realPay;
	}

	public Double getProfit() {
		return profit;
	}

	public void setProfit(Double profit) {
		this.profit = profit;
	}

	public Double getQnbe() {
		return qnbe;
	}

	public void setQnbe(Double qnbe) {
		this.qnbe = qnbe;
	}

	public Double getQnsyxje() {
		return qnsyxje;
	}

	public void setQnsyxje(Double qnsyxje) {
		this.qnsyxje = qnsyxje;
	}

	public Double getQnjqxje() {
		return qnjqxje;
	}

	public void setQnjqxje(Double qnjqxje) {
		this.qnjqxje = qnjqxje;
	}

	public Double getQnccsje() {
		return qnccsje;
	}

	public void setQnccsje(Double qnccsje) {
		this.qnccsje = qnccsje;
	}

	public int getRowNumber() {
		return rowNumber;
	}

	public void setRowNumber(int rowNumber) {
		this.rowNumber = rowNumber;
	}

	public Date getFoundDate() {
		return foundDate;
	}

	public void setFoundDate(Date foundDate) {
		this.foundDate = foundDate;
	}

	/**  
	 * 是否贷款  
	 * @return sfdk   是否贷款  
	 */
	public Integer getSfdk() {
		return sfdk;
	}

	/**  
	 * 是否贷款  
	 * @param sfdk  是否贷款  
	 */
	public void setSfdk(Integer sfdk) {
		this.sfdk = sfdk;
	}

	public Double getGiftDiscount() {
		return giftDiscount;
	}

	public void setGiftDiscount(Double giftDiscount) {
		this.giftDiscount = giftDiscount;
	}

	public Double getComprehensiveDiscount() {
		return comprehensiveDiscount;
	}

	public void setComprehensiveDiscount(Double comprehensiveDiscount) {
		this.comprehensiveDiscount = comprehensiveDiscount;
	}

	public Double getXjyhdw() {
		return xjyhdw;
	}

	public void setXjyhdw(Double xjyhdw) {
		this.xjyhdw = xjyhdw;
	}

	public Double getCzkje() {
		return czkje;
	}

	public void setCzkje(Double czkje) {
		this.czkje = czkje;
	}

	public Double getCzkjedw() {
		return czkjedw;
	}

	public void setCzkjedw(Double czkjedw) {
		this.czkjedw = czkjedw;
	}

	public Float getSyxsxfRate() {
		return syxsxfRate;
	}

	public void setSyxsxfRate(Float syxsxfRate) {
		this.syxsxfRate = syxsxfRate;
	}

	public Float getJqxsxfRate() {
		return jqxsxfRate;
	}

	public void setJqxsxfRate(Float jqxsxfRate) {
		this.jqxsxfRate = jqxsxfRate;
	}

	@Override
	public String toString() {
		return "InsuranceBill [insuranceBillId=" + insuranceBillId
				+ ", fourSStoreId=" + fourSStoreId + ", foursStore="
				+ foursStore + ", carLicenseNumber=" + carLicenseNumber
				+ ", chassisNumber=" + chassisNumber + ", engineNumber="
				+ engineNumber + ", registrationDate=" + registrationDate
				+ ", carBrand=" + carBrand + ", vehicleModel=" + vehicleModel
				+ ", binsuranceNumber=" + binsuranceNumber
				+ ", binsuranceCoverage=" + binsuranceCoverage
				+ ", vehicleTax=" + vehicleTax + ", privilegePro="
				+ privilegePro + ", renewalWay=" + renewalWay
				+ ", insurNumber=" + insurNumber + ", cinsuranceNumber="
				+ cinsuranceNumber + ", cinsuranceCoverage="
				+ cinsuranceCoverage + ", premiumCount=" + premiumCount
				+ ", privilegeSum=" + privilegeSum + ", donateCostCount="
				+ donateCostCount + ", factorageCount=" + factorageCount
				+ ", realPay=" + realPay + ", payWay=" + payWay + ", sdfs="
				+ sdfs + ", profit=" + profit + ", coverType=" + coverType
				+ ", insurDate=" + insurDate + ", syxrqStart=" + syxrqStart
				+ ", syxrqEnd=" + syxrqEnd + ", jqxrqStart=" + jqxrqStart
				+ ", jqxrqEnd=" + jqxrqEnd + ", qnbe=" + qnbe + ", qnsyxje="
				+ qnsyxje + ", qnjqxje=" + qnjqxje + ", qnccsje=" + qnccsje
				+ ", invoiceName=" + invoiceName + ", insuranceCompName="
				+ insuranceCompName + ", insuranceType=" + insuranceType
				+ ", remark=" + remark + ", principalId=" + principalId
				+ ", principal=" + principal + ", clerkId=" + clerkId
				+ ", clerk=" + clerk + ", insuranceWriterId="
				+ insuranceWriterId + ", insuranceWriter=" + insuranceWriter
				+ ", cashier=" + cashier + ", solicitMemberId="
				+ solicitMemberId + ", solicitMember=" + solicitMember
				+ ", carOwner=" + carOwner + ", insured=" + insured
				+ ", certificateNumber=" + certificateNumber + ", contact="
				+ contact + ", contactWay=" + contactWay + ", customerSource="
				+ customerSource + ", customerCharacter=" + customerCharacter
				+ ", address=" + address + ", cdrq=" + cdrq + ", cbrqStart="
				+ cbrqStart + ", cbrqEnd=" + cbrqEnd + ", rowNumber="
				+ rowNumber + ", approvalBillId=" + approvalBillId
				+ ", foundDate=" + foundDate + ", sfdk=" + sfdk
				+ ", giftDiscount=" + giftDiscount + ", comprehensiveDiscount="
				+ comprehensiveDiscount + ", xjyhdw=" + xjyhdw + ", czkje="
				+ czkje + ", czkjedw=" + czkjedw + ", insuTypes=" + insuTypes
				+ ", syxsxfRate=" + syxsxfRate + ", jqxsxfRate=" + jqxsxfRate
				+ ", coverTypeName=" + coverTypeName + "]";
	}

}