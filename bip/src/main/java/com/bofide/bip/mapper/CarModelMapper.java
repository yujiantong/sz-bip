package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import com.bofide.bip.po.CarModel;

public interface CarModelMapper {
	
	/**
     * 查询某品牌所有汽车型号记录
     */
    List<Map> selectByBrandId(@Param("brandId")Integer brandId) throws Exception;
    
    /**
     * 新增汽车型号记录
     */
    Integer insert(CarModel carModel) throws Exception;
    
    /**
     * 根据汽车品牌id删除汽车型号
     */
    int deleteByBrandId(@Param("brandId")Integer brandId) throws Exception;
    
    /**
     * 根据主键删除汽车型号
     */
    int deleteByPrimaryKey(@Param("modelId")Integer modelId) throws Exception;
    
    /**
     * 查询某品牌所有汽车型号记录(返回结果不同)
     */
    List<CarModel> findByBrandId(@Param("brandId")Integer brandId) throws Exception;

}
