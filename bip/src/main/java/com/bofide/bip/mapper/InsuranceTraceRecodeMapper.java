package com.bofide.bip.mapper;

import java.util.List;

import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.InsuranceTraceRecode;

public interface InsuranceTraceRecodeMapper {

	List<InsuranceTraceRecode> findRecode(Integer insuranceId);
	
	/**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(InsuranceTraceRecode record);

	void deleteByStoreId(Integer storeId)throws Exception;
	
	/**
     * 根据保单id删除记录
     */
    int deleteByInsuranceBillId(Integer insuranceBillId);

}