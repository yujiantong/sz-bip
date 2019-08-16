package com.bofide.bip.service;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.po.CustomerAssign;

/**
 *潜客分配服务类
 * @author 
 *
 */
@Service(value = "customerAssignService")
@Transactional
public class CustomerAssignService {
	private static Logger logger = Logger.getLogger(CustomerAssignService.class);
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	
	public CustomerAssign findCustomerAssign(Integer customerId, Integer userId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode(param);
		return customerAssign;
	}
	
}
