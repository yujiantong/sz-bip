package com.bofide.bip.po;

import java.util.Date;

/**
 * 潜在客户跟踪记录
 *
 */
public class CustomerTraceRecode {
    /**
     * 跟踪记录id
     */
    private Integer customerTraceId;

    /**
     * 潜在客户id
     */
    private Integer customerId;

    /**
     * 下次跟踪日期
     */
    private Date nextTraceDate;

    
    /**
     * 续保类型
     */
    private String renewalType;
    
    /**
     * 客户级别
     */
    private String customerLevel;

    /**
     * 邀约日期
     */
    private Date inviteDate;

    /**
     * 跟踪内容
     */
    private String traceContext;

    /**
     * 当次跟踪日期
     */
    private Date currentTraceDate;

    /**
     * 客户描述
     */
    private String customerDescription;

    /**
     * 是否报价 1表示“是”，0表示“否”
     */
    private Integer quote;
    

	/**
     * 报价
     */
    private Float quotedPrice;
    
    /**
     * 负责人id
     */
    private Integer principalId;
    
    /**
     * 负责人
     */
    private String principal;
    
    /**
     * 提前出单天数
     */
    private int outBillDay;
    
    /**
     * 邀约次数
     */
    private int inviteNumber;
    
    /**
     * 是否邀约
     */
    private Integer invite;
    
    /**
     * 是否进店
     */
    private Integer comeStore;
    
    /**
     * 是否接通
     */
    private Integer sfjt;
    //联系人
    private String lxr;
    //联系方式
    private String lxfs;
    //车型
    private String cx;
    //保险到期日
    private Date bxdqr;
    //持有天数
    private Integer cyts;
    //本次应跟踪日期
    private Date currentNeedTraceDate;
    //商业险报价
    private Float syxbj;
    //交强险报价
    private Float jqxbj;
    //车船税报价
    private Float ccsbj;
    //是否出单
    private Integer dealInsur;
    //失销原因
    private String lossReason;
    //回退原因
    private String returnReason;
    
    private Date comeStoreDate;
    //是否高意向
    private Integer sfgyx;
    /**
     * 虚拟保险到期日
     */
    private Date virtualJqxdqr;
    //操作人id
    private Integer operatorID;
    /**
     * 新的下次跟踪日期,主要用于页面显示用
     * @return
     */
    private Date newNextTraceDate;
    
	public Integer getOperatorID() {
		return operatorID;
	}

	public void setOperatorID(Integer operatorID) {
		this.operatorID = operatorID;
	}

	public Date getVirtualJqxdqr() {
		return virtualJqxdqr;
	}

	public void setVirtualJqxdqr(Date virtualJqxdqr) {
		this.virtualJqxdqr = virtualJqxdqr;
	}

	public String getLossReason() {
		return lossReason;
	}

	public void setLossReason(String lossReason) {
		this.lossReason = lossReason;
	}

	public String getReturnReason() {
		return returnReason;
	}

	public void setReturnReason(String returnReason) {
		this.returnReason = returnReason;
	}

	public Float getSyxbj() {
		return syxbj;
	}

	public void setSyxbj(Float syxbj) {
		this.syxbj = syxbj;
	}

	public Float getJqxbj() {
		return jqxbj;
	}

	public void setJqxbj(Float jqxbj) {
		this.jqxbj = jqxbj;
	}

	public Float getCcsbj() {
		return ccsbj;
	}

	public void setCcsbj(Float ccsbj) {
		this.ccsbj = ccsbj;
	}

	public Date getCurrentNeedTraceDate() {
		return currentNeedTraceDate;
	}

	public void setCurrentNeedTraceDate(Date currentNeedTraceDate) {
		this.currentNeedTraceDate = currentNeedTraceDate;
	}

	public String getLxr() {
		return lxr;
	}

	public void setLxr(String lxr) {
		this.lxr = lxr;
	}

	public String getLxfs() {
		return lxfs;
	}

