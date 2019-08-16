package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.Bloc;

public interface BlocMapper {

	
	List<Bloc> findByCondition(Map<String, Object> param)throws Exception;

	void insert(Bloc bloc)throws Exception;
	
	void updateSelectiveById(Map<String, Object> param)throws Exception;

	List<Bloc> findExistByCondition(Map<String, Object> param)throws Exception;
}
