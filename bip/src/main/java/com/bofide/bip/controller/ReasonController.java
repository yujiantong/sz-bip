package com.bofide.bip.controller;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.Reason;
import com.bofide.bip.service.ReasonService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/reason")
public class ReasonController extends BaseResponse{
	private static Logger logger = Logger.getLogger(ReasonController.class);
	@Autowired
	private ReasonService reasonService;
	
	/**
	 * 新增回退失销原因
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/addReason",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addReason(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			//原因JSON转JAVA对象
			ObjectMapper mapper = new ObjectMapper();
			Reason reason = mapper.readValue(params,Reason.class);
			//新增的原因都是可编辑删除的
			reason.setDisable(1);
			
			int id = reasonService.insert(reason);
			
			if(id == -1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该原因已存在,新增失败");
			}else{
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("id", id);
				rs.setMessage("新增成功");
			}
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增原因失败,程序异常");
			logger.info("新增原因失败，程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 删除原因
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/deleteById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteById(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> reasonMap = mapper.readValue(params,Map.class);
			
			reasonService.deleteById(reasonMap);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("删除成功");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除失败,程序异常");
			logger.info("删除原因失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 修改原因
	 * @param params
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/updateReason",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateReason(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> reasonMap = mapper.readValue(params,Map.class);
			
			reasonService.update(reasonMap);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改成功");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改原因失败,程序异常");
			logger.info("修改原因失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 查询原因列表
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/findAllReason",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllReason(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			
			List<Map<String,Object>> lists = reasonService.findReasonByCondition(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", lists);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询原因列表失败,程序异常");
			logger.info("查询原因列表失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 查询回退失销原因的下拉框
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/findForSelectData",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findForSelectData(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			param.put("status", 1);
			
			List<Map<String,Object>> lists = reasonService.findForSelectData(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", lists);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询原因失败,程序异常");
			logger.info(" 查询回退失销原因的下拉框失败,程序异常:", e);
			return rs; 
		}
	}
}
