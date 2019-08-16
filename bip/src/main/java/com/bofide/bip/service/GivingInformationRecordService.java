package com.bofide.bip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.GivingInformationRecordMapper;
import com.bofide.bip.mapper.HxRecordMapper;

@Service(value = "givingInformationRecordService")
public class GivingInformationRecordService {
	@Resource(name = "givingInformationRecordMapper")
	private GivingInformationRecordMapper givingInformationRecordMapper;
	@Resource(name = "hxRecordMapper")
	private HxRecordMapper hxRecordMapper;
	/**
	 * 根据条件查询赠送信息相关联的保单信息
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findGivingByCondition(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = givingInformationRecordMapper.findGivingByCondition(map);
		return lists;
	}
	
	/**
	 * 根据条件查询赠送信息相关联的保单信息统计
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int countGivingByCondition(Map<String,Object> map) throws Exception {
		int count = givingInformationRecordMapper.countGivingByCondition(map);
		return count;
	}
	
	/**
	 * 根据审批单ID查询赠送信息
	 * @param approvalBillId
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findGivingByApprovalBillId(Integer approvalBillId) throws Exception {
		List<Map<String, Object>> lists = givingInformationRecordMapper.findGivingByApprovalBillId(approvalBillId);
		return lists;
	}
	/**
	 * 根据审批单IDs查询赠送信息
	 * @param approvalBillId
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findGivingByApprovalBillIds(List<Integer> approvalBillIds) throws Exception {
		List<Map<String, Object>> lists = givingInformationRecordMapper.findGivingByApprovalBillIds(approvalBillIds);
		return lists;
	}
	
	/**
	 * 修改赠送信息
	 * @param map
	 * @throws Exception
	 */
	public void updateGiving(List<Map<String, Object>> maps,Integer storeId,Integer userId,String userName) throws Exception {
		if(maps!=null&&maps.size()>0){
			for(int i=0;i<maps.size();i++){
				Integer thisUseNum = (Integer)maps.get(i).get("thisUseNum");
				Integer surplusNum = (Integer)maps.get(i).get("surplusNum");
				if(thisUseNum==0){
					continue;
				}
				if(surplusNum-thisUseNum<0){
					throw new RuntimeException();
				}
				maps.get(i).put("surplusNum", surplusNum-thisUseNum);
				givingInformationRecordMapper.updateGiving(maps.get(i));
				//每一条核销的都插入核销记录表
				Map<String,Object> hxMap = new HashMap<>();
				hxMap.put("storeId", storeId);
				hxMap.put("hxrId", userId);
				hxMap.put("hxr", userName);
				hxMap.put("approvalBillId", maps.get(i).get("approvalBillId"));
				hxMap.put("giftCode", maps.get(i).get("giftCode"));
				hxMap.put("giftName", maps.get(i).get("giftName"));
				hxMap.put("giftType", maps.get(i).get("giftType"));
				hxMap.put("amount", maps.get(i).get("amount"));
				hxMap.put("bcxfDetail", maps.get(i).get("bcxfDetail"));
				hxMap.put("surplusNum", maps.get(i).get("surplusNum"));
				hxMap.put("thisUseNum", maps.get(i).get("thisUseNum"));
				hxRecordMapper.insert(hxMap);
			}
		}
	}
	
	/**
	 * 查询赠送总金额
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public Double sumAmountMoney(Map<String, Object> map) throws Exception {
		Double dou = givingInformationRecordMapper.sumAmountMoney(map);
		return dou;
	}
	
	/**
	 * 查询核销记录
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findAllHxRecordByApprovalBillId(Map<String, Object> param) throws Exception {
		return hxRecordMapper.findAllHxRecordByApprovalBillId(param);
	}
}
