package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.StatisticMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.User;

/**
 *系统管理服务类
 *
 */
@Service(value = "statisticService")
public class StatisticService {
	
	@Resource(name = "statisticMapper")
	private StatisticMapper statisticMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	
	/**
	 * 统计保险信息
	 * @param map 
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findInsuranceStatistics(Map<String, Object> map) throws Exception{
		List<Map<String, Object>> list = statisticMapper.findInsuranceStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 2);
			int billCount = statisticMapper.findBillCount(map);
			statisticMap.put("billCount", billCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
			int allCustomer = statisticMapper.findAllCustomer(map);
			statisticMap.put("allCustomer", allCustomer);
			statisticMap.put("roleId", 2);
			//保险界面的跟踪次数有误，现在通过另一种方式查出来，将原来的traceCount（将StatisticMapper.xml里面的"findInsuranceStatistics"）
			//方法的traceCount改为traceCounts(不需要用它)）字段删除，加一个新的traceCount
			//2019-04-17出现新的问题，先还原，不知道到底是次数，还是跟踪潜客数
			//int traceCount = statisticMapper.findTrceCount(map);
			//statisticMap.put("traceCount", traceCount);
		}
		return list;
	}	
	
	/**
	 * 统计售后信息
	 * @param map 
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findServiceStatistics(Map<String, Object> map) throws Exception{
		List<Map<String, Object>> list = statisticMapper.findServiceStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 8);
			int billCount = statisticMapper.findBillCount(map);
			statisticMap.put("billCount", billCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
			int allCustomer = statisticMapper.findAllCustomer(map);
			statisticMap.put("allCustomer", allCustomer);
			statisticMap.put("roleId", 8);
		}
		return list;
	}	
	
	/**
	 * 统计销售信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findSaleStatistics(Map<String, Object> map) throws Exception{
		List<Map<String, Object>> list = statisticMapper.findSaleStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 6);
			int allCustomer = statisticMapper.findAllCustomer(map);
			statisticMap.put("allCustomer", allCustomer);
			map.put("coverType", 1);
			int newBillCount = statisticMapper.findBillCount(map);
			statisticMap.put("newBillCount", newBillCount);
			map.put("coverType", 2);
			int newToContinueBillCount = statisticMapper.findBillCount(map);
			statisticMap.put("newToContinueBillCount", newToContinueBillCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
			statisticMap.put("roleId", 6);
		}
		return list;
	}	
	
	/**
	 * 续保专员统计保险信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findRCInsuranceStatistics(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> list = statisticMapper.findRCInsuranceStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 2);
			int billCount = statisticMapper.findBillCount(map);//出单
			statisticMap.put("billCount", billCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);//当期潜客
			statisticMap.put("monthCustomer", monthCustomer);
			int allCustomer = statisticMapper.findAllCustomer(map);//全部潜客
			statisticMap.put("allCustomer", allCustomer);
		}
		return list;
	}
	
	/**
	 * 服务顾问统计售后信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findSAServiceStatistics(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> list = statisticMapper.findSAServiceStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 8);
			int billCount = statisticMapper.findBillCount(map);
			statisticMap.put("billCount", billCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
			int allCustomer = statisticMapper.findAllCustomer(map);
			statisticMap.put("allCustomer", allCustomer);
		}
		return list;
	}
	
	/**
	 * 销售顾问统计销售信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findSCSaleStatistics(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> list = statisticMapper.findSCSaleStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			map.put("roleId", 6);
			int allCustomer = statisticMapper.findAllCustomer(map);
			statisticMap.put("allCustomer", allCustomer);
			map.put("coverType", 1);
			int newBillCount = statisticMapper.findBillCount(map);
			statisticMap.put("newBillCount", newBillCount);
			map.put("coverType", 2);
			int newToContinueBillCount = statisticMapper.findBillCount(map);
			statisticMap.put("newToContinueBillCount", newToContinueBillCount);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
		}
		return list;
	}
	
	/**
	 * 统计客服信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findCSCStatistics(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> list = statisticMapper.findCSCStatistics(map);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> statisticMap = list.get(i);
			Integer userId = (Integer) statisticMap.get("userId");
			map.put("userId", userId);
			int monthCustomer = statisticMapper.findMonthCustomer(map);
			statisticMap.put("monthCustomer", monthCustomer);
			statisticMap.put("roleId", 5);
		}
		return list;
	}
	
	/**
	 * 客服专员的客服信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public Map<String, Object> findCSCUserStatistics(Map<String, Object> map) throws Exception {
		Map<String, Object> resMap = statisticMapper.findCSCUserStatistics(map);
		int monthCustomer = statisticMapper.findMonthCustomer(map);
		resMap.put("monthCustomer", monthCustomer);
		return resMap;
	}
	
	/**
	 * 统计出单员信息
	 * @param map
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findIWStatistics(Map<String, Object> map) throws Exception {
		
		Integer storeId = (Integer)map.get("storeId");
		//根据店的id查询所有的出单员
		Integer roleId = RoleType.CDY;
		List<User> userList = userMapper.findUsersByStoreIdAndRoleId(storeId, roleId);
		List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
		for(User user : userList){
			Integer userId = user.getId();
			String userName = user.getUserName();
			map.put("userId", userId);
			//根据该店所有出单员统计出单数（包含交强险保单+商业险保单）
			Integer entryInranceNum = statisticMapper.countEntryInranceNumById(map);
			//根据该店所有出单员统计报价数
			Integer quotedPriceNum = statisticMapper.countQuotedPriceNumById(map);
			Map<String,Object> resultMap = new HashMap<String,Object>();
			resultMap.put("userId", userId);
			resultMap.put("userName", userName);
			resultMap.put("entryInranceNum", entryInranceNum);
			resultMap.put("quotedPriceNum", quotedPriceNum);
			listMap.add(resultMap);
		}
		return listMap;
	}
	
	/**
	 * 根据不同状态统计所有工作人员的该状态的潜客数量
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> countAllWorkNumByStatus(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.countAllWorkNumByStatus(param);
		return listMap;
	}
	
	/**
	 * 根据传递过来的list结果统计总数并组织成map数据结构
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Map<String,Object> formatDataForMap(List<Map<String,Object>> list) throws Exception {
		int allCustomerNum = 0;
		Map <String,Object> sumMap = new HashMap<String,Object>();
		for(Map<String,Object> map : list){
			Long customerNumL = (Long)map.get("customerNum");
			int customerNum = customerNumL.intValue();
			allCustomerNum += customerNum;
		}
		sumMap.put("allCustomerNum", allCustomerNum);
		sumMap.put("workCollection", list);
		return sumMap;
	}

	/**
	 * 统计所有工作人员的今日邀约数量
	 * JRYY:今日邀约
	 */
	public List<Map<String,Object>> countJRYYWorkerCollection(Map<String, Object> param) {
		List<Map<String,Object>> listMap = statisticMapper.countWorkJRYYNum(param);
		return listMap;
	}
	
