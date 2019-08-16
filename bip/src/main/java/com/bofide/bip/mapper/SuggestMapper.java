package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Suggest;

public interface SuggestMapper {
	/**
     * 根据ID查询
     */
    Suggest selectSuggestById(Integer id) throws Exception;
	/**
     * 查询所有店铺名称
     */
    List<String> selectAllStoreName() throws Exception;
	/**
     * 查询所有记录
     */
    List<Suggest> selectAllSuggest(Map<String, Object> map) throws Exception;
    /**
     * 查询所有记录的个数
     */
    Integer countAllSuggest(Map<String, Object> map) throws Exception;
    
    /**
     * 新增建议记录
     */
    void insertSuggest(Suggest suggest) throws Exception;
    /**
     * 修改建议记录的处理状态
     */
    void updateSuggest(Suggest suggest) throws Exception;
    
    /**
     * 查询自己提的建议
     */
    public List<Suggest> findAllSuggestByUserId(Map<String,Object> map);
    
    /**
     * 查询自己提的建议的数目
     */
    public int findAllSuggestByUserIdCount(Map<String,Object> map);
}
