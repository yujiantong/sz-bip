package com.bofide.bip.vo;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.bofide.bip.po.Role;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;

public class UserVo implements Serializable {
	private static final long serialVersionUID = 5024740564280319370L;
	//用户id
	private Integer userId ;
	//用户名
	private String userName;
	//上级id
	private Integer superiorId;
	//用户状态
	private Integer status;
	//用户电话号码
	private String phone;
	private Role role;
	
	private Store store;
	//店铺的首次提醒天数
	private Integer dayNumber;
	
	//用户的首次登陆状态
	private Integer firstLogin;
	//用户所在店的
	private List<TraceDaySet> daySets;
	//是否开启台帐模块
	private Integer accountModule;
	//集团ID
	private Integer jtId;
	//部门ID
	private Integer unitId;
	//集团缩写
	private String jtShortName;
	//集团有效期开始
	private Date jtYxqStart;
	//集团有效期结束
	private Date jtYxqEnd;

	public UserVo(){}

	public Date getJtYxqStart() {
		return jtYxqStart;
	}

	public void setJtYxqStart(Date jtYxqStart) {
		this.jtYxqStart = jtYxqStart;
	}

	public Date getJtYxqEnd() {
		return jtYxqEnd;
	}

	public void setJtYxqEnd(Date jtYxqEnd) {
		this.jtYxqEnd = jtYxqEnd;
	}

	public Integer getAccountModule() {
		return accountModule;
	}

	public void setAccountModule(Integer accountModule) {
		this.accountModule = accountModule;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public Integer getSuperiorId() {
		return superiorId;
	}

	public void setSuperiorId(Integer superiorId) {
		this.superiorId = superiorId;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}
	public Integer getFirstLogin() {
		return firstLogin;
	}

	public void setFirstLogin(Integer firstLogin) {
		this.firstLogin = firstLogin;
	}
	
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getDayNumber() {
		return dayNumber;
	}

	public void setDayNumber(Integer dayNumber) {
		this.dayNumber = dayNumber;
	}

	public List<TraceDaySet> getDaySets() {
		return daySets;
	}

	public void setDaySets(List<TraceDaySet> daySets) {
		this.daySets = daySets;
	}

	public Integer getJtId() {
		return jtId;
	}

	public void setJtId(Integer jtId) {
		this.jtId = jtId;
	}

	public Integer getUnitId() {
		return unitId;
	}

	public void setUnitId(Integer unitId) {
		this.unitId = unitId;
	}

	public String getJtShortName() {
		return jtShortName;
	}

	public void setJtShortName(String jtShortName) {
		this.jtShortName = jtShortName;
	}

	@Override
	public String toString() {
		return "UserVo [userId=" + userId + ", userName=" + userName
				+ ", superiorId=" + superiorId + ", status=" + status
				+ ", phone=" + phone + ", role=" + role + ", store=" + store
				+ ", dayNumber=" + dayNumber + ", firstLogin=" + firstLogin
				+ ", daySets=" + daySets + ", accountModule=" + accountModule
				+ "]";
	}

}
