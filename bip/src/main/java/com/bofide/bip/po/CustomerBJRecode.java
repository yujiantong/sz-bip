package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

public class CustomerBJRecode {
    /**
     * 报价id
     */
    private Integer bjId;

    /**
     * 潜在客户id
     */
    private Integer customerId;

    /**
     * 当次报价日期
     */
    private Date dcbjrq;

    /**
     * 保险公司
     */
    private String bxgs;

    /**
     * 险种
     */
    private String xz;

    /**
     * 商业险金额
     */
    private Float syxje;

    /**
     * 交强险金额
     */
    private Float jqxje;

    /**
     * 车船税金额
     */
    private Float ccsje;

    /**
     * 保费合计
     */
    private Float bfhj;
    
    /**
     * 实际金额
     */
    private Float shijize;

    /**
     * 今年出单折扣
     */
    private Float jncdzk;

    /**
     * 出险次数
     */
    private Integer cxcs;

    /**
     * 理赔金额
     */
    private Float lpje;
    
    /**
     * 优惠金额
     */
    private Float yhje;

    /**
     * 报价人
     */
    private String bjr;
    
    /**
     * 报价人Id
     */
    private Integer bjrId;
    
    /**
     * 4s店Id
     */
    private Integer storeId;

    /**
     * 备注
     */
    private String remark;
    
    /**
     * 费率系数1（无赔款优惠系数）
     */
    private Float rateFactor1;
    
    /**
     * 费率系数2（自主渠道系数）
     */
    private Float rateFactor2;
    
    /**
     * 费率系数3（自主核保系数）
     */
    private Float rateFactor3;
    
    /**
     * 费率系数4（交通违法浮动系数）
     */
    private Float rateFactor4;
    
    /**
	 * 保险资源枚举
	 */
	private Integer source;
	
	/**
	 * 报价状态，-1=未报价， 0=报价失败，>0报价成功
	 */
	private Integer quoteStatus;
	/**
	 * 报价信息
	 */
	private String quoteResult;
	
	/**
	 * 报价方式，默认为0，0=老报价，1=壁虎报价
	 */
	private Integer bjfs;
	
	/**
	 * 核保信息List
	 */
	private List<UnderWriting> underWriting;
	
	/**
	 * 标准保费（保险公司未打折的保费）
	 */
	private Float standardPremium;
	
    
	public Float getStandardPremium() {
		return standardPremium;
	}

	public void setStandardPremium(Float standardPremium) {
		this.standardPremium = standardPremium;
	}
 
	/**
	 * 店端折扣
	 */
	private Float shopZheKou;
	
	
	public Float getShopZheKou() {
		return shopZheKou;
	}

	public void setShopZheKou(Float shopZheKou) {
		this.shopZheKou = shopZheKou;
	}

	/**  
	 * 核保信息List  
	 * @return underWriting   核保信息List  
	 */
	public List<UnderWriting> getUnderWriting() {
		return underWriting;
	}

	/**  
	 * 核保信息List  
	 * @param underWriting  核保信息List  
	 */
	public void setUnderWriting(List<UnderWriting> underWriting) {
		this.underWriting = underWriting;
	}

	/**  
	 * 备注  
	 * @return remark   备注  
	 */
	public String getRemark() {
		return remark;
	}

	/**  
	 * 备注  
	 * @param remark  备注  
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**  
	 * 费率系数1（无赔款优惠系数）  
	 * @return rateFactor1   费率系数1（无赔款优惠系数）  
	 */
	public Float getRateFactor1() {
		return rateFactor1;
	}

	/**  
	 * 费率系数1（无赔款优惠系数）  
	 * @param rateFactor1  费率系数1（无赔款优惠系数）  
	 */
	public void setRateFactor1(Float rateFactor1) {
		this.rateFactor1 = rateFactor1;
	}

	/**  
	 * 费率系数2（自主渠道系数）  
	 * @return rateFactor2   费率系数2（自主渠道系数）  
	 */
	public Float getRateFactor2() {
		return rateFactor2;
	}

	/**  
	 * 费率系数2（自主渠道系数）  
	 * @param rateFactor2  费率系数2（自主渠道系数）  
	 */
	public void setRateFactor2(Float rateFactor2) {
		this.rateFactor2 = rateFactor2;
	}

	/**  
	 * 费率系数3（自主核保系数）  
	 * @return rateFactor3   费率系数3（自主核保系数）  
	 */
	public Float getRateFactor3() {
		return rateFactor3;
	}

	/**  
	 * 费率系数3（自主核保系数）  
	 * @param rateFactor3  费率系数3（自主核保系数）  
	 */
	public void setRateFactor3(Float rateFactor3) {
		this.rateFactor3 = rateFactor3;
	}

	/**  
	 * 费率系数4（交通违法浮动系数）  
	 * @return rateFactor4   费率系数4（交通违法浮动系数）  
	 */
	public Float getRateFactor4() {
		return rateFactor4;
	}

	/**  
	 * 费率系数4（交通违法浮动系数）  
	 * @param rateFactor4  费率系数4（交通违法浮动系数）  
	 */
	public void setRateFactor4(Float rateFactor4) {
		this.rateFactor4 = rateFactor4;
	}

	/**  
	 * 保险资源枚举  
	 * @return source   保险资源枚举  
	 */
	public Integer getSource() {
		return source;
	}

	/**  
	 * 保险资源枚举  
	 * @param source  保险资源枚举  
	 */
	public void setSource(Integer source) {
		this.source = source;
	}

	/**  
	 * 报价状态，-1=未报价，0=报价失败，>0报价成功  
	 * @return quoteStatus   报价状态，-1=未报价，0=报价失败，>0报价成功  
	 */
	public Integer getQuoteStatus() {
		return quoteStatus;
	}

