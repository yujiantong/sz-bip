package com.bofide.bip.controller;


import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.BspStore;
import com.bofide.bip.po.BspUser;
import com.bofide.bip.po.User;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.SysnService;
import com.bofide.bip.service.UserService;
import com.bofide.bip.vo.UserVo;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.SecurityEncodeUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/sysn")
public class SysnController extends BaseResponse {
	private static Logger logger = Logger.getLogger(SysnController.class);
	@Autowired
	private SysnService sysnService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private UserService userService;
	/**
	 * 查询bsp同步过来的所有店
	 * @return
	 */
	@RequestMapping(value="/findBspStore",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findBspStore(){
		BaseResponse rs = new BaseResponse();
		try {
			List<BspStore> list = sysnService.findBspStore();
			rs.setSuccess(true);
			rs.addContent("result",list);
			rs.setMessage("绑定成功！");
		} catch (Exception e) {
			logger.info("查询绑定bsp店失败",e);
			e.printStackTrace();
			rs.setSuccess(false);
			rs.setMessage("绑定失败！");
		}
		return rs;
	}
	
	/**
	 * 将bsp的店绑定带bip的店中
	 */
	@RequestMapping(value="/sysnBspStore",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse sysnBspStore(@RequestParam(name="bspStoreName") String bspStoreName,
			@RequestParam(name="bspStoreId") Integer bspStoreId,//需要同步的bsp的店id
			@RequestParam(name="storeId") Integer storeId){//需要同步的bip的店id
		BaseResponse rs = new BaseResponse();
		try {
			if(bspStoreId == null){
				rs.setSuccess(false);
				rs.setMessage("没有同步的店的id，绑定失败！");
				return rs;
			}
			//校验传过来的bspStoreId是否已经绑定过了
			boolean bspStoreIsBind = storeService.findCheckBspStoreIsBang(bspStoreId);
			//校验传过来的bipStore是否已经绑定过了
			boolean bipStoreIsBind = storeService.findCheckBipStoreIsBang(storeId);
			//只要任意一家店绑定过都不能绑定成功
			if(bspStoreIsBind == true || bipStoreIsBind == true){
				rs.setSuccess(false);
				rs.setMessage("绑定失败！");
				return rs;
			}
			storeService.updateBipStore(bspStoreId,storeId);
			rs.setSuccess(true);
			rs.setMessage("绑定成功！");
		} catch (Exception e) {
			logger.info("绑定bsp店失败",e);
			rs.setSuccess(false);
			rs.setMessage("绑定失败！");
		}
		return rs;
	}
	
	/**
	 * 删除bip店中绑定的bsp店
	 */
	@RequestMapping(value="/delBangedBspStore",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse delBangedBspStore(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			if(storeId == null){
				rs.setSuccess(false);
				rs.setMessage("解绑的店id没有，解绑失败！");
				return rs;
			}
			
			storeService.delBangedBspStore(storeId);
			rs.setSuccess(true);
			rs.setMessage("解绑成功！");
		} catch (Exception e) {
			logger.info("解绑失败",e);
			rs.setSuccess(false);
			rs.setMessage("解绑失败！");
		}
		return rs;
	}
	
	/**
	 * 检查该店是否已经绑定过
	 *
	 */
	@RequestMapping(value="/checkStoreIsBang",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse checkStoreIsBang(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			boolean isBang = storeService.findCheckIsBang(storeId);
			rs.setSuccess(true);
			rs.addContent("result", isBang);
			rs.setMessage("检查绑定成功！");
		} catch (Exception e) {
			logger.info("检查绑定失败",e);
			rs.setSuccess(false);
			rs.setMessage("检查绑定失败！");
		}
		return rs;
	}
	
	
	/**
	 * 绑定用户
	 * @param bangParam
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/sysnBspUser",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse sysnBspUser(@RequestParam(name="bangParam") String bangParam){
		BaseResponse rs = new BaseResponse();
		Map<String,Object> bangParamMap = null;
		try {
			if(bangParam == null){
				rs.setSuccess(false);
				rs.setMessage("没有绑定参数，绑定用户失败！");
				return rs;
			}
			ObjectMapper objectMapper = new ObjectMapper();
			bangParamMap = objectMapper.readValue(bangParam, Map.class);
			List<Map<String,Object>> bindUsers  = (List<Map<String, Object>>) bangParamMap.get("bangUsers");
			Integer bipStoreId = (Integer)bangParamMap.get("storeId");
			//检查店是否有绑定
			boolean storeIsBind = storeService.findCheckIsBang(bipStoreId);
			if(storeIsBind == false){
				rs.setSuccess(false);
				rs.setMessage("店没有绑定，绑定用户失败！");
				return rs;
			}
			List<Map<String, Object>> messageList = userService.updateBang(bindUsers,bipStoreId);
			if(messageList.size() <= 0){
				rs.setSuccess(true);
				rs.setMessage("绑定用户成功！");
			}else{
				rs.setSuccess(false);
				StringBuffer sb = new StringBuffer();
				sb.append("bip绑定用户信息：");
				StringBuffer sb2 = new StringBuffer();
				sb2.append("bsp绑定用户信息：");
				for(Map<String,Object> message : messageList){
					String bipUserMessage = (String)message.get("bipUserMessage");
					String bspUserMessage = (String)message.get("bspUserMessage");
					sb.append(bipUserMessage);
					sb.append(";");
					sb2.append(bspUserMessage);
					sb2.append(";");
				}
				String message = sb.append(sb2).toString();
				rs.setMessage("不能重复绑定用户！");
			}
			
		} catch (Exception e) {
			logger.info("绑定用户失败",e);
			rs.setSuccess(false);
			rs.setMessage("绑定用户失败！");
		}
		return rs;
	}
	
	
	/**
	 * 解除绑定的用户
	 * @param bangParam
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/delBangedBspUser",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse delBangedBspUser(@RequestParam(name="delBangParam") String delBangParam){
		BaseResponse rs = new BaseResponse();
		Map<String,Object> delBangParamMap = null;
		try {
			if(delBangParam == null){
				rs.setSuccess(false);
				rs.setMessage("解除绑定用户失败！");
				return rs;
			}
			ObjectMapper objectMapper = new ObjectMapper();
			delBangParamMap = objectMapper.readValue(delBangParam, Map.class);
			Integer bipStoreId = (Integer)delBangParamMap.get("storeId");
			//检查店是否有绑定
			boolean storeIsBind = storeService.findCheckIsBang(bipStoreId);
			if(storeIsBind == false){
				rs.setSuccess(false);
				rs.setMessage("店没有绑定，解绑用户失败！");
				return rs;
			}
			userService.delBangedBspUser(delBangParamMap);
			rs.setSuccess(true);
			rs.setMessage("解绑用户成功！");
		} catch (Exception e) {
			logger.info("解绑用户失败",e);
			rs.setSuccess(false);
			rs.setMessage("解绑用户失败！");
		}
		return rs;
	}
	
	/**
	 * 根据bip的店id查询没有绑定好的bsp用户
	 * @param bangParam
	 * @return
	 */
	@RequestMapping(value="/findNoBangedUser",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findNoBangedUser(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			if(storeId == null){
				rs.setSuccess(false);
				rs.setMessage("没有店的id，查询用户失败！");
				return rs;
			}
			List<BspUser> list = userService.findNoBangedUser(storeId);
			rs.setSuccess(true);
			rs.addContent("result", list);
			rs.setMessage("查询bsp未绑定用户成功！");
		} catch (Exception e) {
			logger.info("查询bsp未绑定用户失败",e);
			rs.setSuccess(false);
			rs.setMessage("查询bsp未绑定用户失败！");
		}
		return rs;
	}
	
	/**
	 * 根据bip的店id查询所有的用户（前提是bip的店已经和bsp店绑定好了）
	 * @return
	 */
	@RequestMapping(value="/findBipBspUser",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findBipBspUser(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			if(storeId == null){
				rs.setSuccess(false);
				rs.setMessage("没有店的id，查询用户失败！");
				return rs;
			}
			Map<String,Object> map = userService.findBipBspUser(storeId);
			rs.setSuccess(true);
			rs.addContent("result", map);
			rs.setMessage("查询bip和bsp成功！");
		} catch (Exception e) {
			logger.info("查询bip和bsp用户失败",e);
			rs.setSuccess(false);
			rs.setMessage("查询bip和bsp用户失败！");
		}
		return rs;
	}
	
	/**
	 * bsp单点登录接口
	 * bspEncryptLoginInfo 是bsp传递过来加密后的登录信息
	 * bspDecryptLoginInfo 是经过特地的协议解密后的登录信息
	 */
	@RequestMapping(value="/loginFromBsp",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse loginFromBsp(@RequestParam(name="bspEncryptLoginInfo") String bspEncryptLoginInfo){
		BaseResponse rs = new BaseResponse();
		try {
			
			String bspDecryptLoginInfo  = SecurityEncodeUtils.decryptAES(SecurityEncodeUtils.BOFIDE_KEY,bspEncryptLoginInfo);
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> map = (Map<String, Object>)objectMapper.readValue(bspDecryptLoginInfo, Map.class);
			//判断bsp的服务器时间是否与bip的服务器时间大概一致
			String bspTimeStr = (String)map.get("time");
			Long bspTime = Long.valueOf(bspTimeStr).longValue();
			//获取bip服务器的时间
			Long preDate = new Date().getTime();
			Long TenMinTime = 5*60*1000L;
			Long beforeDate = preDate - TenMinTime;
			Long afterDate = preDate + TenMinTime;
			if(bspTime >= afterDate || bspTime <= beforeDate){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("链接已失效！");
				return rs;
			}
			Map<String,Object> bindInfo = sysnService.findBipUserByBspUserId(map);
			int loginStatus = (int)bindInfo.get("loginStatus");
			String bindMessage = (String)bindInfo.get("bindMessage");
			User bipUser = (User)bindInfo.get("bipUser");
			if(loginStatus == 1){
				Integer bipUserId = bipUser.getId();
				UserVo user = userService.selectUserInfoByBipUserId(bipUserId);
				if(user != null){
					rs.setSuccess(true);
					rs.addContent("status", "OK");
					rs.addContent("result", user);
					rs.setMessage(bindMessage);
				}else{
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.addContent("result", user);
					rs.setMessage(bindMessage);
				}
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage(bindMessage);
			}
			
		} catch (IllegalBlockSizeException e) {
			logger.info("传递参数有误！");
			rs.setSuccess(false);
			rs.setMessage("传递参数有误！");
		} catch (BadPaddingException e) {
			logger.info("密钥有误，解密失败！");
			rs.setSuccess(false);
			rs.setMessage("密钥有误，解密失败！");
		}catch (NumberFormatException e) {
				logger.info("登陆失败！传递参数有误！");
				logger.info("参数有误，传递参数为："+bspEncryptLoginInfo);
				rs.setSuccess(false);
				rs.setMessage("登陆失败！传递参数有误！");
		}catch (Exception e) {
			logger.info("登陆失败",e);
			logger.info("参数有误，传递参数为："+bspEncryptLoginInfo);
			rs.setSuccess(false);
			rs.setMessage("登陆失败！");
		}
		return rs;
	}
	
	/**
	 * 查询工作量的接口
	 */
	@RequestMapping(value="/findBipWork",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findBipWork(@RequestParam(name="bspEncryptLoginInfo") String bspEncryptLoginInfo){
		BaseResponse rs = new BaseResponse();
		try {
			String bspDecryptLoginInfo  = SecurityEncodeUtils.decryptAES(SecurityEncodeUtils.BOFIDE_KEY,bspEncryptLoginInfo);
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> map = (Map<String, Object>)objectMapper.readValue(bspDecryptLoginInfo, Map.class);
			Object bspStoreId_o = map.get("bsp_storeId");
			Integer bspStoreId = Integer.parseInt(bspStoreId_o==null?"":bspStoreId_o.toString());
			Object bspUserId_o = map.get("bsp_userId");
			Integer bspUserId = Integer.parseInt(bspUserId_o==null?"":bspUserId_o.toString());
			
			//判断bsp的服务器时间是否与bip的服务器时间大概一致
			String bspTimeStr = (String)map.get("time");
			Long bspTime = Long.valueOf(bspTimeStr).longValue();
			//获取bip服务器的时间
			Long preDate = new Date().getTime();
			Long TenMinTime = 5*60*1000L;
			Long beforeDate = preDate - TenMinTime;
			Long afterDate = preDate + TenMinTime;
			if(bspTime >= afterDate || bspTime <= beforeDate){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("链接已失效！");
				return rs;
			}
			
			Map<String, Object> info = sysnService.findBipWork(bspStoreId,bspUserId);
			boolean hasToDo = (boolean)info.get("hasToDo");
			String bindMessage = (String)info.get("bindMessage");
			Integer loginStatus = (Integer)info.get("loginStatus");
			if(loginStatus == 1){
				rs.setSuccess(true);
				rs.addContent("hasToDo", hasToDo);
				rs.setMessage(bindMessage);
			}else{
				rs.setSuccess(false);
				rs.addContent("hasToDo", hasToDo);
				rs.setMessage(bindMessage);
			}
		}catch (IllegalBlockSizeException e) {
			logger.info("传递参数有误！");
			rs.setSuccess(false);
			rs.setMessage("传递参数有误！");
		}catch (BadPaddingException e) {
			logger.info("密钥有误，解密失败！");
			rs.setSuccess(false);
			rs.setMessage("密钥有误，解密失败！");
		}catch (NumberFormatException e) {
			logger.info("传递参数有误");
			logger.info("参数有误，传递参数为："+bspEncryptLoginInfo);
			rs.setSuccess(false);
			rs.setMessage("传递参数有误");
		}catch (Exception e) {
			logger.info("参数有误，传递参数为："+bspEncryptLoginInfo,e);
			rs.setSuccess(false);
			rs.setMessage("参数有误！"+e);
		}
		return rs;
	}
	
	/**
	 * 查询用户绑定详情
	 */
	@RequestMapping(value="/findBindUserById",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findBindUserById(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userId") Integer userId){
		BaseResponse rs = new BaseResponse();
		try {
			User user = userService.findBindUserById(storeId,userId);
			rs.setSuccess(true);
			rs.addContent("result", user);
			rs.setMessage("查询用户绑定详情成功！");
		} catch (Exception e) {
			logger.info("查询用户绑定详情失败",e);
			rs.setSuccess(false);
			rs.setMessage("查询用户绑定详情！");
		}
		return rs;
	}
}
