package com.bofide.bip.po;

import java.util.Date;

public class PushMaintenanceChild {
	private Integer id;
	private Integer storeId;//4s店id
	private String reportNumber;//报案号
	private String ppcx;//品牌车型
	private String engineNumber;//发动机号
	private String insured;//被保险人
	private Integer clzws;//车辆座位数
	private Integer sfnzcxs;//是否能正常行驶
	private String cwckr;//车物查勘人
	private String rsdhcky;//人伤电话查勘员
	private String rssdcky;//人伤实地查勘员
	private Integer sfdhck;//是否电话查勘
	private Integer zfdxsfbbxr;//支付对象是否被保险人
	private Date sczfcgTime;//首次支付成功时间
	private Date mczfcgTime;//末次支付成功时间
	private Date sczfthTime;//首次支付退回时间
	private Integer sfczjth;//是否曾质检退回
	private String dachr;//大案初核人
	private Date dachsj;//大案初核时间
	private String sfrskckp;//是否人伤快处快赔
	private Date sdsj;//收单时间
	private String sdr;//收单人
	private Integer sfrgls1;//是否人工理算(符合人工理算规则)
	private Integer sfrgls2;//是否人工理算(经过人工理算平台)
	private Date zalsTimeStart;//整案理算开始时间
	private Date zalsTimeEnd;//整案理算结束时间
	private Date scrgzjTimeStart;//首次人工质检开始时间
	private Date mcrgzjTimeEnd;//末次人工质检结束时间
	private Date scckTimeStart;//首次查勘开始时间
	private Date mcckTimeEnd;//末次查勘结束时间
	private Date sctdTime;//首次提调时间
	private Integer sfzdtd;//是否自动提调
	private Integer sftd;//是否提调
	private Integer dssfbhsjf;//定损是否包含施救费
	private Integer sfxxycsjqq;//是否信息一次收集齐全
	private String ckwtsljg;//查勘委托受理机构
	private Double cwnbdcjsje;//车物内部调查减损金额
	private Double cwwbdcjsje;//车物外部调查减损金额
	private Double jpje;//拒赔金额
	private Double fkjsje;//复勘减损金额
	private Double zcje;//追偿金额
	private Integer sfdlsp;//是否代理索赔
	private String dlspxlcmc;//代理索赔修理厂名称
	private Integer sfss;//是否诉讼
	private Integer yeqxfsckrwls;//有E权限发送查勘任务流数
	private Integer yeqxfsdsrwls;//有E权限发送定损任务流数
	private Integer elpfsdsrwls;//E理赔发送定损任务流数
	private Integer elpfsckrwls;//E理赔发送查勘任务流数
	private Integer fscsdsrwls;//发送车损定损任务流数
	private Date createTime;//创建时间
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getStoreId() {
		return storeId;
	}
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	public String getReportNumber() {
		return reportNumber;
	}
	public void setReportNumber(String reportNumber) {
		this.reportNumber = reportNumber;
	}
	public String getPpcx() {
		return ppcx;
	}
	public void setPpcx(String ppcx) {
		this.ppcx = ppcx;
	}
	public String getEngineNumber() {
		return engineNumber;
	}
	public void setEngineNumber(String engineNumber) {
		this.engineNumber = engineNumber;
	}
	public String getInsured() {
		return insured;
	}
	public void setInsured(String insured) {
		this.insured = insured;
	}
	public Integer getClzws() {
		return clzws;
	}
	public void setClzws(Integer clzws) {
		this.clzws = clzws;
	}
	public Integer getSfnzcxs() {
		return sfnzcxs;
	}
	public void setSfnzcxs(Integer sfnzcxs) {
		this.sfnzcxs = sfnzcxs;
	}
	public String getCwckr() {
		return cwckr;
	}
	public void setCwckr(String cwckr) {
		this.cwckr = cwckr;
	}
	public String getRsdhcky() {
		return rsdhcky;
	}
	public void setRsdhcky(String rsdhcky) {
		this.rsdhcky = rsdhcky;
	}
	public String getRssdcky() {
		return rssdcky;
	}
	public void setRssdcky(String rssdcky) {
		this.rssdcky = rssdcky;
	}
	public Integer getSfdhck() {
		return sfdhck;
	}
	public void setSfdhck(Integer sfdhck) {
		this.sfdhck = sfdhck;
	}
	public Integer getZfdxsfbbxr() {
		return zfdxsfbbxr;
	}
	public void setZfdxsfbbxr(Integer zfdxsfbbxr) {
		this.zfdxsfbbxr = zfdxsfbbxr;
	}
	public Date getSczfcgTime() {
		return sczfcgTime;
	}
	public void setSczfcgTime(Date sczfcgTime) {
		this.sczfcgTime = sczfcgTime;
	}
	public Date getMczfcgTime() {
		return mczfcgTime;
	}
	public void setMczfcgTime(Date mczfcgTime) {
		this.mczfcgTime = mczfcgTime;
	}
	public Date getSczfthTime() {
		return sczfthTime;
	}
	public void setSczfthTime(Date sczfthTime) {
		this.sczfthTime = sczfthTime;
	}
	public Integer getSfczjth() {
		return sfczjth;
	}
	public void setSfczjth(Integer sfczjth) {
		this.sfczjth = sfczjth;
	}
	public String getDachr() {
		return dachr;
	}
	public void setDachr(String dachr) {
		this.dachr = dachr;
	}
	public Date getDachsj() {
		return dachsj;
	}
	public void setDachsj(Date dachsj) {
		this.dachsj = dachsj;
	}
	public String getSfrskckp() {
		return sfrskckp;
	}
	public void setSfrskckp(String sfrskckp) {
		this.sfrskckp = sfrskckp;
	}
	public Date getSdsj() {
		return sdsj;
	}
	public void setSdsj(Date sdsj) {
		this.sdsj = sdsj;
	}
	public String getSdr() {
		return sdr;
	}
	public void setSdr(String sdr) {
		this.sdr = sdr;
	}
	public Integer getSfrgls1() {
		return sfrgls1;
	}
	public void setSfrgls1(Integer sfrgls1) {
		this.sfrgls1 = sfrgls1;
	}
	public Integer getSfrgls2() {
		return sfrgls2;
	}
	public void setSfrgls2(Integer sfrgls2) {
		this.sfrgls2 = sfrgls2;
	}
	public Date getZalsTimeStart() {
		return zalsTimeStart;
	}
	public void setZalsTimeStart(Date zalsTimeStart) {
		this.zalsTimeStart = zalsTimeStart;
	}
	public Date getZalsTimeEnd() {
		return zalsTimeEnd;
	}
	public void setZalsTimeEnd(Date zalsTimeEnd) {
		this.zalsTimeEnd = zalsTimeEnd;
	}
	public Date getScrgzjTimeStart() {
		return scrgzjTimeStart;
	}
	public void setScrgzjTimeStart(Date scrgzjTimeStart) {
		this.scrgzjTimeStart = scrgzjTimeStart;
	}
	public Date getMcrgzjTimeEnd() {
		return mcrgzjTimeEnd;
	}
	public void setMcrgzjTimeEnd(Date mcrgzjTimeEnd) {
		this.mcrgzjTimeEnd = mcrgzjTimeEnd;
	}
	public Date getScckTimeStart() {
		return scckTimeStart;
	}
	public void setScckTimeStart(Date scckTimeStart) {
		this.scckTimeStart = scckTimeStart;
	}
	public Date getMcckTimeEnd() {
		return mcckTimeEnd;
	}
	public void setMcckTimeEnd(Date mcckTimeEnd) {
		this.mcckTimeEnd = mcckTimeEnd;
	}
	public Date getSctdTime() {
		return sctdTime;
	}
	public void setSctdTime(Date sctdTime) {
		this.sctdTime = sctdTime;
	}
	public Integer getSfzdtd() {
		return sfzdtd;
	}
	public void setSfzdtd(Integer sfzdtd) {
		this.sfzdtd = sfzdtd;
	}
	public Integer getSftd() {
		return sftd;
	}
	public void setSftd(Integer sftd) {
		this.sftd = sftd;
	}
	public Integer getDssfbhsjf() {
		return dssfbhsjf;
	}
	public void setDssfbhsjf(Integer dssfbhsjf) {
		this.dssfbhsjf = dssfbhsjf;
	}
	public Integer getSfxxycsjqq() {
		return sfxxycsjqq;
	}
	public void setSfxxycsjqq(Integer sfxxycsjqq) {
		this.sfxxycsjqq = sfxxycsjqq;
	}
	public String getCkwtsljg() {
		return ckwtsljg;
	}
	public void setCkwtsljg(String ckwtsljg) {
		this.ckwtsljg = ckwtsljg;
	}
	public Double getCwnbdcjsje() {
		return cwnbdcjsje;
	}
	public void setCwnbdcjsje(Double cwnbdcjsje) {
		this.cwnbdcjsje = cwnbdcjsje;
	}
	public Double getCwwbdcjsje() {
		return cwwbdcjsje;
	}
	public void setCwwbdcjsje(Double cwwbdcjsje) {
		this.cwwbdcjsje = cwwbdcjsje;
	}
	public Double getJpje() {
		return jpje;
	}
	public void setJpje(Double jpje) {
		this.jpje = jpje;
	}
	public Double getFkjsje() {
		return fkjsje;
	}
	public void setFkjsje(Double fkjsje) {
		this.fkjsje = fkjsje;
	}
	public Double getZcje() {
		return zcje;
	}
	public void setZcje(Double zcje) {
		this.zcje = zcje;
	}
	public Integer getSfdlsp() {
		return sfdlsp;
	}
	public void setSfdlsp(Integer sfdlsp) {
		this.sfdlsp = sfdlsp;
	}
	public String getDlspxlcmc() {
		return dlspxlcmc;
	}
	public void setDlspxlcmc(String dlspxlcmc) {
		this.dlspxlcmc = dlspxlcmc;
	}
	public Integer getSfss() {
		return sfss;
	}
	public void setSfss(Integer sfss) {
		this.sfss = sfss;
	}
	public Integer getYeqxfsckrwls() {
		return yeqxfsckrwls;
	}
	public void setYeqxfsckrwls(Integer yeqxfsckrwls) {
		this.yeqxfsckrwls = yeqxfsckrwls;
	}
	public Integer getYeqxfsdsrwls() {
		return yeqxfsdsrwls;
	}
	public void setYeqxfsdsrwls(Integer yeqxfsdsrwls) {
		this.yeqxfsdsrwls = yeqxfsdsrwls;
	}
	public Integer getElpfsdsrwls() {
		return elpfsdsrwls;
	}
	public void setElpfsdsrwls(Integer elpfsdsrwls) {
		this.elpfsdsrwls = elpfsdsrwls;
	}
	public Integer getElpfsckrwls() {
		return elpfsckrwls;
	}
	public void setElpfsckrwls(Integer elpfsckrwls) {
		this.elpfsckrwls = elpfsckrwls;
	}
	public Integer getFscsdsrwls() {
		return fscsdsrwls;
	}
	public void setFscsdsrwls(Integer fscsdsrwls) {
		this.fscsdsrwls = fscsdsrwls;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	
}
