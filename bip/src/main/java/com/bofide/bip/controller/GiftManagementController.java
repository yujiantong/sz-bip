package com.bofide.bip.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.GiftManagement;
import com.bofide.bip.service.GiftManagementService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/gift")
public class GiftManagementController extends BaseResponse{
	private static Logger logger = Logger.getLogger(GiftManagementController.class);
	
	@Autowired
	private GiftManagementService giftManagementService;
	
	/** 
	 * 新增赠品
	 * @return
	 */
	@RequestMapping(value = "/addGift", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse addGift(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String giftInfo = request.getParameter("giftInfo");
		try {
			ObjectMapper mapper = new ObjectMapper();
			GiftManagement giftManagement = mapper.readValue(giftInfo, GiftManagement.class);
			if(giftManagement!=null){
				Map<String,Object> param = new HashMap<String, Object>();
				param.put("giftCode", giftManagement.getGiftCode());
				param.put("storeId", giftManagement.getStoreId());
				
				GiftManagement existGiftManagement = giftManagementService.findGiftByCode(param);
				if(existGiftManagement!=null){
					rs.setMessage("新增赠品失败,已经存在该编码的赠品");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					return rs;
				}
			}
			giftManagementService.insertGiftManagement(giftManagement);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("新增赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("新增赠品失败,程序异常: ", e);
			rs.setMessage("新增赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 
	 * 根据赠品类型等条件查询赠品
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/findGiftByCondition", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findGiftByCondition(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)mapper.readValue(condition, Map.class);
			List<GiftManagement> giftManagements =giftManagementService.findGiftByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", giftManagements);
			rs.setMessage("查询赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("查询赠品失败,程序异常: ", e);
			rs.setMessage("查询赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 
	 * 根据赠品编码查询赠品
	 * @return
	 */
	@RequestMapping(value = "/findGiftByCode", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findGiftByCode(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="giftCode") String giftCode) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String, Object>();
			param.put("giftCode", giftCode);
			param.put("storeId", storeId);
			
			GiftManagement giftManagement = giftManagementService.findGiftByCode(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", giftManagement);
			rs.setMessage("查询赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("查询赠品失败,程序异常: ", e);
			rs.setMessage("查询赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 
	 * 修改赠品
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/updateGiftById", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse updateGiftById(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String giftInfo = request.getParameter("giftInfo");
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String,Object> param = mapper.readValue(giftInfo, Map.class);
			Integer storeId = (Integer)param.get("storeId");
			String giftCode = (String) param.get("giftCode");
			Integer id = (Integer) param.get("id");
			Map<String,Object> existParam = new HashMap<String, Object>();
			existParam.put("giftCode", giftCode);
			existParam.put("storeId", storeId);
				
			GiftManagement existGiftManagement = giftManagementService.findGiftByCode(existParam);
			if(existGiftManagement!=null&&!id.equals(existGiftManagement.getId())){
				rs.setMessage("修改赠品失败,已经存在该编码的赠品");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				return rs;
			}
			
			giftManagementService.updateGiftById(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("修改赠品失败,程序异常: ", e);
			rs.setMessage("修改赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 
	 * 根据赠品编码或者名称自动联想查询赠品
	 * @return
	 */
	@RequestMapping(value = "/findGiftByCodeOrName", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findGiftByCodeOrName(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="searchCondition") String searchCondition,
			@RequestParam(name="giftType") Integer giftType) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String, Object>();
			param.put("searchCondition", searchCondition);
			param.put("storeId", storeId);
			param.put("giftType", giftType);
			param.put("status", 1);
			param.put("currentTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			
			List<GiftManagement> giftManagements =giftManagementService.findGiftByCodeOrName(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", giftManagements);
			rs.setMessage("自动联想查询赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("自动联想查询赠品失败,程序异常: ", e);
			rs.setMessage("自动联想查询赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 
	 * 操作赠品生效或者不生效
	 * @return
	 */
	@RequestMapping(value = "/updateGiftStaus", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse updateGiftStaus(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="giftCode") String giftCode,
			@RequestParam(name="status") Integer status) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String, Object>();
			param.put("giftCode", giftCode);
			param.put("storeId", storeId);
			param.put("status", status);
			
			giftManagementService.updateGiftByCode(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("操作赠品成功");
			return rs;
		} catch (Exception e) {
			logger.error("操作赠品失败,程序异常: ", e);
			rs.setMessage("操作赠品失败");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}
}
