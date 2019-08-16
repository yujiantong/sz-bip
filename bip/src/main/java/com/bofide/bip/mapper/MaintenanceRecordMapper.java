package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.MaintenanceRecord;

public interface MaintenanceRecordMapper {
	
	/**
	 * 根据施工单号和店id查询维修记录
	 */
	MaintenanceRecord findByMaintainNumber(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据报案号和店id查询维修记录
	 */
	MaintenanceRecord findByReportNumber(Map<String,Object> map) throws Exception;
	
	/**
	 * 插入一条维修记录
	 */
	void insert(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据条件查询维修记录
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据条件查询维修记录数
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int countByCondition(Map<String,Object> map) throws Exception;

}
