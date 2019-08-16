package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

/**
 * 保险公司及险种实体bean
 *
 */
public class InsuranceComp {
	
	/**
     * 保险公司id
     */
	private Integer insuranceCompId;
	
	/**
     * 保险公司名称
     */
	private String insuranceCompName;
	
	/**
     * 险种名称(多种,/分隔)
     */
    private String typeName;
    
    /**
     * 创建时间
     */
    private Date createDate;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 手续费设置
     */
    private List<Factorage> factorages;
    
    /**
     * 商业险设置
     */
    private List<InsuranceType> insuranceTypes;
	
    /**
     * 壁虎保险资源枚举
     */
    private Integer source;
    
    /**
     * 博福报价key
     */
	private String insuranceKey;
	
	public Integer getInsuranceCompId() {
		return insuranceCompId;
	}
	public void setInsuranceCompId(Integer insuranceCompId) {
		this.insuranceCompId = insuranceCompId;
	}
	public String getInsuranceCompName() {
		return insuranceCompName;
	}
	public void setInsuranceCompName(String insuranceCompName) {
		this.insuranceCompName = insuranceCompName;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public List<Factorage> getFactorages() {
		return factorages;
	}
	public void setFactorages(List<Factorage> factorages) {
		this.factorages = factorages;
	}
	public List<InsuranceType> getInsuranceTypes() {
		return insuranceTypes;
	}
	public void setInsuranceTypes(List<InsuranceType> insuranceTypes) {
		this.insuranceTypes = insuranceTypes;
	}
	public Integer getSource() {
		return source;
	}
	public void setSource(Integer source) {
		this.source = source;
	}
	
	public String getInsuranceKey() {
		return insuranceKey;
	}
	public void setInsuranceKey(String insuranceKey) {
		this.insuranceKey = insuranceKey;
	}
	@Override
	public String toString() {
		return "InsuranceComp [insuranceCompId=" + insuranceCompId
				+ ", insuranceCompName=" + insuranceCompName + ", typeName="
				+ typeName + ", createDate=" + createDate + ", remark="
				+ remark + ", factorages=" + factorages + ", insuranceTypes="
				+ insuranceTypes + ", source=" + source + ", insuranceKey="
				+ insuranceKey + "]";
	}
	
}
