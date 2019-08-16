package com.bofide.bip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.SendPhoneMessageMapper;
import com.bofide.common.util.DealStringUtil;

@Service(value = "sendPhoneMessageService")
public class SendPhoneMessageService {
	@Resource(name="sendPhoneMessageMapper")
	private SendPhoneMessageMapper sendPhoneMessageMapper;
	@Autowired
	private CustomerService customerService;
	
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	
	//新增短信记录
	public int insert(Map<String,Object> map,Integer principalId,String principal,
			Integer userId,String userName,String nicheng) throws Exception{
		Integer customerId = (Integer) map.get("customerId");
		String content = (String) map.get("content");
		String operation = "发送短信";
		String traceContext = DealStringUtil.dealTraceRecordContent(operation, content, userName);
		String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
		//添加一个跟踪记录
		customerService.addTraceRecord(principalId, principal, customerId, traceContext,lastTraceResult,null,null,userId);
		
		//修改潜客昵称
		if(nicheng!=null&&nicheng.trim().length()>0){
			Map<String, Object> mapCus = new HashMap<>();
			mapCus.put("customerId", (Integer)map.get("customerId"));
			mapCus.put("nicheng", nicheng);
			customerMapper.updateCustomerInfo(mapCus);
			renewalingCustomerMapper.updateRenewalingCustomerInfo(mapCus);
		}
		return sendPhoneMessageMapper.insert(map);
	}
	
	//查询发送过的短信
	public List<Map<String, Object>> findPhoneMessage(Map<String,Object> map) throws Exception{
		return sendPhoneMessageMapper.findPhoneMessage(map);
	}
		
	//查询发送过的短信总数
	public int findPhoneMessageCount(Map<String,Object> map) throws Exception{
		return sendPhoneMessageMapper.findPhoneMessageCount(map);
	}
	
	/**
	 * 单纯的新增短信信息
	 * @param map
	 * @throws Exception
	 */
	public void insertSMS(Map<String,Object> map) throws Exception{
		sendPhoneMessageMapper.insert(map);
	}
	
	/**
	 * 修改是否点击
	 * @param map
	 * @throws Exception
	 */
	public void updateSFDJ(Map<String,Object> map) throws Exception{
		sendPhoneMessageMapper.updateSFDJ(map);
	}
	
	/**
	 * 根据潜客ID查询是否已点击
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public int findPhoneBySFDJCount(Map<String,Object> map) throws Exception{
		return sendPhoneMessageMapper.findPhoneBySFDJCount(map);
	}
}
