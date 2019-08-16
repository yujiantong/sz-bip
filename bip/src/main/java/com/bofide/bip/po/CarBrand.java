package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

/**
 * 汽车品牌实体bean
 *
 */
public class CarBrand {
	
	/**
     * 品牌id
     */
    private Integer brandId;

    /**
     * 品牌名称
     */
    private String brandName;
    
    /**
     * 型号集合
     */
    private List<CarModel> carModelList;
    
    /**
     * 创建时间
     */
    private Date createDate;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 品牌英文
     */
    private String brandEnglish;
    
    /**
     * 厂家ID
     */
    private Integer venderId;
    
    /**
     * 厂家实例
     */
    private Vender vender;

	public Integer getBrandId() {
		return brandId;
	}

	public void setBrandId(Integer brandId) {
		this.brandId = brandId;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public List<CarModel> getCarModelList() {
		return carModelList;
	}

	public void setCarModelList(List<CarModel> carModelList) {
		this.carModelList = carModelList;
	}

	public String getBrandEnglish() {
		return brandEnglish;
	}

	public void setBrandEnglish(String brandEnglish) {
		this.brandEnglish = brandEnglish;
	}

	public Integer getVenderId() {
		return venderId;
	}

	public void setVenderId(Integer venderId) {
		this.venderId = venderId;
	}

	public Vender getVender() {
		return vender;
	}

	public void setVender(Vender vender) {
		this.vender = vender;
	}
    
    

}
