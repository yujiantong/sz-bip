package com.bofide.bip.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.SystemMessage;

public interface SystemMessageMapper {
	
	/**
     * 新增通知消息
     */
	int insert(SystemMessage message)throws Exception;
	
	/**
     * 修改通知消息阅读状态
     */
	int deleteMessage(@Param("sysMessageId")Integer sysMessageId)throws Exception;
	
	/**
     * 查询未读系统消息
     */
	List<SystemMessage> selectMessage(@Param("storeId")Integer storeId,
			@Param("roleId")Integer roleId)throws Exception;
	
	/**
     * 根据消息id查询未读通知消息数量
     */
	int selectMessageCount(@Param("sysMessageId")Integer sysMessageId,
			@Param("storeId")Integer storeId,@Param("roleId")Integer roleId)throws Exception;
	/**
	 * 查询时间段内的系统通知(余额为0或少于10的 ，如果发送过同样的通知，20天后再发)
	 * @param storeId
	 * @param content
	 * @param date
	 * @return
	 */
	int findSystemMessageTime(@Param("storeId")Integer storeId, @Param("content")String content)throws Exception;
    /**
     * 查询时间段内的系统通知(余额少于50的，如果发送过同样的通知，通知30天后再发)
     * @param storeId
     * @param content
     * @param date
     * @return
     */
	int findSystemMessageTimeFifty(@Param("storeId")Integer storeId,@Param("content")String content)throws Exception;

}
