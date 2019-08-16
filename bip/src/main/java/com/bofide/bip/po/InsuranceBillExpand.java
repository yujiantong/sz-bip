package com.bofide.bip.po;

import java.util.Date;
import java.util.List;

public class InsuranceBillExpand extends InsuranceBill {
	private static final long serialVersionUID = 6952199890431396052L;
	/**
     * 分页开始数
     */
    private Integer start;
    /**
     * 每页数量
     */
    private Integer pageSize;
    //商业险金额查询前
    private Double syxjeStart;
    //商业险金额查询后
    private Double syxjeEnd;
    //角色id
    private Integer roleId;
    
    //投保类型查询条件
    private List<Integer> coverTypes;
    //是否存在潜客
    private Integer notExistCustomer;
    //商业险开始日期
    private Date syxrqStart;
    //商业险结束日期
    private Date syxrqEnd;
    //交强险开始日期
    private Date jqxrqStart;
    //交强险结束日期
    private Date jqxrqEnd;
    
    //按某字段排序
    private Integer shortBd;
    //排序方式
    private Integer shortmainBd;
    
    public Integer getShortBd() {
		return shortBd;
	}

	public void setShortBd(Integer shortBd) {
		this.shortBd = shortBd;
	}
	public Integer getShortmainBd() {
		return shortmainBd;
	}

	public void setShortmainBd(Integer shortmainBd) {
		this.shortmainBd = shortmainBd;
	}
    
	public Date getSyxrqStart() {
		return syxrqStart;
	}

	public void setSyxrqStart(Date syxrqStart) {
		this.syxrqStart = syxrqStart;
	}

	public Date getSyxrqEnd() {
		return syxrqEnd;
	}

	public void setSyxrqEnd(Date syxrqEnd) {
		this.syxrqEnd = syxrqEnd;
	}

	public Date getJqxrqStart() {
		return jqxrqStart;
	}

	public void setJqxrqStart(Date jqxrqStart) {
		this.jqxrqStart = jqxrqStart;
	}

	public Date getJqxrqEnd() {
		return jqxrqEnd;
	}

	public void setJqxrqEnd(Date jqxrqEnd) {
		this.jqxrqEnd = jqxrqEnd;
	}

	public Integer getNotExistCustomer() {
		return notExistCustomer;
	}

	public void setNotExistCustomer(Integer notExistCustomer) {
		this.notExistCustomer = notExistCustomer;
	}

	public List<Integer> getCoverTypes() {
		return coverTypes;
	}

	public void setCoverTypes(List<Integer> coverTypes) {
		this.coverTypes = coverTypes;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public Double getSyxjeStart() {
		return syxjeStart;
	}

	public void setSyxjeStart(Double syxjeStart) {
		this.syxjeStart = syxjeStart;
	}

	public Double getSyxjeEnd() {
		return syxjeEnd;
	}

	public void setSyxjeEnd(Double syxjeEnd) {
		this.syxjeEnd = syxjeEnd;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
    
    

}
