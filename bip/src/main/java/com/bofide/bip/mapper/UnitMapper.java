package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Unit;

public interface UnitMapper {
	
	/**
	 * 新增事业部门
	 * @param vender
	 * @return
	 * @throws Exception
	 */
	int insert(Unit Unit) throws Exception;
	
	/**
	 * 按条件查询事业部门
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Unit> findUnitByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据事业部门名字和集团ID查询事业部门
	 * @param unitName
	 * @param jtId
	 * @return
	 * @throws Exception
	 */
	Unit selectByUnitName(@Param("unitName")String unitName,@Param("jtId")Integer jtId) throws Exception;
}
