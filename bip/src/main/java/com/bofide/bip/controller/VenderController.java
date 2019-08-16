package com.bofide.bip.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.Vender;
import com.bofide.bip.service.VenderService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/vender")
public class VenderController extends BaseResponse{
	private static Logger logger = Logger.getLogger(VenderController.class);
	@Autowired
	private VenderService venderService;
	
	/**
	 * 新增厂家
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/insert",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insert(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		if(StringUtils.isEmpty(condition)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("厂家信息为空,新增厂家失败!");
			return rs; 
		}
		try {
			//厂家Json转java对象
			JSONObject json = JSONObject.fromObject(condition);
			Vender vender = (Vender)JSONObject.toBean(json,Vender.class);
			//调用service新增厂家
			int venderId = venderService.insert(vender);
			if(venderId == -1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增厂家失败,该厂家已存在");
				logger.info("新增厂家失败，该厂家已存在");
			}else{
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("id", venderId);
				rs.setMessage("新增厂家信息成功");
			}
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增厂家失败,程序异常");
			logger.info("新增厂家失败，程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 修改厂家
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/update",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse update(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		if(StringUtils.isEmpty(condition)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("厂家信息为空,修改厂家信息失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject json = JSONObject.fromObject(condition);
			Vender vender = (Vender)JSONObject.toBean(json,Vender.class);
			//调用service修改厂家
			venderService.update(vender);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改厂家信息失败,程序异常");
			logger.info("修改厂家信息失败,程序异常:", e);
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("修改厂家信息成功");
		return rs; 
	}
	
	/**
	 * 按条件查询厂家
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/findVenderByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findVenderByCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			List<Map<String,Object>> lists = venderService.findVenderByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", lists);
			rs.setMessage("按条件查询厂家成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("按条件查询厂家失败,程序异常");
			logger.info("按条件查询厂家失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
}
