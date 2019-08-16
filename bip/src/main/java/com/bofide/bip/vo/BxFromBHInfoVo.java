package com.bofide.bip.vo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class BxFromBHInfoVo implements Serializable{
	private static final long serialVersionUID = 5024740564280319370L;
	
	//保险资源
	private Integer source;
	//车损保额
	private Double cheSun;
	//第三方责任险保额
	private Double sanZhe;
	//全车盗抢保险保额
	private Double daoQiang;
	//车上人员责任险（司机）保额
	private Double siJi;
	//车上人员责任险（乘客）保额
	private Double chengKe;
	//玻璃单独破碎险保额，0-不投保，1国产，2进口
	private Integer boLi;
	//车身划痕损失险保额
	private Double huaHen;
	//不计免赔险（车损）保额
	private Double buJiMianCheSun;
	//不计免赔险（三者）保额
	private Double buJiMianSanZhe;
	//不计免赔险（盗抢）保额
	private Double buJiMianDaoQiang;
	//涉水行驶损失险保额
	private Double sheShui;
	//自燃损失险保额
	private Double ziRan;
	//不计免乘客保额
	private Double buJiMianChengKe;
	//不计免司机保额
	private Double buJiMianSiJi;
	//不计免划痕保额
	private Double buJiMianHuaHen;
	//不计免涉水保额
	private Double buJiMianSheShui;
	//不计免自燃保额
	private Double buJiMianZiRan;
	//不计免精神损失保额
	private Double buJiMianJingShenSunShi;
	//机动车无法找到三方特约险保额
	private Double hcSanFangTeYue;
	//精神损失险保额
	private Double hcJingShenSunShi;
	//指定修理厂险
	private Double hcXiuLiChang;
	//指定专修厂类型 -1没有 国产0 进口1（依赖于请求参数）
	private Double hcXiuLiChangType;
	public Integer getSource() {
		return source;
	}
	public void setSource(Integer source) {
		this.source = source;
	}
	public Double getCheSun() {
		return cheSun;
	}
	public void setCheSun(Double cheSun) {
		this.cheSun = cheSun;
	}
	public Double getSanZhe() {
		return sanZhe;
	}
	public void setSanZhe(Double sanZhe) {
		this.sanZhe = sanZhe;
	}
	public Double getDaoQiang() {
		return daoQiang;
	}
	public void setDaoQiang(Double daoQiang) {
		this.daoQiang = daoQiang;
	}
	public Double getSiJi() {
		return siJi;
	}
	public void setSiJi(Double siJi) {
		this.siJi = siJi;
	}
	public Double getChengKe() {
		return chengKe;
	}
	public void setChengKe(Double chengKe) {
		this.chengKe = chengKe;
	}
	public Integer getBoLi() {
		return boLi;
	}
	public void setBoLi(Integer boLi) {
		this.boLi = boLi;
	}
	public Double getHuaHen() {
		return huaHen;
	}
	public void setHuaHen(Double huaHen) {
		this.huaHen = huaHen;
	}
	public Double getBuJiMianCheSun() {
		return buJiMianCheSun;
	}
	public void setBuJiMianCheSun(Double buJiMianCheSun) {
		this.buJiMianCheSun = buJiMianCheSun;
	}
	public Double getBuJiMianSanZhe() {
		return buJiMianSanZhe;
	}
	public void setBuJiMianSanZhe(Double buJiMianSanZhe) {
		this.buJiMianSanZhe = buJiMianSanZhe;
	}
	public Double getBuJiMianDaoQiang() {
		return buJiMianDaoQiang;
	}
	public void setBuJiMianDaoQiang(Double buJiMianDaoQiang) {
		this.buJiMianDaoQiang = buJiMianDaoQiang;
	}
	public Double getSheShui() {
		return sheShui;
	}
	public void setSheShui(Double sheShui) {
		this.sheShui = sheShui;
	}
	public Double getZiRan() {
		return ziRan;
	}
	public void setZiRan(Double ziRan) {
		this.ziRan = ziRan;
	}
	public Double getBuJiMianChengKe() {
		return buJiMianChengKe;
	}
	public void setBuJiMianChengKe(Double buJiMianChengKe) {
		this.buJiMianChengKe = buJiMianChengKe;
	}
	public Double getBuJiMianSiJi() {
		return buJiMianSiJi;
	}
	public void setBuJiMianSiJi(Double buJiMianSiJi) {
		this.buJiMianSiJi = buJiMianSiJi;
	}
	public Double getBuJiMianHuaHen() {
		return buJiMianHuaHen;
	}
	public void setBuJiMianHuaHen(Double buJiMianHuaHen) {
		this.buJiMianHuaHen = buJiMianHuaHen;
	}
	public Double getBuJiMianSheShui() {
		return buJiMianSheShui;
	}
	public void setBuJiMianSheShui(Double buJiMianSheShui) {
		this.buJiMianSheShui = buJiMianSheShui;
	}
	public Double getBuJiMianZiRan() {
		return buJiMianZiRan;
	}
	public void setBuJiMianZiRan(Double buJiMianZiRan) {
		this.buJiMianZiRan = buJiMianZiRan;
	}
	public Double getBuJiMianJingShenSunShi() {
		return buJiMianJingShenSunShi;
	}
	public void setBuJiMianJingShenSunShi(Double buJiMianJingShenSunShi) {
		this.buJiMianJingShenSunShi = buJiMianJingShenSunShi;
	}
	public Double getHcSanFangTeYue() {
		return hcSanFangTeYue;
	}
	public void setHcSanFangTeYue(Double hcSanFangTeYue) {
		this.hcSanFangTeYue = hcSanFangTeYue;
	}
	public Double getHcJingShenSunShi() {
		return hcJingShenSunShi;
	}
	public void setHcJingShenSunShi(Double hcJingShenSunShi) {
		this.hcJingShenSunShi = hcJingShenSunShi;
	}
	
	public Double getHcXiuLiChang() {
		return hcXiuLiChang;
	}
	public void setHcXiuLiChang(Double hcXiuLiChang) {
		this.hcXiuLiChang = hcXiuLiChang;
	}
	public Double getHcXiuLiChangType() {
		return hcXiuLiChangType;
	}
	public void setHcXiuLiChangType(Double hcXiuLiChangType) {
		this.hcXiuLiChangType = hcXiuLiChangType;
	}
	public String toStr() {
		StringBuffer sb = new StringBuffer("");
		if(cheSun>0){
			sb.append("车损险");
			if(cheSun>1){
				sb.append("("+cheSun+")");
			}
		}
		if(sanZhe>0){
			if(sb.length()>0){
				sb.append(",第三方责任险");
			}else{
				sb.append("第三方责任险");
			}
			if(sanZhe>1){
				sb.append("("+sanZhe+")");
			}
		}
		if(daoQiang>0){
			if(sb.length()>0){
				sb.append(",全车盗抢保险");
			}else{
				sb.append("全车盗抢保险");
			}
			if(daoQiang>1){
				sb.append("("+daoQiang+")");
			}
		}
		if(siJi>0){
			if(sb.length()>0){
				sb.append(",车上人员责任险（司机）");
			}else{
				sb.append("车上人员责任险（司机）");
			}
			if(siJi>1){
				sb.append("("+siJi+")");
			}
		}
		if(chengKe>0){
			if(sb.length()>0){
				sb.append(",车上人员责任险（乘客）");
			}else{
				sb.append("车上人员责任险（乘客）");
			}
			if(chengKe>1){
				sb.append("("+chengKe+")");
			}
		}
		if(boLi>0){
			if(sb.length()>0){
				sb.append(",玻璃单独破碎险");
			}else{
				sb.append("玻璃单独破碎险");
			}
			if(boLi>1){
				sb.append("("+boLi+")");
			}
		}
		if(huaHen>0){
			if(sb.length()>0){
				sb.append(",车身划痕损失险");
			}else{
				sb.append("车身划痕损失险");
			}
			if(huaHen>1){
				sb.append("("+huaHen+")");
			}
		}
		if(buJiMianCheSun>0){
			if(sb.length()>0){
				sb.append(",不计免赔险（车损）");
			}else{
				sb.append("不计免赔险（车损）");
			}
			if(buJiMianCheSun>1){
				sb.append("("+buJiMianCheSun+")");
			}
		}
		if(buJiMianSanZhe>0){
			if(sb.length()>0){
				sb.append(",不计免赔险（三者）");
			}else{
				sb.append("不计免赔险（三者）");
			}
			if(buJiMianSanZhe>1){
				sb.append("("+buJiMianSanZhe+")");
			}
		}
		if(buJiMianDaoQiang>0){
			if(sb.length()>0){
				sb.append(",不计免赔险（盗抢）");
			}else{
				sb.append("不计免赔险（盗抢）");
			}
			if(buJiMianDaoQiang>1){
				sb.append("("+buJiMianDaoQiang+")");
			}
		}
		if(sheShui>0){
			if(sb.length()>0){
				sb.append(",涉水行驶损失险");
			}else{
				sb.append("涉水行驶损失险");
			}
			if(sheShui>1){
				sb.append("("+sheShui+")");
			}
		}
		if(ziRan>0){
			if(sb.length()>0){
				sb.append(",自燃损失险");
			}else{
				sb.append("自燃损失险");
			}
			if(ziRan>1){
				sb.append("("+ziRan+")");
			}
		}
		if(buJiMianChengKe>0){
			if(sb.length()>0){
				sb.append(",不计免乘客险");
			}else{
				sb.append("不计免乘客险");
			}
			if(buJiMianChengKe>1){
				sb.append("("+buJiMianChengKe+")");
			}
		}
		if(buJiMianSiJi>0){
			if(sb.length()>0){
				sb.append(",不计免司机险");
			}else{
				sb.append("不计免司机险");
			}
			if(buJiMianSiJi>1){
				sb.append("("+buJiMianSiJi+")");
			}
		}
		if(buJiMianHuaHen>0){
			if(sb.length()>0){
				sb.append(",不计免划痕险");
			}else{
				sb.append("不计免划痕险");
			}
			if(buJiMianHuaHen>1){
				sb.append("("+buJiMianHuaHen+")");
			}
		}
		if(buJiMianSheShui>0){
			if(sb.length()>0){
				sb.append(",不计免涉水险");
			}else{
				sb.append("不计免涉水险");
			}
			if(buJiMianSheShui>1){
				sb.append("("+buJiMianSheShui+")");
			}
		}
		if(buJiMianZiRan>0){
			if(sb.length()>0){
				sb.append(",不计免自燃险");
			}else{
				sb.append("不计免自燃险");
			}
			if(buJiMianZiRan>1){
				sb.append("("+buJiMianZiRan+")");
			}
		}
		if(buJiMianJingShenSunShi>0){
			if(sb.length()>0){
				sb.append(",不计免精神损失险");
			}else{
				sb.append("不计免精神损失险");
			}
			if(buJiMianJingShenSunShi>1){
				sb.append("("+buJiMianJingShenSunShi+")");
			}
		}
		if(hcSanFangTeYue>0){
			if(sb.length()>0){
				sb.append(",机动车无法找到三方特约险");
			}else{
				sb.append("机动车无法找到三方特约险");
			}
			if(hcSanFangTeYue>1){
				sb.append("("+hcSanFangTeYue+")");
			}
		}
		if(hcJingShenSunShi>0){
			if(sb.length()>0){
				sb.append(",精神损失险");
			}else{
				sb.append("精神损失险");
			}
			if(hcJingShenSunShi>1){
				sb.append("("+hcJingShenSunShi+")");
			}
		}
		if(hcXiuLiChang>0){
			if(sb.length()>0){
				sb.append(",指定修理厂险("+hcXiuLiChang+")");
			}else{
				sb.append("指定修理厂险("+hcXiuLiChang+")");
			}
		}
		if(hcXiuLiChangType>0){
			if(sb.length()>0){
				sb.append(",指定专修厂类型("+hcXiuLiChang+")");
			}else{
				sb.append("指定专修厂类型("+hcXiuLiChang+")");
			}
		}
		return sb.toString();
	}

}
