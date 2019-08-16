package com.bofide.bip.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;

@Controller
@RequestMapping(value = "/")
public class TestController extends BaseResponse {
	private static Logger logger = Logger.getLogger(TestController.class);

	@Autowired
	private UserService userService;
	@Autowired
	private CustomerService customerService;
	//test服务器是否正常
	@RequestMapping(value="/test",method={RequestMethod.GET})
	@ResponseBody 
	public BaseResponse test(HttpServletRequest request,HttpServletResponse response){
			
		BaseResponse rs = new BaseResponse();
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs; 
	}
	
	@RequestMapping(value="/fixData",method={RequestMethod.GET})
	@ResponseBody 
	public BaseResponse fixData(HttpServletRequest request,HttpServletResponse response){
			
		BaseResponse rs = new BaseResponse();
		try {
			userService.fixData();
			rs.setSuccess(true);
			rs.setMessage("修复成功");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			rs.setSuccess(false);
			rs.setMessage("修复失败");
		}
		return rs; 
	}

	//修复正常状态的潜客进入到已脱保页面的数据
	@RequestMapping(value="/fixYtbData",method={RequestMethod.GET})
	@ResponseBody 
	public BaseResponse fixYtbData(HttpServletRequest request,HttpServletResponse response){		
		BaseResponse rs = new BaseResponse();
		try {
			logger.info("开始修复正常状态的潜客进入到已脱保页面的数据");
			customerService.updateYtbCustomerByRepairData();
			logger.info("结束修复正常状态的潜客进入到已脱保页面的数据");
			rs.setSuccess(true);
			rs.setMessage("修复成功");
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.setMessage("修复失败");
			logger.info("结束修复正常状态的潜客进入到已脱保页面的数据");
		}
		return rs; 
	}
}
