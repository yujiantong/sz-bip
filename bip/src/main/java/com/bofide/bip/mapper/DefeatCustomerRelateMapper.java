package com.bofide.bip.mapper;

import java.util.Map;

public interface DefeatCustomerRelateMapper {

	Integer findExistRelate(Map<String, Object> map) throws Exception;
	
	void saveDefeatCustomerRelate(Map<String, Object> map) throws Exception;
	
	void updateDefeatedRelateState(Map<String, Object> map) throws Exception;
}
