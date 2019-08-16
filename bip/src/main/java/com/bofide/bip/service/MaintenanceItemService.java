package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.MaintenanceItemMapper;
import com.bofide.bip.po.MaintenanceItem;


@Service(value = "maintenanceItemService")
public class MaintenanceItemService {
	private static Logger logger = Logger.getLogger(MaintenanceItemService.class);

	@Resource(name = "maintenanceItemMapper")
	private MaintenanceItemMapper maintenanceItemMapper;
	
	/**
	 * 根据施工单号和店ID查询维修项目
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findByMaintainNumber(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = maintenanceItemMapper.findByMaintainNumber(map);
		return lists;
	}
	
	/**
	 * 维修工时记录导入
	 */
	public List<Map<String, Object>> saveImportMaintenanceItem(List<Map<String, Object>> itemList) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<itemList.size();i++){
			Map<String, Object> item = itemList.get(i);
			Integer storeId = (Integer) item.get("storeId");
			String maintainNumber = (String) item.get("maintainNumber");
			String maintenanceItemStr = (String) item.get("maintenanceItem");
			try {
				MaintenanceItem maintenanceItem = maintenanceItemMapper.findByMaintenanceNumAndItem(item);
				if(maintenanceItem == null){
					maintenanceItemMapper.insert(item);
				}else{
					logger.info("施工单号为"+maintainNumber+"和维修项目为"+ maintenanceItemStr +"的工时记录已经存在店ID为" + storeId +"的4S店,跳过导入");
				}
			} catch (Exception e) {
				logger.error("导入失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorRow", item.get("rowNumber"));
				errorMap.put("errorString", "数据异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
}
