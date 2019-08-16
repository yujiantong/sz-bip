package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.SmsTemplate;

public interface SmsTemplateMapper {
	
	void insert(Map<String,Object> map) throws Exception;
	
	List<Map<String, Object>> findByStoreId(Map<String, Object> param) throws Exception;
	
	void updateById(Map<String,Object> map) throws Exception;
	
	Map<String, Object> findById(@Param("id")Integer id) throws Exception;
	
	/**
	 * 根据店ID查询启用状态是1的模板
	 * @param map
	 * @return
	 * @throws Exception
	 */
	SmsTemplate findByStoreIdAndState(Map<String,Object> map) throws Exception;
	
	int findEnableCount(@Param("storeId")Integer storeId) throws Exception;
}
