package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.GivingInformation;

public interface ApprovalBillMapper {

	int insertApprovalBill(ApprovalBill approvalBill)throws Exception;

	void insertGivingInformation(GivingInformation givingInformation)throws Exception;

	ApprovalBill findInfofromApprovalBill(@Param("chassisNumber")String chassisNumber,@Param("fourSStoreId")Integer fourSStoreId)throws Exception;

	void deleteApprovalBill(@Param("chassisNumber")String chassisNumber,@Param("fourSStoreId")Integer fourSStoreId)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;

	void deleteByStoreId2(Integer storeId)throws Exception;
	
	void deleteByStoreId3(Integer storeId)throws Exception;

	void insertApprovalBill2(ApprovalBill approvalBill)throws Exception;
	
	void updateApprovalBill2(ApprovalBill approvalBill)throws Exception;
	
	List<ApprovalBill> findByCondition(Map<String,Object> map)throws Exception;

	ApprovalBill findByApprovalBillId(@Param("approvalBillId")Integer approvalBillId, @Param("storeId")Integer storeId)throws Exception;
	
	/**
	 * 查询未出单的审批单的明细
	 */
	ApprovalBill findTempApproByApprovalBillId(@Param("approvalBillId")Integer approvalBillId, 
			@Param("storeId")Integer storeId) throws Exception;

	void deleteGivingInformation(@Param("approvalBillId")Integer approvalBillId)throws Exception;

	int findCountByCondition(Map<String, Object> param)throws Exception;

	int deleteForInsuranceBill(@Param("insuranceBillId")Integer insuranceBillId) throws Exception;
	
	List<ApprovalBill> findTempApprByCondition(Map<String,Object> map) throws Exception;
	
	int findTempApprByConditionCount(Map<String, Object> param) throws Exception;
	
	/**
	 * 查询所有没有被迁移数据的审批单记录
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String,Object>> findApprovalRecordAll() throws Exception;
	
	/**
	 * 查询所有没有被迁移数据的审批单临时记录
	 * @param map
	 * @return
	 * @throws Exception
	 */
	List<Map<String,Object>> findApprovalAll() throws Exception;
	
	/**
	 * 修改审批单记录迁移状态 
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int updateApprovalRecord(Map<String, Object> map) throws Exception;
	
	/**
	 * 修改审批单临时记录迁移状态
	 * @param map
	 * @return
	 * @throws Exception
	 */
	int updateApproval(Map<String, Object> map) throws Exception;


	/**
	 * 查询该潜客去年的审批单记录（无保单）
	 * @param chassisNumber
	 * @param fourSStoreId
	 * @return
	 */
	List<ApprovalBill> findApprovalRecordList_NoInsurance(@Param("chassisNumber")String chassisNumber,@Param("fourSStoreId") Integer fourSStoreId);
	/**
	 * 查询该潜客去年的审批单记录（有保单）
	 * @param chassisNumber
	 * @param fourSStoreId
	 * @return
	 */
	List<ApprovalBill> findApprovalRecordList_Insurance(@Param("chassisNumber")String chassisNumber,@Param("fourSStoreId") Integer fourSStoreId);
}
