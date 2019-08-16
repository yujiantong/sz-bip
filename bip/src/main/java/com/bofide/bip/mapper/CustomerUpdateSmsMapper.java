package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.CustomerUpdateSms;

public interface CustomerUpdateSmsMapper {
	/**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer id) throws Exception;

    /**
     * 保存记录
     */
    void insert(CustomerUpdateSms customerUpdateSms) throws Exception;
    
    /**
     * 查询记录
     */
    List<CustomerUpdateSms> select(Map<String, Object> param) throws Exception;
    
    /**
     * 根据潜客ID删除记录
     */
    int deleteByCustomerId(Integer customerId) throws Exception;
    
    /**
     * 系统定时发送完毕后清空表
     */
    int delete() throws Exception;
}
