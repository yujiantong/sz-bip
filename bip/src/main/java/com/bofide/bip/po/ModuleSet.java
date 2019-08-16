package com.bofide.bip.po;

public class ModuleSet {
	
	 /**
     * id
     */
    private Integer moduleSetId;

    /**
     * 4s店id
     */
    private Integer fourSStoreId;

    /**
     * 模块名称
     */
    private String moduleName;
    
    /**
     * 状态 0:开启,1:关闭
     */
    private Integer switchOn;

	public Integer getFourSStoreId() {
		return fourSStoreId;
	}

	public void setFourSStoreId(Integer fourSStoreId) {
		this.fourSStoreId = fourSStoreId;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public Integer getSwitchOn() {
		return switchOn;
	}

	public void setSwitchOn(Integer switchOn) {
		this.switchOn = switchOn;
	}

	public Integer getModuleSetId() {
		return moduleSetId;
	}

	public void setModuleSetId(Integer moduleSetId) {
		this.moduleSetId = moduleSetId;
	}
    
    

}
