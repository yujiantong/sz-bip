package com.bofide.bip.po;

public class BspStore {
	private Integer bspStoreId;
	private String bspStoreName;
	public Integer getBspStoreId() {
		return bspStoreId;
	}
	public void setBspStoreId(Integer bspStoreId) {
		this.bspStoreId = bspStoreId;
	}
	public String getBspStoreName() {
		return bspStoreName;
	}
	public void setBspStoreName(String bspStoreName) {
		this.bspStoreName = bspStoreName;
	}
	@Override
	public String toString() {
		return "BspStore [bspStoreId=" + bspStoreId + ", bspStoreName="
				+ bspStoreName + "]";
	}
	
	
}
