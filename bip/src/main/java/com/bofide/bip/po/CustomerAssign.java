package com.bofide.bip.po;

import java.util.Date;

/**
 * 潜在客户分配表:分配潜在客户给用户时，同一个潜在客户可以对应不同的用户，并且对应的用户的潜客状态可以是不一致
 *
 */
public class CustomerAssign {
    //id
    private Integer id;
    //潜在客户id
    private Integer customerId;
    //用户Id
    private Integer userId;
    //跟踪状态
    private Integer traceStatu;
    //邀约状态
    private Integer inviteStatu;
    //跟踪时间
    private Date traceDate;
    //接受潜客状态
    private Integer acceptStatu;
    //接受时间
    private Date acceptDate;
    //回退状态
    private Integer returnStatu;
    //回退时间
    private Date returnDate;
    //跟踪记录id
    private Integer customerTraceId;
    //邀约日期
    private Date inviteDate;
    //唤醒状态
    private Date assignDate;
    //延期到期日
    private Date delayDate;
    //不启用客服模块后续保专员申请失销和睡眠的标志,1表示失销,2表示睡眠
    private Integer applyStatu;
    //申请失销原因暂存字段
    private String applyLossReason;
    /**
     * 申请延期日期
     */
    private Date applyDelayDay;
    
	public Date getApplyDelayDay() {
		return applyDelayDay;
	}
	public void setApplyDelayDay(Date applyDelayDay) {
		this.applyDelayDay = applyDelayDay;
	}
	public Date getDelayDate() {
		return delayDate;
	}
	public void setDelayDate(Date delayDate) {
		this.delayDate = delayDate;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getCustomerId() {
		return customerId;
	}
	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
	}
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Integer getTraceStatu() {
		return traceStatu;
	}
	public void setTraceStatu(Integer traceStatu) {
		this.traceStatu = traceStatu;
	}
	public Integer getInviteStatu() {
		return inviteStatu;
	}
	public void setInviteStatu(Integer inviteStatu) {
		this.inviteStatu = inviteStatu;
	}
	public Date getTraceDate() {
		return traceDate;
	}
	public void setTraceDate(Date traceDate) {
		this.traceDate = traceDate;
	}
	public Integer getAcceptStatu() {
		return acceptStatu;
	}
	public void setAcceptStatu(Integer acceptStatu) {
		this.acceptStatu = acceptStatu;
	}
	public Date getAcceptDate() {
		return acceptDate;
	}
	public void setAcceptDate(Date acceptDate) {
		this.acceptDate = acceptDate;
	}
	public Integer getReturnStatu() {
		return returnStatu;
	}
	public void setReturnStatu(Integer returnStatu) {
		this.returnStatu = returnStatu;
	}
	public Date getReturnDate() {
		return returnDate;
	}
	public void setReturnDate(Date returnDate) {
		this.returnDate = returnDate;
	}
	public Integer getCustomerTraceId() {
		return customerTraceId;
	}
	public void setCustomerTraceId(Integer customerTraceId) {
		this.customerTraceId = customerTraceId;
	}
	public Date getInviteDate() {
		return inviteDate;
	}
	public void setInviteDate(Date inviteDate) {
		this.inviteDate = inviteDate;
	}
	public Date getAssignDate() {
		return assignDate;
	}
	public void setAssignDate(Date assignDate) {
		this.assignDate = assignDate;
	}
	public Integer getApplyStatu() {
		return applyStatu;
	}
	public void setApplyStatu(Integer applyStatu) {
		this.applyStatu = applyStatu;
	}
	public String getApplyLossReason() {
		return applyLossReason;
	}
	public void setApplyLossReason(String applyLossReason) {
		this.applyLossReason = applyLossReason;
	}
	
	
}