package com.bofide.bip.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.common.po.CoverType;
import com.bofide.bip.po.InsuranceBill;

public interface CommonMapper {
    /**
     * 查询所有承保类型
     */
    List<CoverType> findAllCoverType();

    /**
     * 根据投保类型查询投保类型id
     */
    int findCoverTypeByName(@Param("coverTypeName")String coverTypeName);
    
    /**
     * 根据投保类型id查询投保类型
     */
    String findCoverTypeNameById(@Param("coverType")Integer coverType);

	List<CoverType> findCoverTypeNoNewInsur()throws Exception;
    
}