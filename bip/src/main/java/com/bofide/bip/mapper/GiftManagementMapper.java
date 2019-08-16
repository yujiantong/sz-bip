package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.GiftManagement;

public interface GiftManagementMapper {
	/**
	 * 添加赠品表信息
	 * */
	int insertGiftManagement(GiftManagement giftManagement) throws Exception;
	
	/**
	 * 根据不同条件查询赠品
	 * */
	List<GiftManagement> findGiftByCondition(Map<String, Object> param) throws Exception;
	/**
	 * 根据赠品编码查询赠品
	 * */
	GiftManagement findGiftByCode(Map<String, Object> param) throws Exception;
	
	/**
	 * 修改赠品
	 * */
	void updateGiftByCode(Map<String, Object> param) throws Exception;
	
	/**
	 * 修改赠品
	 * */
	void updateGiftById(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据赠品编码或者名称自动联想查询赠品
	 * */
	List<GiftManagement> findGiftByCodeOrName(Map<String, Object> param) throws Exception;
	
}
