package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.CustomerUpdate;

public interface CustomerUpdateMapper {
	/**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer id) throws Exception;

    /**
     * 保存记录
     */
    int insert(CustomerUpdate customerUpdate) throws Exception;
    
    /**
     * 查询记录
     */
    List<CustomerUpdate> select(Map<String, Object> param) throws Exception;
}
