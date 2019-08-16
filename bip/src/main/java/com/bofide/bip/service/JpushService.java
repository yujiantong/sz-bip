package com.bofide.bip.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.JpushMapper;
import com.bofide.bip.po.Jpush;

@Service(value = "jpushService")
public class JpushService {
	@Resource(name = "jpushMapper")
	private JpushMapper jpushMapper;
	
	/**
	 * 根据条件查询需要推送的用户及设备
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Jpush> selectAll(Map<String, Object> map) throws Exception{
		return jpushMapper.selectAll(map);
	}
	
	/**
	 * 新增需要推送的用户及设备
	 * @param map
	 * @throws Exception
	 */
	public void insert(Map<String, Object> map) throws Exception{
		Integer userId = map.get("userId")==null ? 0 : Integer.valueOf(map.get("userId").toString());
		String registrationId = map.get("registrationId")==null ? "" : map.get("registrationId").toString();
		Map<String, Object> userMap = new HashMap<>();
		userMap.put("registrationId", registrationId);
		List<Map<String,Object>> existRegistList = jpushMapper.findJPushUserInfoByRegistrationId(userMap);
		if(existRegistList.size()>0){
			//如果设备id已经存在, 先全部清空
			if(!"0".equals(registrationId)){
				jpushMapper.updateCleanRegistrationId(userMap);
			}
		}
		userMap.put("userId", userId);
		List<Map<String,Object>> existList = jpushMapper.findJPushUserInfoByUserId(userMap);
		//如果该用户已经存在, 则更新成最新的, 否则新增
		if(existList.size()>0){
			map.put("updateDate", new Date());
			jpushMapper.update(map);
		}else{
			jpushMapper.insert(map);
		}
	}
	
	/**
	 * 更新需要推送的用户及设备
	 * @param map
	 * @throws Exception
	 */
	public void update(Map<String, Object> map) throws Exception{
		jpushMapper.update(map);
	}
	
	/**
	 * 根据用户ID查询用户信息以及是否开启客服模块
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> findUserstau(Integer userId) throws Exception{
		return jpushMapper.findUserstau(userId);
	}
}
