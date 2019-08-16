package com.bofide.bip.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.CoverType;
import com.bofide.bip.po.Message;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.SystemMessage;
import com.bofide.bip.po.User;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;


/**
 * 公共方法类
 * 
 * @author huliangqing
 */
@Controller
@RequestMapping(value = "/common")
public class CommonController  extends BaseResponse{
	
	private static Logger logger = Logger.getLogger(UserController.class);

	@Autowired
	private CommonService commonService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private UserService userService;
	/**
	 * 查询所有承保类型
	 * @return 
	 */
	@RequestMapping(value="/findAllCoverType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllCoverType(HttpServletRequest request, HttpServletResponse response){
		
		List<CoverType> coverTypes = commonService.findAllCoverType();
		BaseResponse rs = new BaseResponse();
		rs.setSuccess(true);
				
		rs.addContent("status", "OK");
		rs.addContent("results", coverTypes);
		return rs; 
	}
	
	/**
	 * 根据用户查询数量(应跟踪/未接收/待审批/将脱保/已脱保)
	 * @return 
	 */
	@RequestMapping(value="/findCountByUserId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountByUserId(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="bspStoreId") Integer bspStoreId,
			@RequestParam(name="bangStatu") Integer bangStatu){
		
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Integer> resultMap = commonService.findCountByUserId(userId,storeId,roleId,bspStoreId,bangStatu);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs; 
		} catch (Exception e) {
			logger.info("根据用户查询数量失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据用户查询数量失败");
			return rs; 
		}
	}
	
	/**
	 * 根据用户id查询未读消息
	 * @return 
	 */
	@RequestMapping(value="/findMessage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findMessage(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId){
		
		BaseResponse rs = new BaseResponse();
		try {
			//查询未读消息
			List<Message> messageList = commonService.findMessageByUserId(userId,roleId);
			//将未读消息标记为已读
			commonService.updateReadStatus(userId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", messageList);
			return rs; 
		} catch (Exception e) {
			logger.error("根据用户id查询消息失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据用户id查询消息失败");
			return rs; 
		}
	}
	
	/**
	 * 查询系统消息
	 * @return 
	 */
	@RequestMapping(value="/findSysMessage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSysMessage(@RequestParam(name="userId") Integer userId){
		
		BaseResponse rs = new BaseResponse();
		try {
			//查询该用户是属于哪家店
			User user= userService.findUserById(userId);
			Integer storeId = user.getStoreId();
			Integer roleId = user.getRoleId();
			//查询未读消息
			List<SystemMessage> messageList = commonService.findSystemMessage(storeId,roleId);
			//更新用户表
			if(messageList != null && messageList.size() > 0){
				Integer sysMessageId = messageList.get(0).getSysMessageId();
				commonService.updateUserSysMessageId(userId, sysMessageId);
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", messageList);
			return rs; 
		} catch (Exception e) {
			logger.error("查询系统消息失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询消息失败");
			return rs; 
		}
	}
	
	/**
	 * 新增系统消息
	 * @return 
	 */
	@RequestMapping(value="/insertSysMessage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insertSysMessage(@RequestParam(name="content") String content){
		
		BaseResponse rs = new BaseResponse();
		try {
			//新增系统消息
			Map<String,Object> param = commonService.insertSystemMessage(content);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", param);
			return rs; 
		} catch (Exception e) {
			logger.error("新增系统消息失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增消息失败");
			return rs; 
		}
	}
	
	/**
	 * 删除系统消息
	 * @return 
	 */
	@RequestMapping(value="/deleteSysMessage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteSysMessage(@RequestParam(name="sysMessageId") Integer sysMessageId){
		
		BaseResponse rs = new BaseResponse();
		try {
			//删除系统消息
			commonService.deleteSystemMessage(sysMessageId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("删除系统消息失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除消息失败");
			return rs; 
		}
	}
	
	/**
	 * 根据店id查询店信息
	 * @return 
	 */
	@RequestMapping(value="/findStoreById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findStoreById(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//根据店id查询店信息
			Store store = storeService.findStoreById(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", store);
			return rs; 
		} catch (Exception e) {
			logger.error("根据店id查询店信息失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * APP首页查询各业务的数量(今日到店/今日出单/回退待审批/延期待审批/未接收/应跟踪/发起邀约/到店未出单/将脱保/已脱保)
	 * @return 
	 */
	@RequestMapping(value="/findHomePageCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findHomePageCount(HttpServletRequest request, HttpServletResponse response){
		logger.info("开始进入路由/common/findHomePageCount");
		BaseResponse rs = new BaseResponse();
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		try {
			Map<String,Integer> resultMap = commonService.findHomePageCount(userId,storeId,roleId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs; 
		} catch (Exception e) {
			logger.info("APP首页查询各业务的数量失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("APP首页查询各业务的数量失败");
			return rs; 
		}
	}
}