	/**
	 * 查询到店未出单员工列表
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Map<String,Object> findDDWCDWorkCollection(Map<String,Object> param) throws Exception{
		int allCustomerNum = 0;
		Map <String,Object> sumMap = new HashMap<String,Object>();
		List<Map<String,Object>> listMap = statisticMapper.findDDWCDWorkCollection(param);
		for(Map<String,Object> map : listMap){
			Long customerNumL = (Long)map.get("customerNum");
			int customerNum = customerNumL.intValue();
			allCustomerNum += customerNum;
		}
		sumMap.put("allCustomerNum", allCustomerNum);
		sumMap.put("workCollection", listMap);
		return sumMap;
	}
	
	/**
	 * 查询到店未出单潜客列表
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> findDDWCDCustomer(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.findDDWCDCustomer(param);
		return listMap;
	}
	
	/**
	 * 查询到店未出单潜客列表的总记录数
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Integer findDDWCDCustomerCount(Map<String,Object> param) throws Exception{
		return statisticMapper.findDDWCDCustomerCount(param);
	}
	
	/**
	 * 查询已激活潜客列表
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> findByJiHuoMap(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.findByJiHuoMap(param);
		return listMap;
	}
	
	/**
	 * 查询已激活潜客列表的总记录数
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Integer findByJiHuocount(Map<String,Object> param) throws Exception{
		return statisticMapper.findByJiHuocount(param);
	}
	
	/**
	 * 可删除邀约
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> selectKSCYY(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.selectKSCYY(param);
		return listMap;
	}
	
	/**
	 * 查询跟踪完成员工列表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> findGZWCWorkCollection(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.findGZWCWorkCollection(param);
		return listMap;
	}
	
	/**
	 * 查询已回退员工列表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> findYHTWorkCollection(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.findYHTWorkCollection(param);
		return listMap;
	}
	
	/**
	 * 查询战败线索员工列表
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> findZBXSWorkCollection(Map<String,Object> param) throws Exception{
		List<Map<String,Object>> listMap = statisticMapper.findZBXSWorkCollection(param);
		return listMap;
	}
}
