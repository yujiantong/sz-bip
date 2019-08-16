package com.bofide.bip.po;

/**
 * 潜客跟踪记录VO
 * @author Bao
 *
 */
public class CustTraceRecodeVO {
	
	/**
     * 潜在客户id
     */
    private Integer customerId;
    
    /**
     * 负责人
     */
    private String principal;
    
    
    /**
     * 跟踪次数
     */
    private int traceCount;
    
    /**
     * 续保类型
     */
    private String renewalType;
    
    /**
     * 提前出单天数
     */
    private int outBillDay;
    
    /**
     * 是否邀约
     */
    private Integer isInvite;
    
    /**
     * 邀约次数
     */
    private int inviteNumber;
    
    /**
     * 是否到店
     */
    private Integer isComeStore;
    //跟踪周期
    private String traceClcye;
    //首次跟踪日期
    private String firstTraceDate;
    //末次跟踪日期
    private String lastTraceDate;

	public String getFirstTraceDate() {
		return firstTraceDate;
	}

	public void setFirstTraceDate(String firstTraceDate) {
		this.firstTraceDate = firstTraceDate;
	}

	public String getLastTraceDate() {
		return lastTraceDate;
	}

	public void setLastTraceDate(String lastTraceDate) {
		this.lastTraceDate = lastTraceDate;
	}

	public String getTraceClcye() {
		StringBuffer sb = new StringBuffer();
		sb.append(this.firstTraceDate);
		sb.append("~");
		sb.append(this.lastTraceDate);
		this.traceClcye = sb.toString();
		return traceClcye;
	}

	public void setTraceClcye(String traceClcye) {
		this.traceClcye = traceClcye;
	}

	public Integer getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}

	public String getPrincipal() {
		return principal;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}


	public int getTraceCount() {
		return traceCount;
	}

	public void setTraceCount(int traceCount) {
		this.traceCount = traceCount;
	}

	public String getRenewalType() {
		return renewalType;
	}

	public void setRenewalType(String renewalType) {
		this.renewalType = renewalType;
	}

	public int getOutBillDay() {
		return outBillDay;
	}

	public void setOutBillDay(int outBillDay) {
		this.outBillDay = outBillDay;
	}

	public int getInviteNumber() {
		return inviteNumber;
	}

	public void setInviteNumber(int inviteNumber) {
		this.inviteNumber = inviteNumber;
	}

	public Integer getIsInvite() {
		return isInvite;
	}

	public void setIsInvite(Integer isInvite) {
		this.isInvite = isInvite;
	}

	public Integer getIsComeStore() {
		return isComeStore;
	}

	public void setIsComeStore(Integer isComeStore) {
		this.isComeStore = isComeStore;
	}

}
