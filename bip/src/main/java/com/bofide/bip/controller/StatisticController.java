package com.bofide.bip.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.service.StatisticService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.StatisticsUtil;

@Controller
@RequestMapping(value = "/statistic")
public class StatisticController  extends BaseResponse {
	
	private static Logger logger = Logger.getLogger(StatisticController.class);
	@Autowired
	private StatisticService statisticService;
	
	/**
	 * 保险信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findInsuranceStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInsuranceStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findInsuranceStatistics(map);
			Map<String, Object> sumMap = StatisticsUtil.getStatisticsSum(maps);
			maps.add(sumMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("保险信息统计查询失败:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 售后信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findServiceStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findServiceStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findServiceStatistics(map);
			Map<String, Object> sumMap = StatisticsUtil.getStatisticsSum(maps);
			maps.add(sumMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("售后信息统计查询失败:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 销售信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findSaleStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSaleStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findSaleStatistics(map);
			Map<String, Object> sumMap = StatisticsUtil.getStatisticsSum(maps);
			maps.add(sumMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("销售信息统计查询失败:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	
	/**
	 * 续保专员保险信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findRCInsuranceStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRCInsuranceStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name = "userId") Integer userId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			map.put("userId", userId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findRCInsuranceStatistics(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("续保专员保险信息统计查询失败: " + e.getMessage());
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 服务顾问售后信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findSAServiceStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSAServiceStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name = "userId") Integer userId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			map.put("userId", userId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findSAServiceStatistics(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("服务顾问售后信息统计查询失败: " + e.getMessage());
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 销售顾问销售信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findSCSaleStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSCSaleStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name = "userId") Integer userId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			map.put("userId", userId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findSCSaleStatistics(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("销售顾问销售信息统计查询失败: " + e.getMessage());
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 客服统计查询
	 * @return 
	 */
	@RequestMapping(value="/findCSCStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCSCStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> maps = statisticService.findCSCStatistics(map);
			Map<String, Object> sumMap = StatisticsUtil.getStatisticsSum(maps);
			maps.add(sumMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", maps);
			return rs; 
		} catch (Exception e) {
			logger.error("客服信息统计查询失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 客服专员客服信息统计查询
	 * @return 
	 */
	@RequestMapping(value="/findCSCUserStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCSCUserStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "userId") Integer userId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			map.put("userId", userId);
			Map<String, Object> resMap = statisticService.findCSCUserStatistics(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resMap);
			return rs; 
		} catch (Exception e) {
			logger.error("客服专员客服信息统计查询失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 出单员统计查询
	 * @return 
	 */
	@RequestMapping(value="/findIWStatistics",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findIWStatistics(@RequestParam(name = "startDate") String startDate,
			@RequestParam(name = "endDate") String endDate,
			@RequestParam(name = "storeId") Integer storeId,
			@RequestParam(name="showAll") boolean showAll) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			if(showAll == true){
				map.put("startDate", null);
				map.put("endDate", null);
			}else{
				map.put("startDate", startDate);
				map.put("endDate", endDate);
			}
			List<Map<String, Object>> resultMaps = statisticService.findIWStatistics(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMaps);
			return rs; 
		} catch (Exception e) {
			logger.error("客服信息统计查询失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	
}
