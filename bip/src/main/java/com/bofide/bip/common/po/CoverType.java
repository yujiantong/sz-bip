package com.bofide.bip.common.po;

public class CoverType {
	public static int XINBAO = 1;//新保
	public static int XINZHUANXU = 2;//新转续
	public static int XUZHUANXU = 3;//续转续
	public static int JIANZHUANXU = 4;//间转续
	public static int QIANZHUANXU = 5;//潜转续
	public static int SHOUCI = 6;//首次
	private Integer coverType;
	private String coverTypeName;
	
	public CoverType(){}

	public Integer getCoverType() {
		return coverType;
	}

	public void setCoverType(Integer coverType) {
		this.coverType = coverType;
	}

	public String getCoverTypeName() {
		return coverTypeName;
	}

	public void setCoverTypeName(String coverTypeName) {
		this.coverTypeName = coverTypeName;
	}
	
	
}
