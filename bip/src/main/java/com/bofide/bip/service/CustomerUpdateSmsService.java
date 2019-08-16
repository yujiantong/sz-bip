package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CustomerUpdateSmsMapper;
import com.bofide.bip.po.CustomerUpdateSms;

@Service(value = "customerUpdateSmsService")
public class CustomerUpdateSmsService {
	@Resource(name="customerUpdateSmsMapper")
	private CustomerUpdateSmsMapper customerUpdateSmsMapper;
	
	//查询
	public List<CustomerUpdateSms> select(Map<String, Object> map) throws Exception {
		List<CustomerUpdateSms> lists = customerUpdateSmsMapper.select(map);
		return lists;
	}
	//新增
	public void insert(CustomerUpdateSms customerUpdateSms) throws Exception{
		customerUpdateSmsMapper.insert(customerUpdateSms);
	}
	//删除
	public void deleteByPrimaryKey(Integer id) throws Exception{
		customerUpdateSmsMapper.deleteByPrimaryKey(id);
	}
	/**
	 * 根据潜客ID删除记录
	 * @param customerId
	 * @throws Exception
	 */
	public void deleteByCustomerId(Integer customerId) throws Exception{
		customerUpdateSmsMapper.deleteByCustomerId(customerId);
	}
	/**
	 * 系统定时发送完毕后清空表
	 * @param customerId
	 * @throws Exception
	 */
	public void delete() throws Exception{
		customerUpdateSmsMapper.delete();
	}
}
