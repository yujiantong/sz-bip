package com.bofide.bip.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Message;

public interface MessageMapper {

	/**
     * 新增通知消息
     */
	int insert(Message message)throws Exception;
	
	/**
     * 修改通知消息阅读状态
     */
	int updateReadStatus(@Param("userId")Integer userId)throws Exception;
	
	/**
     * 根据用户id查询未读通知消息
     */
	List<Message> selectByUserId(@Param("userId")Integer userId)throws Exception;
	
	/**
     * 根据用户id查询未读通知消息数量
     */
	int selectMessageCount(@Param("userId")Integer userId)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;

}
