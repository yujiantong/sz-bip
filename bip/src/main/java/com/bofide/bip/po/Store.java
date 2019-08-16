package com.bofide.bip.po;

import java.util.Date;

public class Store {
	
	/**
     * 4s店id
     */
	private Integer storeId;
	
	/**
     * 4S店名称
     */
	private String storeName;
	
	/**
     * 4S店简称
     */
	private String shortStoreName;
	
	/**
     * AM账号
     */
	private String adminAccount;
	
	/**
     * AM密码
     */
	private String adminPassword;
	
	/**
     * 汽车品牌(多种,/分隔)
     */
	private String carBrand;
	
    /**
     * 创建时间
     */
    private Date createDate;
    
    /**
     * 删除时间
     */
    private Date deleteDate;
    
    /**
     * 有效期开始时间
     */
    private Date vaildDateStart;
    /**
     * 有效期结束时间
     */
    private Date vaildDate;
    
    /**
     * 是否删除 0-正常 1-删除
     */
	private Integer deleted;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 店导入状态
     */
    private Integer importStatus;
    
    /**
     * bsp店的id
     */
    private Integer bspStoreId;
    /**
     * bsp店的绑定时间
     */
    private Date bangTime;
    /**
     * bsp店的绑定状态
     */
    private Integer bangStatu;
    /**
     * 绑定后的bsp店
     */
    private BspStore bspStore;
    /**
     * 是否支持壁虎对接 （0表示都没有选择，1表示都选择，2表示只选择续险，3表示只选择报价）
     */
    private Integer bhDock;
    /**
     * 壁虎渠道码
     */
    private String agent;
    
    /**
     * 壁虎密钥
     */
    private String bihuKey;
    
    /**
     * 城市码
     */
    private String cityCode;
    
    /**
     * 自动更新的时候查询的偏移量
     */
    private Integer deviation;
    /**
     * 是否锁死客户级别
     */
    private Integer lockLevel;
    /**
     * 是否启用客服模块,0表示不启用,1表示启用
     */
    private Integer csModuleFlag;
    /**
     * 是否启用出单员模块,0表示不启用,1表示启用
     */
    private Integer asmModuleFlag;
    /**
     * 是否启销售顾问模块,0表示不启用,1表示启用
     */
    private Integer saleFlag;
    /**
     * 是否启服务顾问模块,0表示不启用,1表示启用
     */
    private Integer afterSaleFlag;
    
