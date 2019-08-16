package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.InsuType;

public interface InsuTypeMapper {
	
	/**
     * 根据条件查询保单或审批单的险种信息
     */
    List<InsuType> selectByCondition(Map<String, Object> map) throws Exception;
    
    /**
     * 新增保单或审批单的险种信息
     */
    Integer insert(InsuType insuType) throws Exception;
    
    /**
     * 根据条件删除保单或审批单的险种信息
     */
    int deleteByInsuIdAndType(Map<String, Object> map) throws Exception;
}
