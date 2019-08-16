package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.MaintenancePartMapper;
import com.bofide.bip.po.MaintenancePart;

@Service(value = "maintenancePartService")
public class MaintenancePartService {
	private static Logger logger = Logger.getLogger(MaintenancePartService.class);

	@Resource(name = "maintenancePartMapper")
	private MaintenancePartMapper maintenancePartMapper;
	
	/**
	 * 根据施工单号和店ID查询维修配件
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findByMaintainNumber(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = maintenancePartMapper.findByMaintainNumber(map);
		return lists;
	}
	
	/**
	 * 维修配件记录导入
	 */
	public List<Map<String, Object>> saveImportMaintenancePart(List<Map<String, Object>> partList) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<partList.size();i++){
			Map<String, Object> part = partList.get(i);
			Integer storeId = (Integer) part.get("storeId");
			String maintainNumber = (String) part.get("maintainNumber");
			String partName = (String) part.get("partName");
			try {
				MaintenancePart maintenancePart = maintenancePartMapper.findByMaintenanceNumAndPart(part);
				if(maintenancePart == null){
					maintenancePartMapper.insert(part);
				}else{
					logger.info("施工单号为"+maintainNumber+"和配件名称为"+ partName +"的配件记录已经存在店ID为" + storeId +"的4S店,跳过导入");
				}
			} catch (Exception e) {
				logger.error("导入失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorRow", part.get("rowNumber"));
				errorMap.put("errorString", "数据异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
}
