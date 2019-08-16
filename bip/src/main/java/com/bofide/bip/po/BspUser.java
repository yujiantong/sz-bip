package com.bofide.bip.po;

public class BspUser {
	
	private Integer bspUserId;//用户ID
	private String bspUserName;//bsp店用户名
	private String bspLoginName;//4s店登录名
	private String bspUserPosition;//bsp店用户岗位
	private Integer bspStoreId;//bsp店
	
	
	
	public Integer getBspUserId() {
		return bspUserId;
	}



	public void setBspUserId(Integer bspUserId) {
		this.bspUserId = bspUserId;
	}



	public String getBspUserName() {
		return bspUserName;
	}



	public void setBspUserName(String bspUserName) {
		this.bspUserName = bspUserName;
	}



	public String getBspLoginName() {
		return bspLoginName;
	}



	public void setBspLoginName(String bspLoginName) {
		this.bspLoginName = bspLoginName;
	}



	public String getBspUserPosition() {
		return bspUserPosition;
	}



	public void setBspUserPosition(String bspUserPosition) {
		this.bspUserPosition = bspUserPosition;
	}



	public Integer getBspStoreId() {
		return bspStoreId;
	}



	public void setBspStoreId(Integer bspStoreId) {
		this.bspStoreId = bspStoreId;
	}



	@Override
	public String toString() {
		return "BspUser [bspUserId=" + bspUserId + ", bspUserName="
				+ bspUserName + ", bspLoginName=" + bspLoginName
				+ ", bspUserPosition=" + bspUserPosition + ", bspStoreId="
				+ bspStoreId + "]";
	}
	
}
