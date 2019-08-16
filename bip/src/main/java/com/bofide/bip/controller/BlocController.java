package com.bofide.bip.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.Bloc;
import com.bofide.bip.service.BlocService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/bloc")
public class BlocController extends BaseResponse{
	private static Logger logger = Logger.getLogger(BlocController.class);
	@Autowired
	private BlocService blocService;
	
	/**
	 * 新增集团
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/addBloc",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addBloc(@RequestParam(name="data") String data){
		BaseResponse rs = new BaseResponse();
		try {
			//JSON字符串转JAVA对象
			ObjectMapper mapper = new ObjectMapper();
			Bloc bloc = mapper.readValue(data, Bloc.class);
			
			int jtId = blocService.insert(bloc);
			
			if(jtId == -1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增集团失败,该缩写名的集团已存在或被4s店缩写名使用");
				logger.info("新增集团失败,该缩写名的集团已存在或被4s店缩写名使用");
			}else{
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("jtId", jtId);
				rs.setMessage("新增集团成功");
			}
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增集团失败,程序异常");
			logger.info("新增集团失败，程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 修改集团
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/updateBloc",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateBloc(@RequestParam(name="data") String data){
		BaseResponse rs = new BaseResponse();
		try {
			//JSON字符串转成Map对象
			ObjectMapper mapper = new ObjectMapper();
			Map<String,Object> param = mapper.readValue(data, Map.class);
			param.put("jtUpdateDate", new Date());
			
			blocService.updateSelectiveById(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改集团信息成功");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改集团信息失败,程序异常");
			logger.info("修改集团信息失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 按条件查询集团
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCondition(@RequestParam(name="data") String data){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(data, Map.class);
			param.put("jtDeleted", 0);
			
			List<Bloc> lists = blocService.findByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", lists);
			rs.setMessage("按条件查询厂家成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("按条件查询集团失败,程序异常");
			logger.info("按条件查询集团失败,程序异常:", e);
			return rs; 
		}
		
	}
	
	/**
	 * 删除集团
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/deleteBloc",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteBloc(@RequestParam(name="data") String data){
		BaseResponse rs = new BaseResponse();
		try {
			//JSON字符串转成Map对象
			ObjectMapper mapper = new ObjectMapper();
			Map<String,Object> param = mapper.readValue(data, Map.class);
			param.put("jtDeleted", 1);
			param.put("jtDeleteDate", new Date());
			
			blocService.deleteSoftById(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("删除集团成功");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除集团失败,程序异常");
			logger.info("删除集团失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 按条件校验集团的信息是否存在
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/findExistByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findExistByCondition(@RequestParam(name="data") String data){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(data, Map.class);
			param.put("jtDeleted", 0);
			
			boolean existFlag = blocService.findExistByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", existFlag);
			rs.setMessage("校验集团信息成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("校验集团信息失败,程序异常");
			logger.info("校验集团信息失败,程序异常:", e);
			return rs; 
		}
		
	}
}
