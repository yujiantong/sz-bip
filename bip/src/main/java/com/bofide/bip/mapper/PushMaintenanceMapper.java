package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.PushMaintenance;

public interface PushMaintenanceMapper {
	
	/**
	 * 新增一条推送修记录
	 * @param map
	 * @throws Exception
	 */
	void insert(Map<String,Object> map) throws Exception;
	
	PushMaintenance findByReportNumber(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据条件查询推送修记录
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<PushMaintenance> findByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据条件查询推送修记录数
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int countByCondition(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据报案号以及店ID查询推送修记录的明细
	 * @param param
	 * @return
	 * @throws Exception
	 */
	PushMaintenance findPMaintenanceByRNumber(Map<String, Object> param) throws Exception;
	
	/**
	 * 台帐推送修查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findTzPushMaintenance(Map<String, Object> param) throws Exception;
	
	/**
	 * 台帐查询推送修维修总收入和总记录数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> findTzMaintainCountAndCostSum(Map<String, Object> param) throws Exception;
}
