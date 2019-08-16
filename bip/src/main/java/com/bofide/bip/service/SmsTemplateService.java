package com.bofide.bip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.SmsTemplateMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerUpdateSms;
import com.bofide.bip.po.SmsTemplate;
import com.bofide.common.util.DealStringUtil;

@Service(value = "smsTemplateService")
public class SmsTemplateService {

	@Resource(name = "smsTemplateMapper")
	private SmsTemplateMapper smsTemplateMapper;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private SendPhoneMessageService sendPhoneMessageService;
	@Autowired
	private CustomerUpdateSmsService customerUpdateSmsService;
	
	public void insert(Map<String, Object> param) throws Exception {
		smsTemplateMapper.insert(param);
	}
	
	public List<Map<String, Object>> findByCondition(Map<String, Object> param) throws Exception {
		return smsTemplateMapper.findByStoreId(param);
	}
	
	public void updateTemplateById(Map<String, Object> param) throws Exception {
		smsTemplateMapper.updateById(param);
	}
	
	public Map<String, Object> findTemplateById(Integer id) throws Exception {
		return smsTemplateMapper.findById(id);
	}
	
	/**
	 * 根据店ID查询启用状态是1的模板
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public SmsTemplate findByStoreIdAndState(Map<String,Object> map) throws Exception {
		return smsTemplateMapper.findByStoreIdAndState(map);
	}
	public int findEnableCount(Integer storeId) throws Exception {
		return smsTemplateMapper.findEnableCount(storeId);
	}
	
	/**
	 * 系统自动发送营销短信后对数据库的操作
	 * @param bean
	 * @param cus
	 * @param smsTemplate
	 * @throws Exception
	 */
	public void disBean(CustomerUpdateSms bean,Customer cus,SmsTemplate smsTemplate,String message,boolean boo) throws Exception{
		String operation = "发送营销短信";
		String dealActivateReason = DealStringUtil.dealTraceRecordContent(operation, message, "系统");
		String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, "系统");
		//添加操作记录
		customerService.addTraceRecord(cus.getPrincipalId(),cus.getPrincipal(),bean.getCustomerId(), dealActivateReason, lastTraceResult,null,null,null);
		
		if(boo){
			//新增短信信息
			Map<String,Object> map = new HashMap<>();
			map.put("storeId", bean.getStoreId());
			map.put("customerId", bean.getCustomerId());
			map.put("contact", cus.getContact());
			map.put("contactWay", cus.getContactWay());
			map.put("content", smsTemplate.getDetails());
			map.put("smsTemplateId", smsTemplate.getId());
			map.put("type", 1);
			map.put("sfdj", 0);
			sendPhoneMessageService.insertSMS(map);
		}
	}
}
