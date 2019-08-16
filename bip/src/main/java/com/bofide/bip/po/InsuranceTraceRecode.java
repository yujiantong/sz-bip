package com.bofide.bip.po;

import java.util.Date;

public class InsuranceTraceRecode {
	private Integer insurTraceRecodeId;//保单跟踪记录id
	private Integer insuranceId;//保单id
	private Date nextTraceDate;//下次跟踪时间
	private String renewalType;//续保类型
	private String customerLevel;//客户级别
	private String traceContext;//跟踪内容
	private Date currentTraceDate;//当前跟踪时间
	
	public Integer getInsurTraceRecodeId() {
		return insurTraceRecodeId;
	}
	public void setInsurTraceRecodeId(Integer insurTraceRecodeId) {
		this.insurTraceRecodeId = insurTraceRecodeId;
	}
	public Integer getInsuranceId() {
		return insuranceId;
	}
	public void setInsuranceId(Integer insuranceId) {
		this.insuranceId = insuranceId;
	}
	public Date getNextTraceDate() {
		return nextTraceDate;
	}
	public void setNextTraceDate(Date nextTraceDate) {
		this.nextTraceDate = nextTraceDate;
	}
	public String getRenewalType() {
		return renewalType;
	}
	public void setRenewalType(String renewalType) {
		this.renewalType = renewalType;
	}
	public String getCustomerLevel() {
		return customerLevel;
	}
	public void setCustomerLevel(String customerLevel) {
		this.customerLevel = customerLevel;
	}
	public String getTraceContext() {
		return traceContext;
	}
	public void setTraceContext(String traceContext) {
		this.traceContext = traceContext;
	}
	public Date getCurrentTraceDate() {
		return currentTraceDate;
	}
	public void setCurrentTraceDate(Date currentTraceDate) {
		this.currentTraceDate = currentTraceDate;
	}
	@Override
	public String toString() {
		return "InsuranceTraceRecode [insurTraceRecodeId=" + insurTraceRecodeId + ", insuranceId=" + insuranceId
				+ ", nextTraceDate=" + nextTraceDate + ", renewalType=" + renewalType + ", customerLevel="
				+ customerLevel + ", traceContext=" + traceContext + ", currentTraceDate=" + currentTraceDate + "]";
	}
	
}
