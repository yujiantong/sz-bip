package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.ModuleSet;

public interface ModuleSetMapper {
	
	 /**
     * 根据4s店id查询记录
     */
    List<ModuleSet> selectByFoursStoreId(Integer fourSStoreId);
    
    /**
     * 根据4s店id和模块名称更新记录
     */
    int updateByFoursIdAndMoName(ModuleSet moduleSet);
    
    /**
     * 保存记录
     */
    int insert(ModuleSet moduleSet);
    /**
     * 根据4s店id查询已开启模块
     * @param fourSStoreId
     * @return
     */
	List<ModuleSet> findOpenModuleSet(@Param("fourSStoreId")Integer fourSStoreId);
	
	/**
	 * 根据条件查询ModuleSet
	 * @param param
	 * @return
	 */
	List<ModuleSet> selectByCondition(Map<String, Object> param);

}
