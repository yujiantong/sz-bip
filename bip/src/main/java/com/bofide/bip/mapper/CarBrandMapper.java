package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.CarBrand;

public interface CarBrandMapper {
	/**
     * 查询所有汽车品牌记录
     */
    List<CarBrand> selectAll(Map<String, Object> map) throws Exception;
    
    /**
     * 新增汽车品牌记录
     */
    Integer insert(CarBrand carBrand) throws Exception;
    
    /**
     * 根据主键删除汽车品牌
     */
    int deleteByPrimaryKey(@Param("brandId")Integer brandId) throws Exception;
    
    /**
     * 根据汽车品牌名称查询记录
     */
    CarBrand selectByBrandName(@Param("brandName")String brandName) throws Exception;
    
    /**
     * 修改汽车品牌记录
     */
    int updateCarBrand(CarBrand carBrand) throws Exception;
    
    /**
     * 按品牌名称首字母大小排序查询所有品牌
     */
    List<CarBrand> selectAllByOrder(Map<String, Object> map) throws Exception;
    
}
