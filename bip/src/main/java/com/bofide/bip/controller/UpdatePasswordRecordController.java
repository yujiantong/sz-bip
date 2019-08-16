package com.bofide.bip.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.UpdatePasswordRecord;
import com.bofide.bip.service.UpdatePasswordRecordService;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/updatePasswordRecord")
public class UpdatePasswordRecordController extends BaseResponse {
	private static Logger logger = Logger.getLogger(UpdatePasswordRecordController.class);
	
	@Autowired
	private UpdatePasswordRecordService updatePasswordRecordService;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	
	/**
	 * 查询更新密码操作记录
	 * param: storeId,operateTime
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findByStoreAndTime",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByStoreAndTime(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			List<UpdatePasswordRecord> list = updatePasswordRecordService.findByStoreAndTime(param);
			rs.setSuccess(true);
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.error("查询所有下级失败: ", e);
			rs.setSuccess(false);
			return rs; 
		}
	}
	
	/** 
	 * 新增更新密码操作记录
	 * param: property of UpdatePasswordRecord bean
	 * @return
	 */
	@RequestMapping(value = "/addUpdateRecord", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse addUpdateRecord(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String, Object> map = objectMapper.readValue(params, Map.class);
			Integer storeId = (Integer) map.get("storeId");
			Store store = storeMapper.selectByPrimaryKey(storeId);
			if(store.getShopId()!=null&&store.getShopId()!=""&&store.getToken()!=null&&store.getToken()!=""){
				map.put("shopId", store.getShopId());
				map.put("token", store.getToken());
				//博福
				String message =updatePasswordRecordService.saveUpdatePasswordBfRecord(map);
				rs.setSuccess(true);
				rs.setMessage(message);
			}else{
				//壁虎
				String message = updatePasswordRecordService.saveUpdatePasswordRecord(map);
				rs.setSuccess(true);
				rs.setMessage(message);
			}
			return rs;
		} catch (Exception e) {
			logger.error("新增更新密码操作记录失败",e);
			rs.setSuccess(false);
			rs.setMessage("修改失败");
			return rs;
		}
	}	
	
	/**
	 * 查询最近的更新密码操作记录
	 * param: storeId
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findLatestRecordByStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findLatestRecordByStore(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			UpdatePasswordRecord record = updatePasswordRecordService.findLatestRecordByStore(param);
			rs.setSuccess(true);
			rs.addContent("results", record);
			return rs; 
		} catch (Exception e) {
			logger.error("查询最近的更新密码操作记录失败: ", e);
			rs.setSuccess(false);
			return rs; 
		}
	}
}
