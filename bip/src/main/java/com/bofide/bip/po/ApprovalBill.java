package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

import com.bofide.common.util.JsonDateDeserializerUtil;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

/**
 * 审批单信息
 * @author wangchuang
 *
 */
public class ApprovalBill {
	private Integer id;
	private Integer fourSStoreId;//4s店id
	private String chassisNumber;//车架号
	private Date insurDate;//投保日期
	@JsonDeserialize(using = JsonDateDeserializerUtil.class)
	private Date jqxrqStart;//交强险日期开始
	@JsonDeserialize(using = JsonDateDeserializerUtil.class)
	private Date jqxrqEnd;//交强险日期结束
	private Integer renewalType;//投保类型
	private String renewalWay;//投保渠道
	private String solicitMember;//招揽员
	private String insured;//被保险人
	private String bbxrzjh;//被保险人证件号
	private String contact;//联系人
	private String contactWay;//联系方式
	private String insurancTypes;//商业险种
	private String kpxx;//开票信息
	private Float syxje;//商业险金额
	private Float jqxje;//交强险金额
	private Float ccs;//车船税
	private Float bfhj;//保费合计
	private Float kpje;//开票金额
	private Float yhje;//优惠金额
	private Float ssje;//实收金额
	private String fkfs;//付款方式
	private String insuranceCompName;//保险公司
	private String remark;//备注
	private String carLicenseNumber;//车牌号
	private String engineNumber;//发动机号
	private String carBrand;//汽车品牌
	private String vehicleModel;//车辆型号
	private String factoryLicenseType;//厂牌型号
	/**
	 * 赠送优惠
	 * */
	private Double giftDiscount;
	/**
	 * 综合优惠
	 * */
	private Double comprehensiveDiscount;
	/**
	 * 现金优惠点位
	 * */
	private Double xjyhdw;
	/**
	 * 储值卡金额
	 * */
	private Double czkje;
	/**
	 * 储值卡金额点位
	 * */
	private Double czkjedw;
	private List<GivingInformation> givingInformations;//赠送信息
	
	public String getCarLicenseNumber() {
		return carLicenseNumber;
	}
	
	public void setCarLicenseNumber(String carLicenseNumber) {
		this.carLicenseNumber = carLicenseNumber;
	}
	
	public String getEngineNumber() {
		return engineNumber;
	}
	
	public void setEngineNumber(String engineNumber) {
		this.engineNumber = engineNumber;
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
	
	public String getInsuranceCompName() {
		return insuranceCompName;
	}

	public void setInsuranceCompName(String insuranceCompName) {
		this.insuranceCompName = insuranceCompName;
	}
	public List<GivingInformation> getGivingInformations() {
		return givingInformations;
	}
	
	public void setGivingInformations(List<GivingInformation> givingInformations) {
		this.givingInformations = givingInformations;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getFourSStoreId() {
		return fourSStoreId;
	}

	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}

	public String getChassisNumber() {
		return chassisNumber;
	}
	public void setChassisNumber(String chassisNumber) {
		this.chassisNumber = chassisNumber;
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

	public Date getInsurDate() {
		return insurDate;
	}
	public void setInsurDate(Date insurDate) {
		this.insurDate = insurDate;
	}
	public Integer getRenewalType() {
		return renewalType;
	}
	public void setRenewalType(Integer renewalType) {
		this.renewalType = renewalType;
	}
	public String getRenewalWay() {
		return renewalWay;
	}
	public void setRenewalWay(String renewalWay) {
		this.renewalWay = renewalWay;
	}
	public String getSolicitMember() {
		return solicitMember;
	}
	public void setSolicitMember(String solicitMember) {
		this.solicitMember = solicitMember;
	}
	public String getInsured() {
		return insured;
	}
	public void setInsured(String insured) {
		this.insured = insured;
	}
	public String getBbxrzjh() {
		return bbxrzjh;
	}
	public void setBbxrzjh(String bbxrzjh) {
		this.bbxrzjh = bbxrzjh;
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
	public String getInsurancTypes() {
		return insurancTypes;
	}
	public void setInsurancTypes(String insurancTypes) {
		this.insurancTypes = insurancTypes;
	}
	public String getKpxx() {
		return kpxx;
	}
	public void setKpxx(String kpxx) {
		this.kpxx = kpxx;
	}
	
	public Float getSyxje() {
		return syxje;
	}

	public void setSyxje(Float syxje) {
		this.syxje = syxje;
	}

	public Float getJqxje() {
		return jqxje;
	}

	public void setJqxje(Float jqxje) {
		this.jqxje = jqxje;
	}

	public Float getCcs() {
		return ccs;
	}

	public void setCcs(Float ccs) {
		this.ccs = ccs;
	}

	public Float getBfhj() {
		return bfhj;
	}

	public void setBfhj(Float bfhj) {
		this.bfhj = bfhj;
	}

	public Float getKpje() {
		return kpje;
	}

	public void setKpje(Float kpje) {
		this.kpje = kpje;
	}

	public Float getYhje() {
		return yhje;
	}

	public void setYhje(Float yhje) {
		this.yhje = yhje;
	}

	public Float getSsje() {
		return ssje;
	}

	public void setSsje(Float ssje) {
		this.ssje = ssje;
	}

	public String getFkfs() {
		return fkfs;
	}
	public void setFkfs(String fkfs) {
		this.fkfs = fkfs;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**  
	 * factoryLicenseType  
	 * @return factoryLicenseType   factoryLicenseType  
	 */
	public String getFactoryLicenseType() {
		return factoryLicenseType;
	}

	/**  
	 * factoryLicenseType  
	 * @param factoryLicenseType  factoryLicenseType  
	 */
	public void setFactoryLicenseType(String factoryLicenseType) {
		this.factoryLicenseType = factoryLicenseType;
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

	@Override
	public String toString() {
		return "ApprovalBill [id=" + id + ", fourSStoreId=" + fourSStoreId
				+ ", chassisNumber=" + chassisNumber + ", insurDate="
				+ insurDate + ", jqxrqStart=" + jqxrqStart + ", jqxrqEnd="
				+ jqxrqEnd + ", renewalType=" + renewalType + ", renewalWay="
				+ renewalWay + ", solicitMember=" + solicitMember
				+ ", insured=" + insured + ", bbxrzjh=" + bbxrzjh
				+ ", contact=" + contact + ", contactWay=" + contactWay
				+ ", insurancTypes=" + insurancTypes + ", kpxx=" + kpxx
				+ ", syxje=" + syxje + ", jqxje=" + jqxje + ", ccs=" + ccs
				+ ", bfhj=" + bfhj + ", kpje=" + kpje + ", yhje=" + yhje
				+ ", ssje=" + ssje + ", fkfs=" + fkfs + ", insuranceCompName="
				+ insuranceCompName + ", remark=" + remark
				+ ", carLicenseNumber=" + carLicenseNumber + ", engineNumber="
				+ engineNumber + ", carBrand=" + carBrand + ", vehicleModel="
				+ vehicleModel + ", factoryLicenseType=" + factoryLicenseType
				+ ", giftDiscount=" + giftDiscount + ", comprehensiveDiscount="
				+ comprehensiveDiscount + ", xjyhdw=" + xjyhdw + ", czkje="
				+ czkje + ", czkjedw=" + czkjedw + ", givingInformations="
				+ givingInformations + "]";
	}

}
