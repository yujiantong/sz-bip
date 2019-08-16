package com.bofide.bip.service;


import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.ApprovalBillMapper;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.GivingInformation;


@Service(value = "approvalBillService")
public class ApprovalBillService {
	@Resource(name="approvalBillMapper")
	private ApprovalBillMapper approvalBillMapper;
	
	
	/**
	 * 保存审批单
	 * @param approvalBill
	 * @throws Exception
	 */
	public void insertApprovalBill(ApprovalBill approvalBill) throws Exception {
		approvalBillMapper.insertApprovalBill2(approvalBill);
	}
	/**
	 * 更新审批单
	 * @param approvalBill
	 * @throws Exception
	 */
	public void updateApprovalBill(ApprovalBill approvalBill) throws Exception {
		approvalBillMapper.updateApprovalBill2(approvalBill);
	}
	
	/**
	 * 保存赠送信息
	 * @param approvalBill
	 * @throws Exception
	 */
	public void insertGivingInformations(GivingInformation givingInformation) throws Exception {
		approvalBillMapper.insertGivingInformation(givingInformation);
	}
	
	/**
	 * 根据车架号查询审批单的保险信息和财务信息以及赠送信息
	 * @param chassisNumber
	 * @return
	 * @throws Exception 
	 */
	public ApprovalBill findInfofromApprovalBill(String chassisNumber,Integer fourSStoreId) throws Exception {
		ApprovalBill approvalBill = approvalBillMapper.findInfofromApprovalBill(chassisNumber,fourSStoreId);
		return approvalBill;
	}
	
	/**
	 * 查询条件：车架号，车牌号，联系方式 需要模糊查询
	 */
	public List<ApprovalBill> findByCondition(Map<String,Object> map)throws Exception{
		List<ApprovalBill> list = approvalBillMapper.findByCondition(map);
		return list;
	}
	
	/**
	 * 根据审批单的id查询审批单详情
	 * @throws Exception 
	 */
	public ApprovalBill findByApprovalBillId(Integer approvalBillId,Integer storeId) throws Exception{
		ApprovalBill approvalBill = approvalBillMapper.findByApprovalBillId(approvalBillId,storeId);
		return approvalBill;
	}


	public int findCountByCondition(Map<String, Object> param) throws Exception {
		int approvalBillCount = approvalBillMapper.findCountByCondition(param);
		return approvalBillCount;
	}
	
	/**
	 * 查询条件：车架号，车牌号，联系方式 需要模糊查询
	 */
	public List<ApprovalBill> findTempApprByCondition(Map<String,Object> map)throws Exception{
		List<ApprovalBill> list = approvalBillMapper.findTempApprByCondition(map);
		return list;
	}
	
	public int findTempApprByConditionCount(Map<String, Object> param) throws Exception {
		int approvalBillCount = approvalBillMapper.findTempApprByConditionCount(param);
		return approvalBillCount;
	}
	
	/**
	 * 根据审批单的id查询未出单的审批单详情
	 * @throws Exception 
	 */
	public ApprovalBill findTempApproByApprovalBillId(Integer approvalBillId,Integer storeId) throws Exception{
		ApprovalBill approvalBill = approvalBillMapper.findTempApproByApprovalBillId(approvalBillId,storeId);
		return approvalBill;
	}
	
	/**
	 * 查询所有没有被迁移数据的审批单记录
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> findApprovalRecordAll() throws Exception{
		return approvalBillMapper.findApprovalRecordAll();
	}
	
	/**
	 * 查询所有没有被迁移数据的审批单临时记录
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> findApprovalAll() throws Exception{
		return approvalBillMapper.findApprovalAll();
	}
	
	/**
	 * 修改审批单记录迁移状态 
	 * @param map
	 * @throws Exception
	 */
	public void updateApprovalRecord(Map<String, Object> map) throws Exception{
		approvalBillMapper.updateApprovalRecord(map);
	}
	/**
	 * 修改审批单临时记录迁移状态
	 * @param map
	 * @throws Exception
	 */
	public void updateApproval(Map<String, Object> map) throws Exception{
		approvalBillMapper.updateApproval(map);
	}
	/**
	 * 查询该潜客去年的审批单记录(无保单)
	 * @param chassisNumber
	 * @param fourSStoreId
	 * @return
	 */
	public List<ApprovalBill> findApprovalRecordList_NoInsurance(String chassisNumber, Integer fourSStoreId) {
		return approvalBillMapper.findApprovalRecordList_NoInsurance(chassisNumber,fourSStoreId);
	}
	/**
	 * 查询该潜客去年的审批单记录(有保单)
	 * @param chassisNumber
	 * @param fourSStoreId
	 * @return
	 */
	public List<ApprovalBill> findApprovalRecordList_Insurance(String chassisNumber, Integer fourSStoreId) {
		return approvalBillMapper.findApprovalRecordList_Insurance(chassisNumber,fourSStoreId);
	}
}