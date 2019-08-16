package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.MaintenanceItem;

public interface MaintenanceItemMapper {
	
	void insert(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据施工单号和维修项目查询工时记录
	 */
	MaintenanceItem findByMaintenanceNumAndItem(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据施工单号和店ID查询维修项目
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findByMaintainNumber(Map<String, Object> param) throws Exception;
}
