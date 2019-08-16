package com.bofide.bip.controller;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.User;
import com.bofide.bip.service.PerformanceService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;

@Controller
@RequestMapping(value="/performance")
public class PerformanceController {
	private static Logger logger = Logger.getLogger(PerformanceController.class);
	@Autowired
	private PerformanceService performanceService;
	@Autowired
	private UserService userService;
	//统计保单新保
	@RequestMapping(value="/statisticalNewInsurance",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse statisticalNewInsurance(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="coverType") Integer coverType,
			@RequestParam(name="statisticTime") String statisticTime){
		BaseResponse rs = new BaseResponse();
		List<Map<String,Object>> listMap = null;
		try {
			
			//根据店id和角色id查询所有销售顾问
			Integer statisticalRoleId = RoleType.XSGW;
			List<User> userList = userService.selectByStoreIdAndRoleId(storeId,statisticalRoleId);
			//查询每个用户的保单信息
			listMap = performanceService.statisticalNewInsur(userList,statisticTime,coverType);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("listMap", listMap);
			return rs; 
		} catch (Exception e) {
			logger.info("新保统计查询失败：",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败！");
			return rs; 
		}
	} 
	
	////统计新转续，间转续，潜转续，续转续
	@RequestMapping(value="/statisticalByRenewalType",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse statisticalByRenewalType(@RequestParam(name="renewalType") Integer renewalType,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="statisticTime") String statisticTime){
		BaseResponse rs = new BaseResponse();
		
		//根据该主管的id寻找其所有下属
		try {
			if(renewalType == 0){//续保汇总
				renewalType = null;
			}
			//如果是保险经理或者是总经理的用户
			List<User> userList = null;
			if(roleId == 22){
				roleId = 11;
			}
			if(roleId == 41 || roleId == 42 || roleId == 43 || roleId == 44 || roleId == 45 || roleId == 46
                    || roleId == 47 || roleId == 48 || roleId == 49 || roleId == 50 || roleId == 51 || roleId == 52 || roleId == 53
                    || roleId == 54 || roleId == 55 || roleId == 56 || roleId == 57 || roleId == 58 || roleId == 59){
				roleId = 16;
			}
			if(roleId == 11 || roleId == 10||roleId == 16){
				Integer RCroleId = 2;
				userList = userService.selectByStoreIdAndRoleId(storeId,RCroleId);
			}else{
				//根据该主管的id寻找其所有下属
				userList = performanceService.findStatisticaUndering(roleId,storeId);
			}
			//统计userList下的每个user下的潜客统计信息
			List<Map<String,Object>> listMap = performanceService.statistical(renewalType,userList,statisticTime,storeId);
			rs.setSuccess(true);
			rs.addContent("listMap", listMap);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.info("潜客统计失败",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败！");
		}
		
		return rs; 
	}
}
