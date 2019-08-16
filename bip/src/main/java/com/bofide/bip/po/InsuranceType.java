package com.bofide.bip.po;

import java.util.Date;

/**
 * 险种实体bean
 *
 */
public class InsuranceType {
	
	/**
     * 险种id
     */
    private Integer typeId;

    /**
     * 险种名称
     */
    private String typeName;
    
    /**
     * 创建时间
     */
    private Date createDate;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 是否有保额，0表示否，1表示是
     */
    private Integer status;
    
    /**
     * 是否禁用，0表示否，1表示是
     */
    private Integer deleted;

	public Integer getTypeId() {
		return typeId;
	}

	public void setTypeId(Integer typeId) {
		this.typeId = typeId;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
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

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getDeleted() {
		return deleted;
	}

	public void setDeleted(Integer deleted) {
		this.deleted = deleted;
	}
    
    

}
