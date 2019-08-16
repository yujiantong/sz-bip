package com.bofide.bip.vo;

import com.bofide.bip.po.CustomerTraceRecode;

/**
 * 潜客跟踪记录VO
 * @author Bao
 *
 */
public class CustomerTraceRecodeVo extends CustomerTraceRecode{
	
	/**
	 * 车主
	 */
    private String carOwner;
    
    /**
	 * 车牌号
	 */
    private String carLicenseNumber;
    
    /**
     * 车架号
     */
    private String chassisNumber;
    
   /**
    *  被保险人
    */
    private String insured;
    
   /**
    * 4s店id
    */
    private Integer fourSStoreId;

	public String getCarOwner() {
		return carOwner;
	}
	
	public void setCarOwner(String carOwner) {
		this.carOwner = carOwner;
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
	
	public String getInsured() {
		return insured;
	}
	
	public void setInsured(String insured) {
		this.insured = insured;
	}
	
	public Integer getFourSStoreId() {
		return fourSStoreId;
	}
	
	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}
	
	@Override
	public String toString() {
		return "CustTraceRecodeVO [carOwner=" + carOwner + ", carLicenseNumber="
				+ carLicenseNumber + ", chassisNumber=" + chassisNumber
				+ ", insured=" + insured + ", fourSStoreId=" + fourSStoreId + "]";
	}	
}