	/**  
	 * 报价状态，-1=未报价，0=报价失败，>0报价成功  
	 * @param quoteStatus  报价状态，-1=未报价，0=报价失败，>0报价成功  
	 */
	public void setQuoteStatus(Integer quoteStatus) {
		this.quoteStatus = quoteStatus;
	}

	/**  
	 * 报价信息  
	 * @return quoteResult   报价信息  
	 */
	public String getQuoteResult() {
		return quoteResult;
	}

	/**  
	 * 报价信息  
	 * @param quoteResult  报价信息  
	 */
	public void setQuoteResult(String quoteResult) {
		this.quoteResult = quoteResult;
	}

	

	/**  
	 * 报价方式，默认为0，0=老报价，1=壁虎报价  
	 * @return bjfs   报价方式，默认为0，0=老报价，1=壁虎报价  
	 */
	public Integer getBjfs() {
		return bjfs;
	}

	/**  
	 * 报价方式，默认为0，0=老报价，1=壁虎报价  
	 * @param bjfs  报价方式，默认为0，0=老报价，1=壁虎报价  
	 */
	public void setBjfs(Integer bjfs) {
		this.bjfs = bjfs;
	}

	/**
     * @return 报价id
     */
    public Integer getBjId() {
        return bjId;
    }

    /**
     * @param bjId 
	 *            报价id
     */
    public void setBjId(Integer bjId) {
        this.bjId = bjId;
    }

    /**
     * @return 潜在客户id
     */
    public Integer getCustomerId() {
        return customerId;
    }

    /**
     * @param customerid 
	 *            潜在客户id
     */
    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    /**
     * @return 当次报价日期
     */
    public Date getDcbjrq() {
        return dcbjrq;
    }

    /**
     * @param dcbjrq 
	 *            当次报价日期
     */
    public void setDcbjrq(Date dcbjrq) {
        this.dcbjrq = dcbjrq;
    }

    /**
     * @return 保险公司
     */
    public String getBxgs() {
        return bxgs;
    }

    /**
     * @param bxgs 
	 *            保险公司
     */
    public void setBxgs(String bxgs) {
        this.bxgs = bxgs == null ? null : bxgs.trim();
    }

    /**
     * @return 险种
     */
    public String getXz() {
        return xz;
    }

    /**
     * @param xz 
	 *            险种
     */
    public void setXz(String xz) {
        this.xz = xz == null ? null : xz.trim();
    }

    /**
     * @return 商业险金额
     */
    public Float getSyxje() {
        return syxje;
    }

    /**
     * @param syxje 
	 *            商业险金额
     */
    public void setSyxje(Float syxje) {
        this.syxje = syxje;
    }

    /**
     * @return 交强险金额
     */
    public Float getJqxje() {
        return jqxje;
    }

    /**
     * @param jqxje 
	 *            交强险金额
     */
    public void setJqxje(Float jqxje) {
        this.jqxje = jqxje;
    }

    /**
     * @return 车船税金额
     */
    public Float getCcsje() {
        return ccsje;
    }

    /**
     * @param ccsje 
	 *            车船税金额
     */
    public void setCcsje(Float ccsje) {
        this.ccsje = ccsje;
    }

    /**
     * @return 保费合计
     */
    public Float getBfhj() {
        return bfhj;
    }

    /**
     * @param bfhj 
	 *            保费合计
     */
    public void setBfhj(Float bfhj) {
        this.bfhj = bfhj;
    }

    /**
     * @return 今年出单折扣
     */
    public Float getJncdzk() {
        return jncdzk;
    }

    /**
     * @param jncdzk 
	 *            今年出单折扣
     */
    public void setJncdzk(Float jncdzk) {
        this.jncdzk = jncdzk;
    }

    /**
     * @return 出险次数
     */
    public Integer getCxcs() {
        return cxcs;
    }

    /**
     * @param cxcs 
	 *            出险次数
     */
    public void setCxcs(Integer cxcs) {
        this.cxcs = cxcs;
    }

    /**
     * @return 理赔金额
     */
    public Float getLpje() {
        return lpje;
    }

    /**
     * @param lpje 
	 *            理赔金额
     */
    public void setLpje(Float lpje) {
        this.lpje = lpje;
    }

    /**
     * @return 报价人
     */
    public String getBjr() {
        return bjr;
    }

    /**
     * @param bjr 
	 *            报价人
     */
    public void setBjr(String bjr) {
        this.bjr = bjr == null ? null : bjr.trim();
    }

	/**  
	 * 报价人Id  
	 * @return bjrId   报价人Id  
	 */
	public Integer getBjrId() {
		return bjrId;
	}

	/**  
	 * 报价人Id  
	 * @param bjrId  报价人Id  
	 */
	public void setBjrId(Integer bjrId) {
		this.bjrId = bjrId;
	}

	/**  
	 * 4s店Id  
	 * @return storeId   4s店Id  
	 */
	public Integer getStoreId() {
		return storeId;
	}

	/**  
	 * 4s店Id  
	 * @param storeId  4s店Id  
	 */
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	/**  
	 * 优惠金额  
	 * @return yhje   优惠金额  
	 */
	public Float getYhje() {
		return yhje;
	}

	/**  
	 * 优惠金额  
	 * @param yhje  优惠金额  
	 */
	public void setYhje(Float yhje) {
		this.yhje = yhje;
	}

	/**
     * 实际金额
     */
	public Float getShijize() {
		return shijize;
	}

	/**
     * 实际金额
     */
	public void setShijize(Float shijize) {
		this.shijize = shijize;
	}

	

	
	
}