package com.bofide.bip.controller;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.service.JpushService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/jpush")
public class JpushController extends BaseResponse{
	private static Logger logger = Logger.getLogger(JpushController.class);
	@Autowired
	private JpushService jpushService;
	
	/**
	 * 新增极光推送用户信息
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/addJpush",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addJpush(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			logger.info("新增极光推送用户: " + params);
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			
			jpushService.insert(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("新增极光推送用户信息");
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增极光推送用户信息失败");
			logger.info("新增极光推送用户信息失败，程序异常:", e);
		}
		return rs; 
	}
	
}