    /**
     * bofide对接接口需要的参数
     */
    private String shopId;
    /**
     * bofide对接接口需要的参数
     */
    private String token;
    /**
     * 集团事业部ID
     */
    private Integer unitId;
    /**
     * 集团id
     */
    private Integer jtId;
    /**
     * 所属集团
     */
    private Bloc bloc;
    /**
     * 工商注册名称
     */
    private String registName;
    /**
     * 税号
     */
    private String taxNum;
    /**
     * 代号
     */
    private String code;
    /**
     * 负责人
     */
    private String fzr;
    /**
     * 联系人
     */
    private String lxr;
    /**
     * 电话
     */
    private String phone;
    /**
     * 邮件
     */
    private String email;
    /**
     * 地址
     */
    private String address;
    /**
     * logo显示
     */
    private Integer logo;
    /**
     * 所属区域分析师ID
     */
    private String dataAnalystIds;
    /**
     * 是否启用营销短信功能
     */
    private Integer updateSMS;
    /**
     * 营销短信余额
     */
    private Double messageBalance;
	/**  
	 * 4s店id  
	 * @return storeId   4s店id  
	 */
	public Integer getStoreId() {
		return storeId;
	}
	/**  
	 * 4s店id  
	 * @param storeId  4s店id  
	 */
	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}
	/**  
	 * 4S店名称  
	 * @return storeName   4S店名称  
	 */
	public String getStoreName() {
		return storeName;
	}
	/**  
	 * 4S店名称  
	 * @param storeName  4S店名称  
	 */
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	/**  
	 * 4S店简称  
	 * @return shortStoreName   4S店简称  
	 */
	public String getShortStoreName() {
		return shortStoreName;
	}
	/**  
	 * 4S店简称  
	 * @param shortStoreName  4S店简称  
	 */
	public void setShortStoreName(String shortStoreName) {
		this.shortStoreName = shortStoreName;
	}
	/**  
	 * AM账号  
	 * @return adminAccount   AM账号  
	 */
	public String getAdminAccount() {
		return adminAccount;
	}
	/**  
	 * AM账号  
	 * @param adminAccount  AM账号  
	 */
	public void setAdminAccount(String adminAccount) {
		this.adminAccount = adminAccount;
	}
	/**  
	 * AM密码  
	 * @return adminPassword   AM密码  
	 */
	public String getAdminPassword() {
		return adminPassword;
	}
	/**  
	 * AM密码  
	 * @param adminPassword  AM密码  
	 */
	public void setAdminPassword(String adminPassword) {
		this.adminPassword = adminPassword;
	}
	/**  
	 * 汽车品牌(多种分隔)  
	 * @return carBrand   汽车品牌(多种分隔)  
	 */
	public String getCarBrand() {
		return carBrand;
	}
	/**  
	 * 汽车品牌(多种分隔)  
	 * @param carBrand  汽车品牌(多种分隔)  
	 */
	public void setCarBrand(String carBrand) {
		this.carBrand = carBrand;
	}
	/**  
	 * 创建时间  
	 * @return createDate   创建时间  
	 */
	public Date getCreateDate() {
		return createDate;
	}
	/**  
	 * 创建时间  
	 * @param createDate  创建时间  
	 */
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	/**  
	 * 删除时间  
	 * @return deleteDate   删除时间  
	 */
	public Date getDeleteDate() {
		return deleteDate;
	}
	/**  
	 * 删除时间  
	 * @param deleteDate  删除时间  
	 */
	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}
	/**  
	 * 店有效期  
	 * @return vaildDate   店有效期  
	 */
	public Date getVaildDate() {
		return vaildDate;
	}
	/**  
	 * 店有效期  
	 * @param vaildDate  店有效期  
	 */
	public void setVaildDate(Date vaildDate) {
		this.vaildDate = vaildDate;
	}
	/**  
	 * 是否删除0-正常1-删除  
	 * @return deleted   是否删除0-正常1-删除  
	 */
	public Integer getDeleted() {
		return deleted;
	}
	/**  
	 * 是否删除0-正常1-删除  
	 * @param deleted  是否删除0-正常1-删除  
	 */
	public void setDeleted(Integer deleted) {
		this.deleted = deleted;
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
	 * 店导入状态  
	 * @return importStatus   店导入状态  
	 */
	public Integer getImportStatus() {
		return importStatus;
	}
	/**  
	 * 店导入状态  
	 * @param importStatus  店导入状态  
	 */
	public void setImportStatus(Integer importStatus) {
		this.importStatus = importStatus;
	}
	/**  
	 * bsp店的id  
	 * @return bspStoreId   bsp店的id  
	 */
	public Integer getBspStoreId() {
		return bspStoreId;
	}
	/**  
	 * bsp店的id  
	 * @param bspStoreId  bsp店的id  
	 */
	public void setBspStoreId(Integer bspStoreId) {
		this.bspStoreId = bspStoreId;
	}
	/**  
	 * bsp店的绑定时间  
	 * @return bangTime   bsp店的绑定时间  
	 */
	public Date getBangTime() {
		return bangTime;
	}
	/**  
	 * bsp店的绑定时间  
	 * @param bangTime  bsp店的绑定时间  
	 */
	public void setBangTime(Date bangTime) {
		this.bangTime = bangTime;
	}
	/**  
	 * bsp店的绑定状态  
	 * @return bangStatu   bsp店的绑定状态  
	 */
	public Integer getBangStatu() {
		return bangStatu;
	}
	/**  
	 * bsp店的绑定状态  
	 * @param bangStatu  bsp店的绑定状态  
	 */
	public void setBangStatu(Integer bangStatu) {
		this.bangStatu = bangStatu;
	}
	/**  
	 * 绑定后的bsp店  
	 * @return bspStore   绑定后的bsp店  
	 */
	public BspStore getBspStore() {
		return bspStore;
	}
	/**  
	 * 绑定后的bsp店  
	 * @param bspStore  绑定后的bsp店  
	 */
	public void setBspStore(BspStore bspStore) {
		this.bspStore = bspStore;
	}
	/**  
	 * 是否支持壁虎对接（0表示都没有选择，1表示都选择，2表示只选择续险，3表示只选择报价）  
	 * @return bhDock   是否支持壁虎对接（0表示都没有选择，1表示都选择，2表示只选择续险，3表示只选择报价）  
	 */
	public Integer getBhDock() {
		return bhDock;
	}
	/**  
	 * 是否支持壁虎对接（0表示都没有选择，1表示都选择，2表示只选择续险，3表示只选择报价）  
	 * @param bhDock  是否支持壁虎对接（0表示都没有选择，1表示都选择，2表示只选择续险，3表示只选择报价）  
	 */
	public void setBhDock(Integer bhDock) {
		this.bhDock = bhDock;
	}
	/**  
	 * 壁虎渠道码  
	 * @return agent   壁虎渠道码  
	 */
	public String getAgent() {
		return agent;
	}
	/**  
	 * 壁虎渠道码  
	 * @param agent  壁虎渠道码  
	 */
	public void setAgent(String agent) {
		this.agent = agent;
	}
	/**  
	 * 壁虎密钥  
	 * @return bihuKey   壁虎密钥  
	 */
	public String getBihuKey() {
		return bihuKey;
	}
	/**  
	 * 壁虎密钥  
	 * @param bihuKey  壁虎密钥  
	 */
	public void setBihuKey(String bihuKey) {
		this.bihuKey = bihuKey;
	}
	/**  
	 * 自动更新的时候查询的偏移量  
	 * @return deviation   自动更新的时候查询的偏移量  
	 */
	public Integer getDeviation() {
		return deviation;
	}
	/**  
	 * 自动更新的时候查询的偏移量  
	 * @param deviation  自动更新的时候查询的偏移量  
	 */
	public void setDeviation(Integer deviation) {
		this.deviation = deviation;
	}
	/**  
	 * 是否锁死客户级别  
	 * @return lockLevel   是否锁死客户级别  
	 */
	public Integer getLockLevel() {
		return lockLevel;
	}
	/**  
	 * 是否锁死客户级别  
	 * @param lockLevel  是否锁死客户级别  
	 */
	public void setLockLevel(Integer lockLevel) {
		this.lockLevel = lockLevel;
	}
	/**  
	 * 城市码  
	 * @return cityCode   城市码  
	 */
	public String getCityCode() {
		return cityCode;
	}
	/**  
	 * 城市码  
	 * @param cityCode  城市码  
	 */
	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}
	public String getShopId() {
		return shopId;
	}
	public void setShopId(String shopId) {
		this.shopId = shopId;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Integer getUnitId() {
		return unitId;
	}
	public void setUnitId(Integer unitId) {
		this.unitId = unitId;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	public Bloc getBloc() {
		return bloc;
	}
	public void setBloc(Bloc bloc) {
		this.bloc = bloc;
	}
	public Date getVaildDateStart() {
		return vaildDateStart;
	}
	public void setVaildDateStart(Date vaildDateStart) {
		this.vaildDateStart = vaildDateStart;
	}
	public Integer getJtId() {
		return jtId;
	}
	public void setJtId(Integer jtId) {
		this.jtId = jtId;
	}
	public String getRegistName() {
		return registName;
	}
	public void setRegistName(String registName) {
		this.registName = registName;
	}
	public String getTaxNum() {
		return taxNum;
	}
	public void setTaxNum(String taxNum) {
		this.taxNum = taxNum;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getFzr() {
		return fzr;
	}
	public void setFzr(String fzr) {
		this.fzr = fzr;
	}
	public String getLxr() {
		return lxr;
	}
	public void setLxr(String lxr) {
		this.lxr = lxr;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Integer getCsModuleFlag() {
		return csModuleFlag;
	}
	public void setCsModuleFlag(Integer csModuleFlag) {
		this.csModuleFlag = csModuleFlag;
	}
	public Integer getAsmModuleFlag() {
		return asmModuleFlag;
	}
	public void setAsmModuleFlag(Integer asmModuleFlag) {
		this.asmModuleFlag = asmModuleFlag;
	}
	public Integer getSaleFlag() {
		return saleFlag;
	}
	public void setSaleFlag(Integer saleFlag) {
		this.saleFlag = saleFlag;
	}
	public Integer getAfterSaleFlag() {
		return afterSaleFlag;
	}
	public void setAfterSaleFlag(Integer afterSaleFlag) {
		this.afterSaleFlag = afterSaleFlag;
	}
	public Integer getLogo() {
		return logo;
	}
	public void setLogo(Integer logo) {
		this.logo = logo;
	}
	public String getDataAnalystIds() {
		return dataAnalystIds;
	}
	public void setDataAnalystIds(String dataAnalystIds) {
		this.dataAnalystIds = dataAnalystIds;
	}
	public Integer getUpdateSMS() {
		return updateSMS;
	}
	public void setUpdateSMS(Integer updateSMS) {
		this.updateSMS = updateSMS;
	}
	public Double getMessageBalance() {
		return messageBalance;
	}
	public void setMessageBalance(Double messageBalance) {
		this.messageBalance = messageBalance;
	}
	@Override
	public String toString() {
		return "Store [storeId=" + storeId + ", storeName=" + storeName
				+ ", shortStoreName=" + shortStoreName + ", adminAccount="
				+ adminAccount + ", adminPassword=" + adminPassword
				+ ", carBrand=" + carBrand + ", createDate=" + createDate
				+ ", deleteDate=" + deleteDate + ", vaildDateStart="
				+ vaildDateStart + ", vaildDate=" + vaildDate + ", deleted="
				+ deleted + ", remark=" + remark + ", importStatus="
				+ importStatus + ", bspStoreId=" + bspStoreId + ", bangTime="
				+ bangTime + ", bangStatu=" + bangStatu + ", bspStore="
				+ bspStore + ", bhDock=" + bhDock + ", agent=" + agent
				+ ", bihuKey=" + bihuKey + ", cityCode=" + cityCode
				+ ", deviation=" + deviation + ", lockLevel=" + lockLevel
				+ ", csModuleFlag=" + csModuleFlag + ", asmModuleFlag=" + asmModuleFlag 
				+ ", saleFlag=" + saleFlag + ", afterSaleFlag=" + afterSaleFlag
				+ ", shopId=" + shopId
				+ ", token=" + token + ", unitId=" + unitId + ", jtId=" + jtId
				+ ", bloc=" + bloc + ", registName=" + registName + ", taxNum="
				+ taxNum + ", code=" + code + ", fzr=" + fzr + ", lxr=" + lxr
				+ ", phone=" + phone + ", email=" + email + ", address="
				+ address + ", logo=" + logo + ", dataAnalystIds=" + dataAnalystIds + ", updateSMS=" 
				+ updateSMS + ", messageBalance=" + messageBalance + "]";
	}
	
}
