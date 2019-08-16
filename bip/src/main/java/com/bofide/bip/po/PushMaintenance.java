package com.bofide.bip.po;

import java.util.Date;

public class PushMaintenance {
	private Integer id;
	private Integer storeId;//4s店id
	private String reportNumber;//报案号
	private Date pushTime;//推送时间
	private String insuranceNumber;//保单号
	private String carLicenseNumber;//车牌号
	private String chassisNumber;//车架号
	private String insuranceComp;//保险公司
	private String reporter;//报案人
	private String reporterPhone;//报案电话
	private Date reportTime;//报案时间
	private String accidentPlace;//出险地点
	private Date accidentTime;//出险时间
	private String accidentReason;//出险原因
	private String agencyName;//机构名称
	private String agencyCode;//机构代码
	private String channelSource;//保单渠道来源
	private String groupType;//个团类型
	private String clerk;//业务员
	private String customerFlag;//客户标识
	private Date insuranceDateStart;//保险起期
	private Date insuranceDateEnd;//保险止期
	private String driveArea;//行驶区域
	private Double csxbe;//车损险保额
	private Double syszxbe;//商业三者险保额
	private Date lasj;//立案时间
	private Double laje;//立案金额
	private Double cslaje;//车损立案金额
	private Double rslaje;//人伤立案金额
	private Double wslaje;//物损立案金额
	private Date jasj;//结案时间
	private Double jaje;//结案金额
	private Double csjaje;//车损结案金额
	private Double rsjaje;//人伤结案金额
	private Double wsjaje;//物损结案金额
	private Double zaje;//整案金额
	private String bajsy;//报案驾驶员
	private String cxjsy;//出险驾驶员
	private Integer sfhk;//是否回款
	private Integer sfxcba;//是否现场报案
	private Integer sfmxc;//是否免现场
	private String sslx;//损失类型
	private String baclyj;//报案处理意见
	private String sglx;//事故类型
	private Integer zrxs;//责任系数
	private String ajtd;//案件通道
	private String ajzt;//案件状态
	private String wjzt;//未决状态
	private Double wjje;//未决金额
	private Integer pfcs;//赔付次数
	private String pfjl;//赔付结论
	private String baly;//报案来源
	private Date createTime;//创建时间
	private MaintenanceRecord maintenanceRecord;
	private PushMaintenanceChild pushMaintenanceChild;
	
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
	public Date getPushTime() {
		return pushTime;
	}
	public void setPushTime(Date pushTime) {
		this.pushTime = pushTime;
	}
	public String getInsuranceNumber() {
		return insuranceNumber;
	}
	public void setInsuranceNumber(String insuranceNumber) {
		this.insuranceNumber = insuranceNumber;
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
	public String getInsuranceComp() {
		return insuranceComp;
	}
	public void setInsuranceComp(String insuranceComp) {
		this.insuranceComp = insuranceComp;
	}
	public String getReporter() {
		return reporter;
	}
	public void setReporter(String reporter) {
		this.reporter = reporter;
	}
	public String getReporterPhone() {
		return reporterPhone;
	}
	public void setReporterPhone(String reporterPhone) {
		this.reporterPhone = reporterPhone;
	}
	public Date getReportTime() {
		return reportTime;
	}
	public void setReportTime(Date reportTime) {
		this.reportTime = reportTime;
	}
	public String getAccidentPlace() {
		return accidentPlace;
	}
	public void setAccidentPlace(String accidentPlace) {
		this.accidentPlace = accidentPlace;
	}
	public Date getAccidentTime() {
		return accidentTime;
	}
	public void setAccidentTime(Date accidentTime) {
		this.accidentTime = accidentTime;
	}
	public String getAccidentReason() {
		return accidentReason;
	}
	public void setAccidentReason(String accidentReason) {
		this.accidentReason = accidentReason;
	}
	public String getAgencyName() {
		return agencyName;
	}
	public void setAgencyName(String agencyName) {
		this.agencyName = agencyName;
	}
	public String getAgencyCode() {
		return agencyCode;
	}
	public void setAgencyCode(String agencyCode) {
		this.agencyCode = agencyCode;
	}
	public String getChannelSource() {
		return channelSource;
	}
	public void setChannelSource(String channelSource) {
		this.channelSource = channelSource;
	}
	public String getGroupType() {
		return groupType;
	}
	public void setGroupType(String groupType) {
		this.groupType = groupType;
	}
	public String getClerk() {
		return clerk;
	}
	public void setClerk(String clerk) {
		this.clerk = clerk;
	}
	public String getCustomerFlag() {
		return customerFlag;
	}
	public void setCustomerFlag(String customerFlag) {
		this.customerFlag = customerFlag;
	}
	public Date getInsuranceDateStart() {
		return insuranceDateStart;
	}
	public void setInsuranceDateStart(Date insuranceDateStart) {
		this.insuranceDateStart = insuranceDateStart;
	}
	public Date getInsuranceDateEnd() {
		return insuranceDateEnd;
	}
	public void setInsuranceDateEnd(Date insuranceDateEnd) {
		this.insuranceDateEnd = insuranceDateEnd;
	}
	public String getDriveArea() {
		return driveArea;
	}
	public void setDriveArea(String driveArea) {
		this.driveArea = driveArea;
	}
	public Double getCsxbe() {
		return csxbe;
	}
	public void setCsxbe(Double csxbe) {
		this.csxbe = csxbe;
	}
	public Double getSyszxbe() {
		return syszxbe;
	}
	public void setSyszxbe(Double syszxbe) {
		this.syszxbe = syszxbe;
	}
	public Date getLasj() {
		return lasj;
	}
	public void setLasj(Date lasj) {
		this.lasj = lasj;
	}
	public Double getLaje() {
		return laje;
	}
	public void setLaje(Double laje) {
		this.laje = laje;
	}
	public Double getCslaje() {
		return cslaje;
	}
	public void setCslaje(Double cslaje) {
		this.cslaje = cslaje;
	}
	public Double getRslaje() {
		return rslaje;
	}
	public void setRslaje(Double rslaje) {
		this.rslaje = rslaje;
	}
	public Double getWslaje() {
		return wslaje;
	}
	public void setWslaje(Double wslaje) {
		this.wslaje = wslaje;
	}
	public Date getJasj() {
		return jasj;
	}
	public void setJasj(Date jasj) {
		this.jasj = jasj;
	}
	public Double getJaje() {
		return jaje;
	}
	public void setJaje(Double jaje) {
		this.jaje = jaje;
	}
	public Double getCsjaje() {
		return csjaje;
	}
	public void setCsjaje(Double csjaje) {
		this.csjaje = csjaje;
	}
	public Double getRsjaje() {
		return rsjaje;
	}
	public void setRsjaje(Double rsjaje) {
		this.rsjaje = rsjaje;
	}
	public Double getWsjaje() {
		return wsjaje;
	}
	public void setWsjaje(Double wsjaje) {
		this.wsjaje = wsjaje;
	}
	public Double getZaje() {
		return zaje;
	}
	public void setZaje(Double zaje) {
		this.zaje = zaje;
	}
	public String getBajsy() {
		return bajsy;
	}
	public void setBajsy(String bajsy) {
		this.bajsy = bajsy;
	}
	public String getCxjsy() {
		return cxjsy;
	}
	public void setCxjsy(String cxjsy) {
		this.cxjsy = cxjsy;
	}
	public Integer getSfhk() {
		return sfhk;
	}
	public void setSfhk(Integer sfhk) {
		this.sfhk = sfhk;
	}
	public Integer getSfxcba() {
		return sfxcba;
	}
	public void setSfxcba(Integer sfxcba) {
		this.sfxcba = sfxcba;
	}
	public Integer getSfmxc() {
		return sfmxc;
	}
	public void setSfmxc(Integer sfmxc) {
		this.sfmxc = sfmxc;
	}
	public String getSslx() {
		return sslx;
	}
	public void setSslx(String sslx) {
		this.sslx = sslx;
	}
	public String getBaclyj() {
		return baclyj;
	}
	public void setBaclyj(String baclyj) {
		this.baclyj = baclyj;
	}
	public String getSglx() {
		return sglx;
	}
	public void setSglx(String sglx) {
		this.sglx = sglx;
	}
	public Integer getZrxs() {
		return zrxs;
	}
	public void setZrxs(Integer zrxs) {
		this.zrxs = zrxs;
	}
	public String getAjtd() {
		return ajtd;
	}
	public void setAjtd(String ajtd) {
		this.ajtd = ajtd;
	}
	public String getAjzt() {
		return ajzt;
	}
	public void setAjzt(String ajzt) {
		this.ajzt = ajzt;
	}
	public String getWjzt() {
		return wjzt;
	}
	public void setWjzt(String wjzt) {
		this.wjzt = wjzt;
	}
	public Double getWjje() {
		return wjje;
	}
	public void setWjje(Double wjje) {
		this.wjje = wjje;
	}
	public Integer getPfcs() {
		return pfcs;
	}
	public void setPfcs(Integer pfcs) {
		this.pfcs = pfcs;
	}
	public String getPfjl() {
		return pfjl;
	}
	public void setPfjl(String pfjl) {
		this.pfjl = pfjl;
	}
	public String getBaly() {
		return baly;
	}
	public void setBaly(String baly) {
		this.baly = baly;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public MaintenanceRecord getMaintenanceRecord() {
		return maintenanceRecord;
	}
	public void setMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
		this.maintenanceRecord = maintenanceRecord;
	}
	public PushMaintenanceChild getPushMaintenanceChild() {
		return pushMaintenanceChild;
	}
	public void setPushMaintenanceChild(PushMaintenanceChild pushMaintenanceChild) {
		this.pushMaintenanceChild = pushMaintenanceChild;
	}
	
	
}
