package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.TraceDaySet;

public interface TraceDaySetMapper {
	
	 /**
     * 根据4s店id查询记录
     */
    List<TraceDaySet> selectByFoursStoreId(Integer fourSStoreId);
    
    /**
     * 根据4s店id和模块名称更新记录
     */
    int updateByFoursIdAndCuLevel(TraceDaySet traceDaySet);
    
    /**
     * 保存记录
     */
    int insert(TraceDaySet traceDaySet);
    //查询所有客户级别为Z的店的设置天数
	List<TraceDaySet> findTraceDaySet()throws Exception;

	TraceDaySet findTraceTimeByCl(Map<String, Object> param)throws Exception;

	//查询一个店的首次提醒天数
	TraceDaySet findTraceDaySetSouCiCount(Integer fourSStoreId);

}
