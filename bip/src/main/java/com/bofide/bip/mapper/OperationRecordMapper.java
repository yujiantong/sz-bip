package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.OperationRecord;

public interface OperationRecordMapper {

	int insert(Map<String,Object> map) throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;

	Integer findDqqks(Map<String, Object> param)throws Exception;

	List<OperationRecord> findOperationRecord(Map<String, Object> param)throws Exception;

	List<OperationRecord> findOperationRecord2(Map<String, Object> param)throws Exception;

	void update(Map<String, Object> param)throws Exception;

	void update2(List<Map<String, Object>> paramList)throws Exception;

}
