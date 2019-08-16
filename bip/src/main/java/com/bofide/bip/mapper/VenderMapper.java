package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Vender;

public interface VenderMapper {
	/**
	 * 新增厂家
	 * @param vender
	 * @return
	 * @throws Exception
	 */
	int insert(Vender vender) throws Exception;
	
	/**
	 * 修改厂家
	 * @param vender
	 * @throws Exception
	 */
	void update(Vender vender) throws Exception;
	
	/**
	 * 按条件查询厂家
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findVenderByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据厂家名字查询厂家
	 * @param venderName
	 * @return
	 * @throws Exception
	 */
	Vender selectByVenderName(@Param("venderName")String venderName) throws Exception;
}
