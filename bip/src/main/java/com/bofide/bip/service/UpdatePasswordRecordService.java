package com.bofide.bip.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UpdatePasswordRecordMapper;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.UpdatePasswordRecord;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.HttpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service(value = "updatePasswordRecordService")
public class UpdatePasswordRecordService {
	@Resource(name="updatePasswordRecordMapper")
	private UpdatePasswordRecordMapper updatePasswordRecordMapper;
	@Autowired
	private BiHuService biHuService;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	
	private static Logger logger = Logger.getLogger(BiHuService.class);
	
	public List<UpdatePasswordRecord> findByStoreAndTime(Map<String,Object> map) throws Exception{
		return updatePasswordRecordMapper.findByStoreAndTime(map);
	}
	/**
	 * 新增更新密码操作记录（壁虎）
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public String saveUpdatePasswordRecord(Map<String, Object> map) throws Exception{
		String message ="";
		Integer storeId = (Integer) map.get("storeId");
		List<Map<String,Object>> uKeyList = new ArrayList<Map<String,Object>>();
		Map<String, Object> uKeyListMap = biHuService.getUKeyList(map, storeId);
		List<Map<String,Object>> uKeyListResult = (List<Map<String, Object>>) uKeyListMap.get("CityUKeyList");
		if(uKeyListResult==null){
			message = (String) uKeyListMap.get("StatusMessage");
			return message;
		}else{
			uKeyList = uKeyListResult;
			if(uKeyList.size()<=0){
				Integer uKeyBusinessStatus = (Integer) uKeyListMap.get("BusinessStatus");
				if(uKeyBusinessStatus!=null&&(uKeyBusinessStatus==1||uKeyBusinessStatus==0)){
					message = "修改失败,不存在该渠道";
					return message;
				}else{
					message = (String) uKeyListMap.get("StatusMessage");
					return message;
				}
				
			}else{
				Map<String,Object> cityUKeyMap = uKeyList.get(0); 
				Integer uId = (Integer) cityUKeyMap.get("Uid"); 
				map.put("UkeyId", uId.toString());
			}
		}
		Map<String, Object> editResultMap =biHuService.editAgentUKey(map, storeId);
		Integer businessStatus = (Integer) editResultMap.get("BusinessStatus");
		if(businessStatus!=null&&businessStatus==1){
			message = "修改成功";
			map.put("operateStatu", 1);
		}else{
			message = (String) editResultMap.get("StatusMessage");
			map.put("operateStatu", 0);
		}
		updatePasswordRecordMapper.insert(map);
		return message;
	}
	/**
	 * 新增更新密码操作记录（博福）
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public String saveUpdatePasswordBfRecord(Map<String, Object> map) throws Exception {
		String message ="";
		Map<String, Object> urlMap = new HashMap<String, Object>();
		urlMap.put("shopId", map.get("shopId"));
		urlMap.put("token", map.get("token"));
		String urlParam = mapToUrlParam(urlMap);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "updateBxInfo");
		JSONObject jsonObject=new JSONObject();
		JSONArray jsonArray=new JSONArray();
		String insuranceCompName=(String) map.get("insuranceCompName");
		jsonObject.put("insuranceCompany", changeInsu(insuranceCompName));
		jsonObject.put("bxUser", map.get("userName"));
		jsonObject.put("bxPassword", map.get("newPassword"));
		jsonArray.add(jsonObject);
		Map<String, Object> argsMap = new HashMap<String, Object>();
		argsMap.put("insuranceAccountList", jsonArray);
		ObjectMapper o = new ObjectMapper();
		String args = o.writeValueAsString(argsMap);
		requestUrl = requestUrl +"?"+urlParam+"&args="+ URLEncoder.encode(args,"utf-8");
		String updateBxInfo = HttpRequest.sendGetRequest(requestUrl);
		if(updateBxInfo!=null&&updateBxInfo!=""){
			if(JSONObject.fromObject(updateBxInfo).getBoolean("success")){
				message = "修改成功";
				map.put("operateStatu", 1);
			}else{
				map.put("operateStatu", 0);
				message = "修改失败";
			}
		}else{
			map.put("operateStatu", 0);
			message = "修改失败";
		}
		logger.info(updateBxInfo);
		updatePasswordRecordMapper.insert(map);
		return message;
	}
	/**
	 * 保险公司
	 * @param insu value值
	 * @return
	 */
	public String changeInsu(String insu){
		Map<String, String> param = new HashMap<String, String>();
		param.put("平安", "pingan");
		param.put("人保", "picc");
		param.put("太平洋", "cpic");
		param.put("人寿", "lifeInsurance");
		return param.get(insu);
	}
	/**
	 * 由json转成Map
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> jsonToMap(String jsonParam) {
		ObjectMapper  objectMapper = new ObjectMapper();
		try {
			return (Map<String,Object>)objectMapper.readValue(jsonParam, Map.class);
		} catch (IOException e) {
			
		}
		return null;
	}

	/**
	 * url参数由MAP转成String
	 * 
	 * @param param url所需参数
	 * @return urlParam url参数的字符串
	 */
	public String mapToUrlParam(Map<String, Object> param) {

		String urlParam = "";
		int i = 0;
		for (String key : param.keySet()) {
			if (i == 0) {
				urlParam = key + "=" + param.get(key);
			}else{
				urlParam = urlParam +"&"+ key + "=" + param.get(key);
			}
			i++;
		}
		return urlParam;
	}

	public UpdatePasswordRecord findLatestRecordByStore(Map<String,Object> map) throws Exception{
		return updatePasswordRecordMapper.findLatestRecordByStore(map);
	}

	
}
