package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.PushMaintenanceChildMapper;
import com.bofide.bip.mapper.PushMaintenanceMapper;
import com.bofide.bip.po.PushMaintenance;

@Service(value = "pushMaintenanceService")
public class PushMaintenanceService {
	private static Logger logger = Logger.getLogger(PushMaintenanceService.class);

	@Resource(name = "pushMaintenanceMapper")
	private PushMaintenanceMapper pushMaintenanceMapper;
	@Resource(name = "pushMaintenanceChildMapper")
	private PushMaintenanceChildMapper pushMaintenanceChildMapper;
	
	/**
	 * 新增一条推送修记录
	 * @param map
	 * @throws Exception
	 */
	public void insert(Map<String,Object> map) throws Exception{
		String chassisNumber = map.get("chassisNumber")==null ? "" : map.get("chassisNumber").toString();
		map.put("chassisNumber", chassisNumber.toUpperCase());
		pushMaintenanceMapper.insert(map);
		pushMaintenanceChildMapper.insert(map);
	}
	
	/**
	 * 推送修记录导入
	 * @throws Exception 
	 */
	public void saveImportPushMaintenance(List<Map<String, Object>> pushList) throws Exception {
		for(int i=0;i<pushList.size();i++){
			Map<String, Object> pushRecord = pushList.get(i);
			Integer storeId = (Integer) pushRecord.get("storeId");
			String reportNumber = (String) pushRecord.get("reportNumber");
			String chassisNumber = pushRecord.get("chassisNumber")==null ? "" : pushRecord.get("chassisNumber").toString();
			pushRecord.put("chassisNumber", chassisNumber.toUpperCase());
			
			PushMaintenance pushMaintenance = pushMaintenanceMapper.findByReportNumber(pushRecord);
			if(pushMaintenance == null){
				pushMaintenanceMapper.insert(pushRecord);
				pushMaintenanceChildMapper.insert(pushRecord);
			}else{
				logger.info("报案号为"+reportNumber+"的推送修记录已经存在店ID为"+storeId+"的4S店,跳过导入");
			}
		}
	}
	
	/**
	 * 根据条件查询推送修记录
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<PushMaintenance> findByCondition(Map<String, Object> map) throws Exception {
		List<PushMaintenance> lists = pushMaintenanceMapper.findByCondition(map);
		return lists;
	}
	
	/**
	 * 根据条件查询推送修记录数
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int countByCondition(Map<String,Object> map) throws Exception {
		int count = pushMaintenanceMapper.countByCondition(map);
		return count;
	}
	
	/**
	 * 根据报案号以及店ID查询推送修记录的明细
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public PushMaintenance findPMaintenanceByRNumber(Map<String, Object> map) throws Exception {
		PushMaintenance pushMaintenance = pushMaintenanceMapper.findPMaintenanceByRNumber(map);
		return pushMaintenance;
	}
	
	/**
	 * 台帐推送修查询
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findTzPushMaintenance(Map<String, Object> map) throws Exception {
		return pushMaintenanceMapper.findTzPushMaintenance(map);
	}
	
	/**
	 * 台帐查询推送修维修总收入和总记录数
	 * @param map
	 * @return 
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> findTzMaintainCountAndCostSum(Map<String, Object> map) throws Exception {
		return pushMaintenanceMapper.findTzMaintainCountAndCostSum(map);
	}
}
