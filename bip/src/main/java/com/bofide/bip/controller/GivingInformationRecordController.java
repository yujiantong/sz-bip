package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.service.GivingInformationRecordService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/giving")
public class GivingInformationRecordController extends BaseResponse{
	private static Logger logger = Logger.getLogger(GiftManagementController.class);
	
	@Autowired
	private GivingInformationRecordService givingInformationRecordService;
	
	/**
	 * 根据条件查询赠送信息相关联的保单信息
	 * @param request
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/findGivingByCondition", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findGivingByCondition(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		String storeId = request.getParameter("storeId");
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)mapper.readValue(condition, Map.class);
			Integer start = (Integer)param.get("startNum")-1;
			param.put("start", start*ConstantUtil.pageSize);
			param.put("pageSize", ConstantUtil.pageSize);
			if(storeId!=null&&storeId.length()>0){
				param.put("storeId", Integer.parseInt(storeId));
			}
			param.put("roleId", roleId);
			List<Map<String, Object>> maps =givingInformationRecordService.findGivingByCondition(param);
		/*	//权限校验 非总经理加密联系方式
			if(roleId != 11){
			   for (Map<String, Object> map : maps) {
				   for (Map.Entry<String, Object> m : map.entrySet()) {
		                if(m.getKey().equals("contactWay")){
		                	 String value = (String) m.getValue();
		                	String turnTelF = StringUtil.turnTelF(value);
		                	m.setValue(turnTelF);
		                }
		            }
		        }
			}*/
			int policyCount = 0;
			policyCount = givingInformationRecordService.countGivingByCondition(param);
			Double dou = 0.0;
			dou = givingInformationRecordService.sumAmountMoney(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			rs.addContent("policyCount", policyCount);
			rs.addContent("dou", dou);
			rs.setMessage("查询赠送核销相关联的保单信息成功");
			return rs;
		} catch (Exception e) {
			logger.error("查询赠送核销相关联的保单信息失败,程序异常: ", e);
			rs.setMessage("查询赠送核销相关联的保单信息失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	/**
	 * exportGiftRecord 导出赠品信息
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/exportGiftRecord", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse exportGiftRecord(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		
		//String storeId = request.getParameter("storeId");
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		try {
			List<Map<String, Object>> maps = new ArrayList<>();
			if(!"".equals(condition)){
					String condit = condition.substring(1, condition.length()-1);
					String[] approvalBillIds = condit.split(",");
					List<Integer> list = new  ArrayList<Integer>();
					for (String integer : approvalBillIds) {
						list.add(Integer.parseInt(integer));
					}
					List<Map<String, Object>> map =givingInformationRecordService.findGivingByApprovalBillIds(list);
					System.out.println("赠品详情=map=>" + map);
					maps.addAll(map);
				 
			}
			if(roleId != 11){
				   for (Map<String, Object> map : maps) {
					   for (Map.Entry<String, Object> m : map.entrySet()) {
			                if(m.getKey().equals("actualPrice")){
			                	m.setValue("");
			                	System.out.println(m.getValue());
			                }
			            }
			        }
				}
			System.out.println("赠品详情==>" + maps);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps); 
			rs.setMessage("审批单赠送信息成功");
			return rs;
		} catch (Exception e) {
			logger.error("导出赠品信息失败,程序异常: ", e);
			rs.setMessage("导出赠品信息失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	/**
	 * 根据审批单ID查询赠送信息
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/findGivingByApprovalBillId", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findGivingByApprovalBillId(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String approvalBillIdStr = request.getParameter("approvalBillId");
		try {
			Integer approvalBillId = 0;
			if(!"".equals(approvalBillIdStr)){
				approvalBillId = Integer.parseInt(approvalBillIdStr);
			}
			List<Map<String, Object>> maps =givingInformationRecordService.findGivingByApprovalBillId(approvalBillId);
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("approvalBillId", approvalBillId);
			Double dou = 0.0;
			dou = givingInformationRecordService.sumAmountMoney(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			rs.addContent("dou", dou);
			rs.setMessage("审批单赠送信息成功");
			return rs;
		} catch (Exception e) {
			logger.error("查询审批单赠送信息失败,程序异常: ", e);
			rs.setMessage("查询审批单赠送信息失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/**
	 * 修改赠送信息--核销
	 * @param request
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/updateGiving", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse updateGiving(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		String userName = request.getParameter("userName");
		try {
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> maps = mapper.readValue(condition, List.class);
			givingInformationRecordService.updateGiving(maps,storeId,userId,userName);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改赠送信息成功");
			return rs;
		} catch (Exception e) {
			logger.error("修改赠送信息失败,程序异常: ", e);
			rs.setMessage("修改赠送信息失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/**
	 * 根据审批单ID查询核销记录
	 * @return
	 */
	@RequestMapping(value = "/findAllHxRecordByApprovalBillId", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findAllHxRecordByApprovalBillId(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		try {
			ObjectMapper mapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)mapper.readValue(condition, Map.class);
			List<Map<String, Object>> list = givingInformationRecordService.findAllHxRecordByApprovalBillId(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			rs.setMessage("查询核销记录成功");
			return rs;
		} catch (Exception e) {
			logger.error("查询核销记录失败,程序异常: ", e);
			rs.setMessage("查询核销记录失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
}
