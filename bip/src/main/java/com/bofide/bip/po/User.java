package com.bofide.bip.po;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class User implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id ;
	//4s店ID
	private Integer storeId;
	//集团ID
	private Integer jtId;
	//登录名
	private String loginName;
	//用户名
	private String userName;
	//电话
	private String phone;
	//邮箱
	private String email;
	//登录密码
	private String password;
	//角色Id
	private Integer roleId ;
	//上级id
	private Integer superiorId;
	//创建日期
	private Date createDate;
	//删除日期
	private Date deleteDate;
	//是否删除
	private Integer deleted;
	//备注
	private String remark;
	//用户状态0正常1暂停2禁用
	private Integer status;
	//系统消息id
	private Integer sysMessageId;
	//登录uuid
	private String loginUuId;
	private Role role;
	//bsp用户id
	private Integer bspUserId;
	//绑定时间
	private Date bangTime;
	//绑定状态
	private Integer bangStatu;
	//绑定成功的bsp用户
	private BspUser bspUser;
	//用户的首次登陆状态
	private Integer firstLogin;
	//app登录时的uuid
	private String loginAppUuId;
	//本用户新转续需要补齐的分配潜客数量
	private Integer xinzhuanxu;
	//本用户续转续需要补齐的分配潜客数量
	private Integer xuzhuanxu;
	//本用户间转续需要补齐的分配潜客数量
	private Integer jianzhuanxu;
	//本用户潜转续需要补齐的分配潜客数量
	private Integer qianzhuanxu;
	//本用户首次需要补齐的分配潜客数量
	private Integer shouci;
	//集团事业部ID
	private Integer unitId;
	//销售战败线索平均分配标志
	private Integer defeatClue;
	//管辖店
	private List<Store> storeList;
	
	
	public Integer getJtId() {
		return jtId;
	}
	public void setJtId(Integer jtId) {
		this.jtId = jtId;
	}
	public BspUser getBspUser() {
		return bspUser;
	}
	public void setBspUser(BspUser bspUser) {
		this.bspUser = bspUser;
	}
	public Integer getBspUserId() {
		return bspUserId;
	}
	public void setBspUserId(Integer bspUserId) {
		this.bspUserId = bspUserId;
	}
	public Date getBangTime() {
		return bangTime;
	}
	public void setBangTime(Date bangTime) {
		this.bangTime = bangTime;
	}
	public Integer getBangStatu() {
		return bangStatu;
	}
	public void setBangStatu(Integer bangStatu) {
		this.bangStatu = bangStatu;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
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
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
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
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Integer getRoleId() {
		return roleId;
	}
	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
	public Integer getSuperiorId() {
		return superiorId;
	}
	public void setSuperiorId(Integer superiorId) {
		this.superiorId = superiorId;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Date getDeleteDate() {
		return deleteDate;
	}
	public Integer getDeleted() {
		return deleted;
	}
	public void setDeleted(Integer deleted) {
		this.deleted = deleted;
	}
	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getSysMessageId() {
		return sysMessageId;
	}
	public void setSysMessageId(Integer sysMessageId) {
		this.sysMessageId = sysMessageId;
	}
	public String getLoginUuId() {
		return loginUuId;
	}
	public void setLoginUuId(String loginUuId) {
		this.loginUuId = loginUuId;
	}
	public Integer getFirstLogin() {
		return firstLogin;
	}
	public void setFirstLogin(Integer firstLogin) {
		this.firstLogin = firstLogin;
	}
	public String getLoginAppUuId() {
		return loginAppUuId;
	}
	public void setLoginAppUuId(String loginAppUuId) {
		this.loginAppUuId = loginAppUuId;
	}
	public Integer getXinzhuanxu() {
		return xinzhuanxu;
	}
	public void setXinzhuanxu(Integer xinzhuanxu) {
		this.xinzhuanxu = xinzhuanxu;
	}
	public Integer getXuzhuanxu() {
		return xuzhuanxu;
	}
	public void setXuzhuanxu(Integer xuzhuanxu) {
		this.xuzhuanxu = xuzhuanxu;
	}
	public Integer getJianzhuanxu() {
		return jianzhuanxu;
	}
	public void setJianzhuanxu(Integer jianzhuanxu) {
		this.jianzhuanxu = jianzhuanxu;
	}
	public Integer getQianzhuanxu() {
		return qianzhuanxu;
	}
	public void setQianzhuanxu(Integer qianzhuanxu) {
		this.qianzhuanxu = qianzhuanxu;
	}
	public Integer getShouci() {
		return shouci;
	}
	public void setShouci(Integer shouci) {
		this.shouci = shouci;
	}
	public Integer getUnitId() {
		return unitId;
	}
	public void setUnitId(Integer unitId) {
		this.unitId = unitId;
	}
	public Integer getDefeatClue() {
		return defeatClue;
	}
	public void setDefeatClue(Integer defeatClue) {
		this.defeatClue = defeatClue;
	}
	public List<Store> getStoreList() {
		return storeList;
	}
	public void setStoreList(List<Store> storeList) {
		this.storeList = storeList;
	}
	@Override
	public String toString() {
		return "User [id=" + id + ", storeId=" + storeId + ", loginName=" + loginName + ", userName=" + userName
				+ ", phone=" + phone + ", email=" + email + ", password=" + password + ", roleId=" + roleId
				+ ", superiorId=" + superiorId + ", createDate=" + createDate + ", deleteDate=" + deleteDate
				+ ", deleted=" + deleted + ", remark=" + remark + ", status=" + status + ", sysMessageId="
				+ sysMessageId + ", loginUuId=" + loginUuId + ", role=" + role + ",firstLogin="+firstLogin+""
				+ ",loginAppUuId="+loginAppUuId+", xinzhuanxu="+xinzhuanxu+", xuzhuanxu="+xuzhuanxu+""
				+ ", jianzhuanxu="+jianzhuanxu+", qianzhuanxu="+qianzhuanxu+", shouci="+shouci+", storeList="+storeList+"]";
	}
	
}
