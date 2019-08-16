package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import com.bofide.bip.po.InsuranceType;

public interface InsuranceTypeMapper {
	
	/**
     * 查询所有险种记录
     */
    List<InsuranceType> selectAll(Map<String, Object> map) throws Exception;
    
    /**
     * 新增险种记录
     */
    Integer insert(InsuranceType insuranceType) throws Exception;
    
    /**
     * 根据主键删除险种
     */
    int deleteByPrimaryKey(@Param("typeId")Integer typeId) throws Exception;
    
    /**
     * 根据险种名称查询险种
     */
    InsuranceType selectByTypeName(@Param("typeName")String typeName) throws Exception;
    
    /**
     * 根据险种ID查询险种
     * @param typeId
     * @return
     * @throws Exception
     */
    InsuranceType findInsuByTypeId(@Param("typeId")Integer typeId) throws Exception;
    
    /**
     * 修改险种 
     * @param map
     * @return
     * @throws Exception
     */
    Integer updateInsu(Map<String, Object> map) throws Exception;

}
