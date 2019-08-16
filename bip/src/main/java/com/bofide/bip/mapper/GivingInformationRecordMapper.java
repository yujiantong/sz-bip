package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.GivingInformation;

public interface GivingInformationRecordMapper {
	/**
	 * 添加赠送记录
	 * */
	int insertGivingInformationRecord(GivingInformation givingInformation) throws Exception;
	
	/**
	 * 店初始化数据时,删除赠送记录
	 * */
	void deleteByStoreId(Integer storeId) throws Exception;
	
	/**
	 * 删除保单时,删除赠送记录
	 * */
	void deleteForInsuranceBill(@Param("insuranceBillId")Integer insuranceBillId) throws Exception;
	
	/**
	 * 根据条件查询赠送信息相关联的保单信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findGivingByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据条件查询赠送信息相关联的保单信息统计
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int countGivingByCondition(Map<String,Object> map) throws Exception;
	
	/**
	 * 根据审批单ID查询赠送信息
	 * @param approvalBillId
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findGivingByApprovalBillId(@Param("approvalBillId")Integer approvalBillId) throws Exception;
	/**
	 * 根据审批单IDs查询赠送信息
	 * @param approvalBillId
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findGivingByApprovalBillIds(@Param("approvalBillIds")List<Integer> approvalBillIds) throws Exception;
	
	/**
	 * 修改赠送信息
	 * @param map
	 * @throws Exception
	 */
	void updateGiving(Map<String,Object> map) throws Exception;
	
	/**
	 * 查询赠送总金额
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Double sumAmountMoney(Map<String, Object> param) throws Exception;
}
