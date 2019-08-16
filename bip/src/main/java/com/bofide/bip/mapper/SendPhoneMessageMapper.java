package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

public interface SendPhoneMessageMapper {

	//新增短信记录
	int insert(Map<String, Object> map) throws Exception;
	
	//查询发送过的短信
	List<Map<String, Object>> findPhoneMessage(Map<String, Object> map) throws Exception;
		
	//查询发送过的短信总数
	int findPhoneMessageCount(Map<String, Object> map) throws Exception;
	
	/**
	 * 修改是否点击
	 * @param map
	 * @throws Exception
	 */
	void updateSFDJ(Map<String, Object> map) throws Exception;
	
	/**
	 * 根据潜客ID查询是否已点击
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int findPhoneBySFDJCount(Map<String, Object> map) throws Exception;
}
