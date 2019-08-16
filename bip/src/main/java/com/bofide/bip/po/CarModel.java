package com.bofide.bip.po;

import java.util.Date;

/**
 * 汽车型号实体bean
 *
 */
public class CarModel {
	
	/**
     * 型号id
     */
    private Integer modelId;

    /**
     * 型号名称
     */
    private String modelName;
    
    /**
     * 品牌id
     */
    private Integer brandId;
    
    /**
     * 创建时间
     */
    private Date createDate;
    
    /**
     * 备注
     */
    private String remark;

	public Integer getModelId() {
		return modelId;
	}

	public void setModelId(Integer modelId) {
		this.modelId = modelId;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public Integer getBrandId() {
		return brandId;
	}

	public void setBrandId(Integer brandId) {
		this.brandId = brandId;
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
    
    

}
