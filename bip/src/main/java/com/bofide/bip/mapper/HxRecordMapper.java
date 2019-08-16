package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

public interface HxRecordMapper {
	/**
	 * 新增核销记录
	 * @param param
	 * @return
	 * @throws Exception
	 */
	int insert(Map<String, Object> param) throws Exception;
	
	/**
	 * 查询核销记录
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findAllHxRecordByApprovalBillId(Map<String, Object> param) throws Exception;
	
}
