package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CustomerUpdateMapper;
import com.bofide.bip.po.CustomerUpdate;

@Service(value = "customerUpdateService")
public class CustomerUpdateService {
	@Resource(name="customerUpdateMapper")
	private CustomerUpdateMapper customerUpdateMapper;
	
	//查询
	public List<CustomerUpdate> select(Map<String, Object> map) throws Exception {
		List<CustomerUpdate> customerUpdates = customerUpdateMapper.select(map);
		return customerUpdates;
	}
	//新增
	public void insert(CustomerUpdate customerUpdate) throws Exception{
		customerUpdateMapper.insert(customerUpdate);
	}
	//删除
	public void deleteByPrimaryKey(Integer id) throws Exception{
		customerUpdateMapper.deleteByPrimaryKey(id);
	}
}
