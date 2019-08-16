package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.SuggestMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Suggest;
import com.bofide.bip.po.User;
import com.bofide.common.util.MongoDBUtil;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
@SuppressWarnings("all")
@Service(value = "suggestService")
public class SuggestService {
	@Resource(name="suggestMapper")
	private SuggestMapper suggestMapper;
	@Resource(name="commonService")
	private CommonService commonService;
	@Resource(name="userMapper")
	private UserMapper userMapper;
	
	//查询所有
	public Suggest selectSuggestById(Integer id) throws Exception {
		Suggest suggest = suggestMapper.selectSuggestById(id);
		return suggest;
	}
	//查询所有
	public List<String> selectAllStoreName() throws Exception {
		List<String> list = suggestMapper.selectAllStoreName();
		return list;
	}
	//查询所有
	public List<Suggest> selectAllSuggest(Map<String, Object> map) throws Exception {
		List<Suggest> list = suggestMapper.selectAllSuggest(map);
		return list;
	}
	//查询所有个数
	public Integer countAllSuggest(Map<String, Object> map) throws Exception {
		Integer num = suggestMapper.countAllSuggest(map);
		return num;
	}
	//根据建议id更新建议状态
	
	public void updateSuggest(Suggest newsugg,Integer userId,String userName) throws Exception{
		Suggest oldsugg = new Suggest();
	    //获取集合
	    MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
		FindIterable findIterable = collection.find(new Document("uuId", (String)newsugg.getUuId()));
	    MongoCursor cursor = findIterable.iterator();
	    while (cursor.hasNext()) {
	    	Document doc = (Document) cursor.next();
	    	oldsugg = MongoDBUtil.documtToSuggest(doc, oldsugg);
		}
		
		User user = userMapper.findUserById(oldsugg.getUserId());
		//suggestMapper.updateSuggest(newsugg);改为修改MongoDB库
		//修改过滤器
	    Bson filter = Filters.eq("uuId", (String)newsugg.getUuId());
	    //指定修改的更新文档
	    Document reposeDesc = new Document("$set", new Document("reposeDesc", newsugg.getDisContent()));
	    collection.updateOne(filter, reposeDesc);
	    Document state = new Document("$set", new Document("state", newsugg.getStatus()));
	    collection.updateOne(filter, state);
	    Document responseTime = new Document("$set", new Document("responseTime", new Date()));
	    collection.updateOne(filter, responseTime);
	    Document responseUserId = new Document("$set", new Document("responseUserId", userId));
	    collection.updateOne(filter, responseUserId);
	    Document responseUserName = new Document("$set", new Document("responseUserName", "BIP客服-"+userName+"(672)"));
	    collection.updateOne(filter, responseUserName);
	    
		if(user!=null&&user.getId()!=null){
			Calendar calendar = Calendar.getInstance();
			int month = calendar.get(Calendar.MONTH) + 1;
			int day = calendar.get(Calendar.DAY_OF_MONTH);
			String content = "您"+ month +"月"+ day +"日提出的建议'"+ oldsugg.getTitle() +"'";
			if(oldsugg.getStatus()==0){
				content = content+"已被回复: "+newsugg.getDisContent();
			}else{
				if(newsugg.getStatus()==0){
					content = content+"被修改为未解决";
				}else{
					content = content+"的回复内容:'"+oldsugg.getDisContent()+"'被修改成:'"+newsugg.getDisContent()+"'";
				}
			}
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", user.getStoreId());
			param.put("userId", user.getId());
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			commonService.insertMessage(param);
		}
	}
	// 解决建议(bomp系统)
	public void solveSuggestBomp(Suggest newsugg,Integer userId,String userName) throws Exception{
		Suggest oldsugg = new Suggest();
	    //获取集合
	    MongoCollection<Document> collection = MongoDBUtil.getConnectAndCollection();
		FindIterable findIterable = collection.find(new Document("uuId", (String)newsugg.getUuId()));
	    MongoCursor cursor = findIterable.iterator();
	    while (cursor.hasNext()) {
	    	Document doc = (Document) cursor.next();
	    	oldsugg = MongoDBUtil.documtToSuggest(doc, oldsugg);
		}
	    User user = userMapper.findUserById(oldsugg.getUserId());
		if(user!=null&&user.getId()!=null){
			Calendar calendar = Calendar.getInstance();
			int month = calendar.get(Calendar.MONTH) + 1;
			int day = calendar.get(Calendar.DAY_OF_MONTH);
			String content = "您"+ month +"月"+ day +"日提出的建议'"+ oldsugg.getTitle() +"'";
			if(oldsugg.getStatus()==0){
				content = content+"已被回复: "+newsugg.getDisContent();
			}else{
				if(newsugg.getStatus()==0){
					content = content+"被修改为未解决";
				}else{
					content = content+"的回复内容:'"+oldsugg.getDisContent()+"'被修改成:'"+newsugg.getDisContent()+"'";
				}
			}
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", user.getStoreId());
			param.put("userId", user.getId());
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			commonService.insertMessage(param);
		}
	}
	//新增建议
	public void insertSuggest(Suggest suggest) throws Exception{
		suggestMapper.insertSuggest(suggest);
	}
	
	//查询自己提的建议
	public List<Suggest> findAllSuggestByUserId(Map<String,Object> map){
		List<Suggest> list = suggestMapper.findAllSuggestByUserId(map);
		return list;
	}
	
	//查询自己提的建议的数目
	public int findAllSuggestByUserIdCount(Map<String,Object> map){
		int count = suggestMapper.findAllSuggestByUserIdCount(map);
		return count;
	}
}