	public void setLxfs(String lxfs) {
		this.lxfs = lxfs;
	}

	public String getCx() {
		return cx;
	}

	public void setCx(String cx) {
		this.cx = cx;
	}

	public Date getBxdqr() {
		return bxdqr;
	}

	public void setBxdqr(Date bxdqr) {
		this.bxdqr = bxdqr;
	}

	public Integer getCyts() {
		return cyts;
	}

	public void setCyts(Integer cyts) {
		this.cyts = cyts;
	}

	public Integer getCustomerTraceId() {
		return customerTraceId;
	}

	public void setCustomerTraceId(Integer customerTraceId) {
		this.customerTraceId = customerTraceId;
	}

	public Integer getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Integer customerId) {
		this.customerId = customerId;
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

	public Date getInviteDate() {
		return inviteDate;
	}

	public void setInviteDate(Date inviteDate) {
		this.inviteDate = inviteDate;
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

	public String getCustomerDescription() {
		return customerDescription;
	}

	public void setCustomerDescription(String customerDescription) {
		this.customerDescription = customerDescription;
	}

	public Integer getQuote() {
		return quote;
	}

	public void setQuote(Integer quote) {
		this.quote = quote;
	}

	public Float getQuotedPrice() {
		return quotedPrice;
	}

	public void setQuotedPrice(Float quotedPrice) {
		this.quotedPrice = quotedPrice;
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

	public Integer getInvite() {
		return invite;
	}

	public void setInvite(Integer invite) {
		this.invite = invite;
	}

	public Integer getComeStore() {
		return comeStore;
	}

	public void setComeStore(Integer comeStore) {
		this.comeStore = comeStore;
	}

	public Integer getSfjt() {
		return sfjt;
	}

	public void setSfjt(Integer sfjt) {
		this.sfjt = sfjt;
	}

	public Integer getDealInsur() {
		return dealInsur;
	}

	public void setDealInsur(Integer dealInsur) {
		this.dealInsur = dealInsur;
	}

	public Date getComeStoreDate() {
		return comeStoreDate;
	}

	public void setComeStoreDate(Date comeStoreDate) {
		this.comeStoreDate = comeStoreDate;
	}

	public Integer getSfgyx() {
		return sfgyx;
	}

	public void setSfgyx(Integer sfgyx) {
		this.sfgyx = sfgyx;
	}

	public Date getNewNextTraceDate() {
		return newNextTraceDate;
	}

	public void setNewNextTraceDate(Date newNextTraceDate) {
		this.newNextTraceDate = newNextTraceDate;
	}

	@Override
	public String toString() {
		return "CustomerTraceRecode [customerTraceId=" + customerTraceId
				+ ", customerId=" + customerId + ", nextTraceDate="
				+ nextTraceDate + ", renewalType=" + renewalType
				+ ", customerLevel=" + customerLevel + ", inviteDate="
				+ inviteDate + ", traceContext=" + traceContext
				+ ", currentTraceDate=" + currentTraceDate
				+ ", customerDescription=" + customerDescription + ", quote="
				+ quote + ", quotedPrice=" + quotedPrice + ", principalId="
				+ principalId + ", principal=" + principal + ", outBillDay="
				+ outBillDay + ", inviteNumber=" + inviteNumber + ", invite="
				+ invite + ", comeStore=" + comeStore + ", sfjt=" + sfjt
				+ ", lxr=" + lxr + ", lxfs=" + lxfs + ", cx=" + cx + ", bxdqr="
				+ bxdqr + ", cyts=" + cyts + ", currentNeedTraceDate="
				+ currentNeedTraceDate + ", syxbj=" + syxbj + ", jqxbj="
				+ jqxbj + ", ccsbj=" + ccsbj + ", dealInsur=" + dealInsur
				+ ", lossReason=" + lossReason + ", returnReason="
				+ returnReason + ", comeStoreDate=" + comeStoreDate + ",sfgyx=" + sfgyx + ",newNextTraceDate=" + newNextTraceDate + "]";
	}

	

    
}