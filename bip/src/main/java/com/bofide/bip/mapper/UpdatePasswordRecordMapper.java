package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.UpdatePasswordRecord;

public interface UpdatePasswordRecordMapper {
	
	Integer insert(Map<String, Object> map) throws Exception;

	List<UpdatePasswordRecord> findByStoreAndTime(Map<String, Object> map) throws Exception;
	
	UpdatePasswordRecord findLatestRecordByStore(Map<String, Object> map) throws Exception;

}
