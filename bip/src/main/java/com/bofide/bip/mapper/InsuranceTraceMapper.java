package com.bofide.bip.mapper;

import java.util.List;

import com.bofide.bip.po.InsuranceTrace;

public interface InsuranceTraceMapper {
    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer insurancetraceid);

    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(InsuranceTrace record);

    /**
     * 保存属性不为空的记录
     */
    int insertSelective(InsuranceTrace record);

    /**
     * 根据主键查询记录
     */
    InsuranceTrace selectByPrimaryKey(Integer insurancetraceid);

    /**
     * 根据主键更新属性不为空的记录
     */
    int updateByPrimaryKeySelective(InsuranceTrace record);

    /**
     * 根据主键更新记录
     */
    int updateByPrimaryKey(InsuranceTrace record);
    /**
     * 根据保单的id查询出对应的跟踪统计记录
     * @param insuranceBillId
     * @return
     */
	List<InsuranceTrace> findInsuranceTrace(Integer insuranceBillId) throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;
	
	/**
     * 根据保单id删除记录
     */
    int deleteByInsuranceBillId(Integer insuranceBillId);

}