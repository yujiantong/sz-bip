package com.bofide.bip.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.service.SendPhoneMessageService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/message")
public class SendPhoneMessageController extends BaseResponse{
	private static Logger logger = Logger.getLogger(SendPhoneMessageController.class);
	
	@Autowired
	private SendPhoneMessageService sendPhoneMessageService;
	
	/** 
	 * 新增短信记录
	 * @return
	 */
	@RequestMapping(value = "/addPhoneMessage", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse addPhoneMessage(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="contact") String contact,
			@RequestParam(name="contactWay") String contactWay,
			@RequestParam(name="content") String content,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="nicheng") String nicheng) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> messageMap = new HashMap<>();
			messageMap.put("storeId", storeId);
			messageMap.put("userId", userId);
			messageMap.put("customerId", customerId);
			messageMap.put("contact", contact);
			messageMap.put("contactWay", contactWay);
			messageMap.put("content", content);
			messageMap.put("sendTime", new Date());
			messageMap.put("type", 0);
			
			sendPhoneMessageService.insert(messageMap,principalId,principal,userId,userName,nicheng);
			
			rs.setSuccess(true);
			rs.setMessage("短信发送成功！");
		} catch (Exception e) {
			logger.info("短信发送失败: ", e);
			rs.setSuccess(false);
			rs.setMessage("短信发送失败,请重发!");
		}
		return rs;
	}
	/**
	 * 查询发送过的短信
	 * param: storeId,currentPage
	 */
	@RequestMapping(value="/findPhoneMessage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findPhoneMessage(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer currentPage = (Integer)param.get("currentPage");
			//获取分页标志,判断是APP端分页,还是PC端分页
			String pageType = (String) param.get("pageType");
			Integer start = null;
			if("PC".equals(pageType)){
				start = (currentPage - 1) * ConstantUtil.pageSize;
				param.put("start", start);
				param.put("pageSize", ConstantUtil.pageSize);
			}else if("APP".equals(pageType)){
				start = (currentPage - 1) * ConstantUtil.appPageSize;
				param.put("start", start);
				param.put("pageSize", ConstantUtil.appPageSize);
			}
			List<Map<String, Object>> result = sendPhoneMessageService.findPhoneMessage(param);
			Integer messageCount = sendPhoneMessageService.findPhoneMessageCount(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("messageCount", messageCount);
			return rs;
		} catch (Exception e) {
			logger.info("查询发送过的短信失败：", e);
			rs.setSuccess(false);
			rs.setMessage("查询发送过的短信失败!");
			return rs;
		}
	}
}
