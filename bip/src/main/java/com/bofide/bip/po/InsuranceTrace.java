package com.bofide.bip.po;

/**
 * 保单跟踪记录统计表,一张保单有多条跟踪统计记录
 */
public class InsuranceTrace {
    /**
     * 跟踪记录id
     */
    private Integer insuranceTraceId;

    /**
     * 保单id
     */
    private Integer insuranceBillId;

    /**
     * 负责人
     */
    private String principal;

    /**
     * 跟踪周期
     */
    private String traceClcye;

    /**
     * 跟踪次数
     */
    private Integer traceNumber;

    /**
     * 承保类型
     */
    private String coverType;

    /**
     * 提前出单天数(天)
     */
    private Integer advanceOutDate;

    /**
     * 是否邀约 0:表示“是”；1表示“否”
     */
    private Integer isInvite;

    /**
     * 邀约次数
     */
    private Integer inviteNumber;

    /**
     * 是否邀约进店 0:表示“是”；1表示“否”
     */
    private Integer isInviteToStore;

    /**
     * 备注
     */
    private String remark;

    /**
     * 跟踪记录id
     */
	public Integer getInsuranceTraceId() {
		return insuranceTraceId;
	}

	/**
     * 跟踪记录id
     */
	public void setInsuranceTraceId(Integer insuranceTraceId) {
		this.insuranceTraceId = insuranceTraceId;
	}

	/**
     * 保单id
     */
	public Integer getInsuranceBillId() {
		return insuranceBillId;
	}

	/**
     * 保单id
     */
	public void setInsuranceBillId(Integer insuranceBillId) {
		this.insuranceBillId = insuranceBillId;
	}

	/**
     * 负责人
     */
	public String getPrincipal() {
		return principal;
	}

	/**
     * 负责人
     */
	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	
	public String getTraceClcye() {
		return traceClcye;
	}

	public void setTraceClcye(String traceClcye) {
		this.traceClcye = traceClcye;
	}

	public Integer getTraceNumber() {
		return traceNumber;
	}

	public void setTraceNumber(Integer traceNumber) {
		this.traceNumber = traceNumber;
	}

	public String getCoverType() {
		return coverType;
	}

	public void setCoverType(String coverType) {
		this.coverType = coverType;
	}

	public Integer getAdvanceOutDate() {
		return advanceOutDate;
	}

	public void setAdvanceOutDate(Integer advanceOutDate) {
		this.advanceOutDate = advanceOutDate;
	}

	public Integer getIsInvite() {
		return isInvite;
	}

	public void setIsInvite(Integer isInvite) {
		this.isInvite = isInvite;
	}

	public Integer getInviteNumber() {
		return inviteNumber;
	}

	public void setInviteNumber(Integer inviteNumber) {
		this.inviteNumber = inviteNumber;
	}

	public Integer getIsInviteToStore() {
		return isInviteToStore;
	}

	public void setIsInviteToStore(Integer isInviteToStore) {
		this.isInviteToStore = isInviteToStore;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Override
	public String toString() {
		return "InsuranceTrace [insuranceTraceId=" + insuranceTraceId + ", insuranceBillId=" + insuranceBillId
				+ ", principal=" + principal + ", traceClcye=" + traceClcye + ", traceNumber=" + traceNumber
				+ ", coverType=" + coverType + ", advanceOutDate=" + advanceOutDate + ", isInvite=" + isInvite
				+ ", inviteNumber=" + inviteNumber + ", isInviteToStore=" + isInviteToStore + ", remark=" + remark
				+ "]";
	}

    
    
    
}