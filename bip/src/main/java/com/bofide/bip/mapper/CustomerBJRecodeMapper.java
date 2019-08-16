package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.CustomerBJRecode;

public interface CustomerBJRecodeMapper {

	/**
	 * 新增报价信息记录
	 * @param customerBJRecode  报价PO
	 * @return
	 * @throws Exception
	 */
	int insertCustomerBJRecode(CustomerBJRecode customerBJRecode)throws Exception;

	/**
	 * 按潜客ID查询该潜客所有的报价信息
	 * 
	 * @param customerId  潜客Id
	 * @return
	 * @throws Exception
	 */
	List<CustomerBJRecode> findListCustomerBJRecode(@Param("customerId")Integer customerId)throws Exception;

	/**
	 * 按潜客ID删除该潜客的报价信息
	 * 
	 * @param customerId 潜客Id
	 * @return
	 * @throws Exception
	 */
	int deleteCustomerBJRecodeByCustomerId(@Param("customerId")Integer customerId)throws Exception;
	
	/**
	 * 按报价ID删除报价信息
	 * 
	 * @param bjId
	 * @return
	 * @throws Exception
	 */
	int deleteCustomerBJRecodeById(@Param("bjId")Integer bjId)throws Exception;

	/**
	 * 按4S店删除该店的所有报价信息
	 * 
	 * @param storeId 4S店ID
	 * @return
	 * @throws Exception
	 */
	int deleteByStoreId(Integer storeId)throws Exception;
	
	/**
	 * 根据customerId和dcbjrq查询报价信息
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<CustomerBJRecode> findBJListByCustomerId(Map<String, Object> map)throws Exception;

}
