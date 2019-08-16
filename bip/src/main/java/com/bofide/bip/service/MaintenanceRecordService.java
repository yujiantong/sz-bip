package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.MaintenanceRecordMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.MaintenanceRecord;
import com.bofide.bip.po.User;

@Service(value = "maintenanceRecordService")
public class MaintenanceRecordService {
	private static Logger logger = Logger.getLogger(MaintenanceRecordService.class);
	
	@Resource(name = "maintenanceRecordMapper")
	private MaintenanceRecordMapper maintenanceRecordMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	
	/**
	 * 维修记录导入
	 */
	public List<Map<String, Object>> saveImportMaintenanceRecord(List<Map<String, Object>> recordList) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<recordList.size();i++){
			Map<String, Object> record = recordList.get(i);
			Integer storeId = (Integer) record.get("storeId");
			String consultantName = (String) record.get("consultantName");
			String maintainNumber = (String) record.get("maintainNumber");
			try {
				//查询服务顾问id
				List<User> list = userMapper.findUserIdByUserName(storeId,consultantName,RoleType.FWGW);
				Integer consultantId = null;
				if(list.size() > 0){
					Random r = new Random();
					User user = list.get(r.nextInt(list.size()));
					Integer id = user.getId();
					consultantId = id;
				}
				record.put("consultantId", consultantId);
				
				MaintenanceRecord maintenanceRecord = maintenanceRecordMapper.findByMaintainNumber(record);
				if(maintenanceRecord == null){
					if(record.get("reportNumber")!=null){
						String reportNumber = (String) record.get("reportNumber");
						MaintenanceRecord maintenanceRecord1 = maintenanceRecordMapper.findByReportNumber(record);
						if(maintenanceRecord1==null){
							maintenanceRecordMapper.insert(record);
						}else{
							logger.info("报案号为: "+reportNumber+" 的维修记录已经存在店ID为: " + storeId +"的4S店,跳过导入");
						}
					}else{
						maintenanceRecordMapper.insert(record);
					}
				}else{
					logger.info("施工单号为: "+maintainNumber+" 的维修记录已经存在店ID为: " + storeId +"的4S店,跳过导入");
				}
			} catch (Exception e) {
				logger.error("导入失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorRow", record.get("rowNumber"));
				errorMap.put("errorString", "数据异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
	
	/**
	 * 根据条件查询维修记录
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findByCondition(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = maintenanceRecordMapper.findByCondition(map);
		return lists;
	}
	
	/**
	 * 根据条件查询维修记录的个数
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int countByCondition(Map<String,Object> map) throws Exception {
		int count = maintenanceRecordMapper.countByCondition(map);
		return count;
	}
	
	public MaintenanceRecord findByMaintainNumber(Map<String, Object> map) throws Exception {
		MaintenanceRecord maintenanceRecord = maintenanceRecordMapper.findByMaintainNumber(map);
		return maintenanceRecord;
	}
}
