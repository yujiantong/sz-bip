package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.MaintenancePart;

public interface MaintenancePartMapper {
	
	void insert(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据施工单号和配件名称查询维修配件记录
	 */
	MaintenancePart findByMaintenanceNumAndPart(Map<String,Object> map) throws Exception;

	/**
	 * 根据施工单号和店ID查询维修配件
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findByMaintainNumber(Map<String, Object> param) throws Exception;
}
