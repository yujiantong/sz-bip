package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

public interface DefeatCustomerMapper {

	List<Map<String, Object>> findDefeatCustomer(Map<String, Object> map) throws Exception;
	
	Integer countFindDefeatCustomer(Map<String, Object> map) throws Exception;
	
	void saveDefeatCustomer(Map<String, Object> map) throws Exception;
	
	Integer findExistDefeatCustomer(Map<String, Object> map) throws Exception;
	
	/**
	 * 查找需要维护的数据
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findNeedMaintenance(Map<String, Object> map) throws Exception;
	
	/**
	 * 按用户id查询线索列表信息
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findDefeatedSourceByUserId(Map<String, Object> map) throws Exception;
	
	/**
	 * 按用户id查询线索列表总数
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int findCountDefeatedSourceByUserId(Map<String, Object> map) throws Exception;
	
	/**
	 * 根据线索id查询线索
	 * @param map
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> findDefeatedSourceById(Map<String, Object> map) throws Exception;
}
