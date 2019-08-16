package com.bofide.bip.controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.Suggest;
import com.bofide.bip.po.User;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.SuggestService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.MongoDBUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.Block;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;

import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/suggest")
@SuppressWarnings("all")
public class SuggestController extends BaseResponse{
	private static Logger logger = Logger.getLogger(SuggestController.class);
	
	@Autowired
	private SuggestService suggestService;
	@Autowired
	private CommonService commonService;
	
	/** 
	 * 新增建议
	 * @return
	 */
	@RequestMapping(value = "/addSuggest", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse addSuggest(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String suggestInfo = request.getParameter("suggestInfo");
		if (StringUtils.isEmpty(suggestInfo)) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("建议信息为空,新增建议失败!");
			return rs;
		}
		JSONObject jsonObj = JSONObject.fromObject(suggestInfo);
		Suggest suggest = (Suggest)JSONObject.toBean(jsonObj,Suggest.class);
		
		try {
			//插入到bomp库（mongodb的建议表-userSuggest）
			Integer storeId = jsonObj.getInt("storeId");
			insertOneSuggest(suggest,storeId);
			//插入到bip库（mysql）,取消此插入,将所有建议归纳到bomp中处理
			//suggestService.insertSuggest(suggest);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("新增建议成功！");
		} catch (Exception e) {
			if(e.getMessage().indexOf("Incorrect string value")>0){
				logger.error("新增建议失败,存在不支持的字符:",e);
				rs.setMessage("新增建议失败,存在不支持的字符!");
			}else{
				logger.error("新增建议失败:",e);
				rs.setMessage("新增建议失败!");
			}
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
		return rs;
	}
	
	public void insertOneSuggest(Suggest suggest,Integer storeId){
		MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
	    Document document = new Document("title",suggest.getTitle())
	    		.append("content", suggest.getContent())
	    		.append("uuId", MongoDBUtil.getUUID())
	    		.append("userId", suggest.getUserId())
	    		.append("userName", suggest.getUserName())
	    		.append("tissueId", storeId)
	    		.append("tissueName", suggest.getStoreName())
	    		.append("state", 0)
	    		.append("entityTypeId", 1)
	    		.append("positionName", suggest.getUserRoleName())
	    		.append("recordTime", new Date())
	    		.append("tel", suggest.getUserPhone())
	    		.append("reposeDesc", suggest.getDisContent())
	    		.append("level", 1)
	    		.append("belongToService", 1);//1代表bip系统
	    //插入一个
	    collection.insertOne(document);
	}

	
	/**
	 *  查询所有建议
	 * @return 
	 */
	@RequestMapping(value="/selectAllSuggest",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectAllSuggest(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String start = request.getParameter("start");
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		String searchDatas = request.getParameter("searchDatas");
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> map = null;
		Map<String,Object> param = new HashMap<String,Object>();
		try {
			map = objectMapper.readValue(searchDatas, Map.class);
			MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
		    //指定查询过滤器查询
		    
			 BasicDBObject basicDBObject = new BasicDBObject();
			 basicDBObject.put("belongToService", 1);
			 if(map.get("selectStoreName")!=null && map.get("selectStoreName")!=""){
				 basicDBObject.put("tissueName", map.get("selectStoreName").toString());
			 }
			 if(map.get("selectNum")!=null && map.get("selectNum")!=""){
				 basicDBObject.put("state", (Integer)map.get("selectNum"));
			 }
			 if(map.get("selectUserName")!=null && map.get("selectUserName")!=""){
				 basicDBObject.put("userName", map.get("userName").toString());
			 }
			 FindIterable find = collection.find(basicDBObject);
		    MongoCursor cursor = find.iterator();
		    List<Suggest> suggestlist = new ArrayList<>();
		    int policyCount = 0;
		    while (cursor.hasNext()) {
		    	 Document doc = (Document) cursor.next();
		    	 Suggest suggest = new Suggest();
		    	 suggest = MongoDBUtil.documtToSuggest(doc, suggest);
				 suggestlist.add(suggest);
			}
		    //单独查询店名称下拉框
		    FindIterable findIterable = collection.find(new Document("belongToService", 1));
		    List<String> storeNameList = new ArrayList<>();
		    List<String> storeNames = new ArrayList<>();
		    MongoCursor res1 = findIterable.iterator();
		    while (res1.hasNext()) {
		    	Document doc = (Document) res1.next();
		    	String storeName = doc.get("tissueName") == null ? "" : doc.get("tissueName").toString();
		    	storeNameList.add(storeName);
			}
		    for(int i=0;i<storeNameList.size();i++){  
	            if(!storeNames.contains(storeNameList.get(i))){  
	            	storeNames.add(storeNameList.get(i));  
	            }  
	        }  
		    
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (Suggest suggest : suggestlist) {
					String value = (String) suggest.getUserPhone();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    suggest.setUserPhone(turnTelF);
				}
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", suggestlist);
			rs.addContent("policyCount", suggestlist.size());
			rs.addContent("storeNames", storeNames);
			return rs; 
		} catch (Exception e) {
			logger.error("查询所有建议失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}

	
	/** 
	 * 解决建议(bip系统)
	 * 
	 * @return
	 */
	@RequestMapping(value = "/solveSuggest", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse solveSuggest(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		// 获取级别跟踪天数设置信息
		String param = request.getParameter("param");
		String userId = request.getParameter("userId");
		String userName = request.getParameter("userName");
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> map = objectMapper.readValue(param, Map.class);
			Suggest suggest = new Suggest();
			suggest.setId((String)map.get("id"));
			suggest.setUuId((String)map.get("uuId"));
			suggest.setStatus((Integer)map.get("status"));
			suggest.setCustomId(Integer.parseInt(userId));
			suggest.setDisContent((String)map.get("disContent"));
			suggestService.updateSuggest(suggest,Integer.parseInt(userId),userName);
            Suggest sugg = new Suggest();
            MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
    		FindIterable findIterable = collection.find(new Document("uuId", (String)sugg.getUuId()));
    	    MongoCursor cursor = findIterable.iterator();
    	    while (cursor.hasNext()) {
    	    	Document doc = (Document) cursor.next();
    	    	sugg = MongoDBUtil.documtToSuggest(doc, sugg);
    		}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
            rs.addContent("sugg", sugg);
			rs.setMessage("解决建议成功！");
		} catch (Exception e) {
			logger.error("解决建议失败,程序异常！"+e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("解决建议失败,程序异常！");
			return rs;
		}
		return rs;
	}
	
	/** 
	 * 解决建议(bomp系统)
	 * 
	 * @return
	 */
	@RequestMapping(value = "/solveSuggestBomp", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse solveSuggestBomp(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		Suggest newsugg = new Suggest();
		String id = request.getParameter("id");
		String uuId = request.getParameter("uuId");
		String status = request.getParameter("status");
		String userId = request.getParameter("userId");
		String userName = request.getParameter("userName");
		String disContent = request.getParameter("disContent");
		try {
			newsugg.setId(id);
			newsugg.setUuId(uuId);
			newsugg.setStatus(Integer.parseInt(status));
			newsugg.setDisContent(disContent);
			suggestService.solveSuggestBomp(newsugg,9999,userName);//9999代表bomp的客服操作（bomp里面是UUID，这边试int类型的，作用不大）
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("解决建议成功！");
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			logger.error("解决建议失败,程序异常！"+e);
			return rs;
		}
		return rs;
	}
	//查询自己提的建议
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/findAllSuggestByUserId", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse findAllSuggestByUserId(HttpServletRequest request,HttpServletResponse response) throws Exception{
		BaseResponse rs = new BaseResponse();
		String searchDatas = request.getParameter("condition");
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> map =null;
		Map<String,Object> param = new HashMap<String,Object>();
		try {
			map = objectMapper.readValue(searchDatas, Map.class);
			MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
		    //指定查询过滤器查询
			BasicDBObject basicDBObject = new BasicDBObject();
			basicDBObject = queryCondition(map, basicDBObject);
			basicDBObject.put("userId", (Integer)map.get("userId"));
			FindIterable find = collection.find(basicDBObject);
		    MongoCursor cursor = find.iterator();
		    List<Suggest> suggestlist = new ArrayList<>();
		    int policyCount = 0;
		    while (cursor.hasNext()) {
		    	Document doc = (Document) cursor.next();
		    	 Suggest suggest = new Suggest();
		    	 suggest = MongoDBUtil.documtToSuggest(doc, suggest);
				 suggestlist.add(suggest);
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", suggestlist);
			rs.addContent("policyCount", suggestlist.size());

			return rs;
		}catch (Exception e) {
			logger.error("查询自己提的建议失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
	}

	//拼接查询条件
	private BasicDBObject queryCondition(Map<String, Object> map, BasicDBObject basicDBObject) throws ParseException {
		if(map.get("status")!=null && map.get("status")!=""){
		    basicDBObject.put("state", Integer.parseInt(map.get("status").toString()));
		}
		if(map.get("title")!=null && map.get("title")!=""){
		    basicDBObject.put("title", map.get("title").toString());
		}
		//反馈日期查询条件
		if((map.get("proposeTimeStartTime")!=null && !"".equals(map.get("proposeTimeStartTime"))) 
				&& (map.get("proposeTimeEndTime")==null || "".equals(map.get("proposeTimeEndTime")))){
			DBObject queryTime = new BasicDBObject("$gte", DateUtil.toDate(map.get("proposeTimeStartTime").toString()));
		    basicDBObject.put("recordTime", queryTime);
		}
		if((map.get("proposeTimeEndTime")!=null && !"".equals(map.get("proposeTimeEndTime"))) 
				&& (map.get("proposeTimeStartTime")==null || "".equals(map.get("proposeTimeStartTime")))){
			DBObject queryTime = new BasicDBObject("$lte", DateUtil.toDate(map.get("proposeTimeEndTime").toString()));
		    basicDBObject.put("recordTime", queryTime);
		}
		if((map.get("proposeTimeStartTime")!=null && !"".equals(map.get("proposeTimeStartTime"))) 
				&& (map.get("proposeTimeEndTime")!=null && !"".equals(map.get("proposeTimeEndTime")))){
			DBObject queryTime = new BasicDBObject("$gte", DateUtil.toDate(map.get("proposeTimeStartTime").toString()))
					.append("$lte", DateUtil.toDate(map.get("proposeTimeEndTime").toString()));
		    basicDBObject.put("recordTime", queryTime);
		}
		//处理日期查询条件
		if((map.get("solveTimeStartTime")!=null && !"".equals(map.get("solveTimeStartTime"))) 
				&& (map.get("solveTimeEndTime")==null || "".equals(map.get("solveTimeEndTime")))){
			DBObject queryTime = new BasicDBObject("$gte", DateUtil.toDate(map.get("solveTimeStartTime").toString()));
		    basicDBObject.put("responseTime", queryTime);
		}
		if((map.get("solveTimeEndTime")!=null && !"".equals(map.get("solveTimeEndTime")))
				&& (map.get("solveTimeStartTime")==null || "".equals(map.get("solveTimeStartTime")))){
			DBObject queryTime = new BasicDBObject("$lte", DateUtil.toDate(map.get("solveTimeEndTime").toString()));
		    basicDBObject.put("responseTime", queryTime);
		}
		if((map.get("solveTimeStartTime")!=null && !"".equals(map.get("solveTimeStartTime"))) 
				&& (map.get("solveTimeEndTime")!=null && !"".equals(map.get("solveTimeEndTime")))){
			DBObject queryTime = new BasicDBObject("$gte", DateUtil.toDate(map.get("solveTimeStartTime").toString()))
					.append("$lte", DateUtil.toDate(map.get("solveTimeEndTime").toString()));
		    basicDBObject.put("responseTime", queryTime);
		}
		return basicDBObject;
	}

}
