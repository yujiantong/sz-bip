package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.InsuranceType;

public interface InsuranceCompMapper {

	List<InsuranceComp> findInsuranceComp() throws Exception;

	void update(Map<String,Object> param);

	void addInsuranceType(Map<String,Object> param);


	List<Map<String,Object>> findByFourSId(@Param("storeId")Integer storeId)throws Exception;

	int deleteInsuranceComp(Integer fourSId);

	void insertInsuranceComp(Map<String,Object> param);

	List<InsuranceComp> findbyInsuranceCompIds(List<Integer> listFourS);
	
	/**
     * 查询所有保险公司记录
     */
    List<InsuranceComp> selectAll();
    
    /**
     * 新增保险公司记录
     */
    Integer insert(InsuranceComp company);
    
    /**
     * 根据主键删除保险公司
     */
    int deleteByPrimaryKey(@Param("insuranceCompId")Integer insuranceCompId);
    
    /**
     * 修改保险公司险种
     */
    int updateCompanyType(InsuranceComp company);
    
    /**
     * 根据保险公司名称查询保险公司
     */
    InsuranceComp selectByCompanyName(@Param("companyName")String companyName) throws Exception;
    
    /**
     * 根据保险公司id查询保险公司
     */
    InsuranceComp selectByCompanyId(@Param("insuranceCompId")Integer insuranceCompId) throws Exception;
   
}