package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.Jpush;

public interface JpushMapper {
	/**
	 * 根据条件查询需要推送的用户及设备
	 * @param map
	 * @return
	 */
	List<Jpush> selectAll(Map<String, Object> map) throws Exception;
	
	/**
	 * 新增需要推送的用户及设备
	 * @param map
	 * @return
	 */
	int insert(Map<String, Object> map) throws Exception;
	
	/**
	 * 更新需要推送的用户及设备
	 * @param map
	 * @return
	 */
	int update(Map<String, Object> map) throws Exception;
	
	/**
	 * 清空某设备id的信息
	 * @param map
	 * @return
	 */
	int updateCleanRegistrationId(Map<String, Object> map) throws Exception;
	
	/**
	 * 根据用户id查询极光推送用户
	 * @param param
	 * @return map
	 * @throws Exception
	 */
	List<Map<String, Object>> findJPushUserInfoByUserId(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据设备id查询极光推送用户
	 * @param param
	 * @return map
	 * @throws Exception
	 */
	List<Map<String, Object>> findJPushUserInfoByRegistrationId(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据用户ID查询用户信息以及是否开启客服模块
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> findUserstau(Integer userId) throws Exception;
}
