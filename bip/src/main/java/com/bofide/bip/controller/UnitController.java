package com.bofide.bip.controller;

import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.Store;
import com.bofide.bip.po.Unit;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UnitService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/unit")
public class UnitController extends BaseResponse{
	private static Logger logger = Logger.getLogger(UnitController.class);
	@Autowired
	private UnitService unitService;
	@Autowired
	private StoreService storeService;
	
	/**
	 * 新增事业部门
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/insert",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insert(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			Integer jtId = Integer.parseInt(request.getParameter("jtId"));
			String unitName = request.getParameter("unitName");
			if(unitName==null||unitName==""){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增事业部门失败,请输入事业部名称！");
				logger.info("新增事业部门失败，请输入事业部名称！");
			}
			Unit unit = new Unit();
			unit.setJtId(jtId);
			unit.setUnitName(unitName);
			//调用service新增事业部门
			int unitId = unitService.insert(unit);
			if(unitId == -1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增事业部门失败,该事业部门已存在");
				logger.info("新增事业部门失败，该事业部门已存在");
			}else{
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("id", unitId);
				rs.setMessage("新增事业部门信息成功");
			}
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增事业部门失败,程序异常");
			logger.info("新增事业部门失败，程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 按条件查询事业部门
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/findUnitByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUnitByCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			List<Unit> lists = unitService.findUnitByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", lists);
			rs.setMessage("按条件查询事业部门成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("按条件查询事业部门失败,程序异常");
			logger.info("按条件查询事业部门失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 修改事业部门和店之间的关联
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/updateUnitAndStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateUnitAndStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		if(StringUtils.isEmpty(condition)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("事业部门信息为空,修改事业部门和店之间的关联失败!");
			return rs; 
		}
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//调用service修改事业部门和店之间的关联
			unitService.updateUnitAndStore(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改事业部门和店之间的关联成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改事业部门和店之间的关联失败,程序异常");
			logger.info("修改事业部门和店之间的关联失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 根据不同条件查询4s店
	 * @return 
	 */
	@RequestMapping(value="/findStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findStore(@RequestParam(name="jtId")Integer jtId,
			@RequestParam(name="unitId")Integer unitId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("jtId", jtId);
			param.put("crl", jtId);
			List<Store> stores = storeService.findStoreByCondition(param);
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("unitId", unitId);
			List<Store> stores1 = storeService.findStoreByCondition(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", stores);
			rs.addContent("result1", stores1);
			return rs;
		} catch (Exception e) {
			logger.error("根据用户id查询用户失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据用户id查询用户失败,程序异常");
			return rs; 
		}
	}
}
