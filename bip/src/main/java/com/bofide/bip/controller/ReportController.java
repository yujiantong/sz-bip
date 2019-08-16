package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.ReportData;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.ReportService;
import com.bofide.bip.service.StoreService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.LegendUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
@Controller
@RequestMapping(value = "/report")
public class ReportController {
	private static Logger logger = Logger.getLogger(ReportController.class);
	@Autowired
	private ReportService reportService;
    @Autowired
    private StoreService storeService;

	
	
	/**
	 * 获取邀约统计报表的查询日期列表
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findReportSearchTime",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findReportSearchTime(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)param.get("storeId");
			if(storeId == null){
				rs.setSuccess(false);
				rs.setMessage("获取邀约统计报表的查询日期列表数据失败！");
				return rs;
			}
			List<String> list = reportService.findReportSearchTime(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs;
		} catch (Exception e) {
			logger.info("获取邀约统计报表的查询日期列表数据失败",e);
			rs.setSuccess(false);
			rs.setMessage("获取邀约统计报表的查询日期列表数据失败！");
			return rs;
		}
	}
	/**
	 * 获取邀约统计报表-邀约率数据
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findInviteReportData",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInviteReportData(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String selectTime = (String)param.get("selectTime");
			Integer storeId = (Integer)param.get("storeId");
			if(storeId == null || selectTime == null){
				rs.setSuccess(false);
				rs.setMessage("获取邀约统计报表数据失败！");
				return rs;
			}
			List<ReportData> list = LegendUtils.legendSortAndReplace
					(reportService.findInviteReportData(param), "bf_bip_report_day_invite");
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs;
		} catch (Exception e) {
			logger.info("获取邀约统计报表数据失败",e);
			rs.setSuccess(false);
			rs.setMessage("获取邀约统计报表数据失败！");
			return rs;
		}
		
	}
	
	/**
	 * 获取邀约统计报表-到店率数据
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findComeStoreReportData",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findComeStoreReportData(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String startTime = (String)param.get("startTime");
			String endTime = (String)param.get("endTime");
			Integer storeId = (Integer)param.get("storeId");
			if(storeId == null || startTime == null || endTime == null){
				rs.setSuccess(false);
				rs.setMessage("获取邀约统计报表数据失败！");
				return rs;
			}
			List<ReportData> list = LegendUtils.legendSortAndReplace
					(reportService.findComeStoreReportData(param), "bf_bip_report_day_comestore");
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs;
		} catch (Exception e) {
			logger.info("获取邀约统计报表数据失败",e);
			rs.setSuccess(false);
			rs.setMessage("获取邀约统计报表数据失败！");
			return rs;
		}
		
	}
	
	/**
	 * 获取所有潜客持有数数据
	 * @return 
	 */
	@RequestMapping(value="/findCustomerHolder",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustomerHolder(@RequestParam(name="searchTime") String searchTime,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			list = LegendUtils.sortLegend(reportService.findCustomerHolder(searchTime, storeId, roleId),
					"bf_bip_report_month_customer_holder");
		} catch (Exception e) {
			logger.info("所有潜客持有数统计查询异常", e);
			rs.setSuccess(false);
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 获取回退原因统计数据
	 * @return 
	 */
	@RequestMapping(value="/findReturnReasonCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findReturnReasonCount(@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("startTime", startTime);
			param.put("endTime", endTime);
			param.put("storeId", storeId);
			list = reportService.findReturnReasonCount(param);
		} catch (Exception e) {
			logger.info("获取回退原因统计数据查询失败", e);
			rs.setSuccess(false);
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 获取失销原因统计数据
	 * @return 
	 */
	@RequestMapping(value="/findLossReasonCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findLossReasonCount(@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("startTime", startTime);
			param.put("endTime", endTime);
			param.put("storeId", storeId);
			list = reportService.findLossReasonCount(param);
		} catch (Exception e) {
			logger.info("获取失销原因统计数据查询失败", e);
			rs.setSuccess(false);
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 根据店ID和投保日期查询保单统计数
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countInsuranceBill(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String startTime = (String)readValue.get("startTime");
			String endTime = (String)readValue.get("endTime");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("startTime", startTime);
			param.put("endTime", endTime);
			list = LegendUtils.legendSortAndReplace
					(reportService.countInsuranceBill(param), "bf_bip_report_day_insurance");
			
		} catch (Exception e) {
			logger.info("保单统计数查询异常", e);
			rs.setSuccess(false);
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 统计跟踪次数和发起邀约次数(日报)
	 * @return 
	 */
	@RequestMapping(value="/findTraceCountByDay",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTraceCountByDay(@RequestParam(name="searchTime") String searchTime,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {			
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("searchTime", searchTime);
			list = reportService.findTraceCountByDay(param);
		} catch (Exception e) {
			logger.info("统计跟踪次数和发起邀约人数(日报)查询失败", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 统计邀约和到店人数(日报)
	 * @return 
	 */
	@RequestMapping(value="/findInviteAndComeStoreByDay",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInviteAndComeStoreByDay(@RequestParam(name="searchTime") String searchTime,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {			
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("searchTime", searchTime);
			list = reportService.findInviteAndComeStoreByDay(param);
		} catch (Exception e) {
			logger.info("统计邀约和到店人数(日报)查询失败", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 查询当期续保率数据
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/xbltjbbDqxbl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse xbltjbbDqxbl(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = LegendUtils.legendSortAndReplace
					(reportService.xbltjbbDqxbl(param), "bf_bip_report_day_xbltjbb_dqxbl");
			//当期续保率不应该有新保
			Iterator<ReportData> it = list.iterator();
			while(it.hasNext()){
			    ReportData x = it.next();
			    String xName=x.getxName();
			    if(xName.equals("新保")){
			        it.remove();
			    }
			}
		} catch (Exception e) {
			logger.info("当期续保率查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 查询综合续保率数据
	 * @return 
	 */
	@RequestMapping(value="/xbltjbbZhxbl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse xbltjbbZhxbl(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = LegendUtils.legendSortAndReplace
					(reportService.xbltjbbZhxbl(param), "bf_bip_report_day_xbltjbb_zhxbl");
			//综合续保率计算不能分续保类型（现在从数据库里先不删除，在此删除，数据库修改计算方式每半小时计算一次）
			Iterator<ReportData> it = list.iterator();
			while(it.hasNext()){
			    ReportData x = it.next();
			    String xName=x.getxName();
			    if(xName.equals("首次")||xName.equals("新转续")||xName.equals("续转续")
			    	||xName.equals("潜转续")||xName.equals("间转续")){
			        it.remove();
			    }
			}
		} catch (Exception e) {
			logger.info("综合续保率查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 查询跟踪统计数据
	 * @return 
	 */
	@RequestMapping(value="/traceCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse traceCount(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.traceCount(param);
		} catch (Exception e) {
			logger.info("跟踪统计查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 查询邀约和到店统计数据 
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/inviteComestore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse inviteComestore(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.inviteComestore(param);
		} catch (Exception e) {
			logger.info("跟踪统计查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 查询出单统计数据 
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/insurancebillCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insurancebillCount(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> lists = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> insuranceCompNames = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> typeNames = new ArrayList<Map<String, Object>>();
		List<List<Map<String,Object>>> nums = new ArrayList<List<Map<String,Object>>>();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			lists = reportService.insurancebillCount(param);
			insuranceCompNames = reportService.insurancebillCountCompName(param);
			String[] ziduan = {"sumNewBillCount","sumRenewalBillCount","jqxNewBillCount","jqxRenewalBillCount","syxNewBillCount",
					"syxRenewalBillCount","sumNewBillPremium","sumRenewalBillPremium","jqxNewBillPremium","jqxRenewalBillPremium",
					"syxNewBillPremium","syxRenewalBillPremium","jqxNewBillHandlingRate","jqxRenewalBillHandlingRate",
					"syxNewBillHandlingRate","syxRenewalBillHandlingRate","sumNewBillHandlingAmount","sumRenewalBillHandlingAmount",
					"jqxNewBillHandlingAmount","jqxRenewalBillHandlingAmount","syxNewBillHandlingAmount","syxRenewalBillHandlingAmount"};
			//生成node端nums的json结构体
			for(int i=0;i<11;i++){
				@SuppressWarnings("rawtypes")
				List<Map<String,Object>> num = new ArrayList();
				int zong = 0;
				int zong1 = 0;
				Double zj = 0.0;
				Double zj1 = 0.0;
				for(int j=0;j<insuranceCompNames.size();j++){
					String cname = (String)insuranceCompNames.get(j).get("insuranceCompName");
					for(int k=0;k<lists.size();k++){
						String cname1 = (String)lists.get(k).get("insuranceCompName");
						if(cname.equals(cname1)){
							Map<String,Object> m = new HashMap<String,Object>();
							m.put("value", lists.get(k).get(ziduan[i*2]));
							num.add(m);
							
							Map<String,Object> m1 = new HashMap<String,Object>();
							m1.put("value", lists.get(k).get(ziduan[i*2+1]));
							num.add(m1);
							if(i<3){
								zong = zong + (Integer)lists.get(k).get(ziduan[i*2]);
								zong1 = zong1 + (Integer)lists.get(k).get(ziduan[i*2+1]);
							}else{
								zj = zj + (Double)lists.get(k).get(ziduan[i*2]);
								zj1 = zj1 + (Double)lists.get(k).get(ziduan[i*2+1]);
							}
						}
					}
				}
				Map<String,Object> ma = new HashMap<String,Object>();
				Map<String,Object> ma1 = new HashMap<String,Object>();
				if(i<3){
					ma.put("value", zong);
					ma1.put("value", zong1);
				}else{
					if(i==6||i==7){
						float a = Math.round(zj/insuranceCompNames.size()*10);
						float b = Math.round(zj1/insuranceCompNames.size()*10);
						float a1 = a/10;
						float b1 = b/10;
						ma.put("value", a1);
						ma1.put("value", b1);
					}else{
						float a = Math.round(zj*100);
						float b = Math.round(zj1*100);
						float a1 = a/100;
						float b1 = b/100;
						ma.put("value", a1);
						ma1.put("value", b1);
					}
				}
				num.add(ma);
				num.add(ma1);
				nums.add(num);
			}
			//保险公司名称的最后增加合计栏
			Map<String, Object> insuranceCompName = new HashMap<String,Object>();
			insuranceCompName.put("insuranceCompName", "合计");
			insuranceCompNames.add(insuranceCompName);
			//根据insuranceCompNames（包括   合计）的数量来生成对应的新保和续保栏
			Map<String, Object> typeName = new HashMap<String,Object>();
			typeName.put("typeName", "新保");
			Map<String, Object> typeName1 = new HashMap<String,Object>();
			typeName1.put("typeName", "续保");
			for(int i=0;i<insuranceCompNames.size();i++){
				typeNames.add(typeName);
				typeNames.add(typeName1);
			}
		} catch (Exception e) {
			logger.info("出单统计查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("insuranceCompNames", insuranceCompNames);
		rs.addContent("typeNames", typeNames);
		rs.addContent("nums", nums);
		return rs; 
	}
	
	/**
	 * 保险KPI日报-续保专员
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countXbzyKPI",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countXbzyKPI(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countXbzyKPI(param);
		} catch (Exception e) {
			logger.info("保险KPI日报(xbzy)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 保险KPI日报-销售顾问
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countXsgwKPI",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countXsgwKPI(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countXsgwKPI(param);
		} catch (Exception e) {
			logger.info("保险KPI日报(xsgw)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 保险KPI日报-服务顾问
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countFwgwKPI",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countFwgwKPI(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countFwgwKPI(param);
		} catch (Exception e) {
			logger.info("保险KPI日报(fwgw)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 保险KPI日报-出单员
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countCdyKPI",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countCdyKPI(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countCdyKPI(param);
		} catch (Exception e) {
			logger.info("保险KPI日报(cdy)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	
	/**
	 * 保险KPI日报-续保专员详情
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countXbzyKPIDetail",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countXbzyKPIDetail(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countXbzyKPIDetail(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI日报(cdy)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI日报-分续保类型
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/countXbzyKPICoverType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse countXbzyKPICoverType(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.countXbzyKPICoverType(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			if(list!=null&&list.size()>0){
				rs.addContent("results", list.get(0));
			}else{
				rs.addContent("results", "");
			}
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI日报(cdy)查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * APP日报分保险公司
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/appInsurancebillCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse appInsurancebillCount(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			
			resultList = reportService.findCountDayKpiInsurComp(param);
			
			rs.setSuccess(true);
			rs.addContent("results", resultList);
			return rs; 
		} catch (Exception e) {
			logger.info("APP日报分保险公司查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		
	}
	
	/**
	 * 保险KPI月报-分出单员
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountMonthKpiCdy",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountMonthKpiCdy(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			list = reportService.findCountMonthKpiCdy(param);
			Integer storeId = (Integer) param.get("storeId");
			Store store = storeService.findStoreById(storeId);
			list.get(0).put("asmModuleFlag", store.getAsmModuleFlag());
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI月报-分出单员查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI月报-分续保专员
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountMonthKpiXbzy",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountMonthKpiXbzy(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			list = reportService.findCountMonthKpiXbzy(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI月报-分续保专员查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI月报-续保专员详情
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountMonthKpiXbzyDetail",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountMonthKpiXbzyDetail(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			list = reportService.findCountMonthKpiXbzyDetail(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI月报-续保专员详情查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI月报-按保险公司
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountMonthKpiInsurComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountMonthKpiInsurComp(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			list = reportService.selectMonthKpiCompany(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI月报-按保险公司查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI日报-按保险公司
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountDayKpiInsurComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountDayKpiInsurComp(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			list = reportService.findCountDayKpiInsurComp(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI日报-按保险公司查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 保险KPI月报-按投保类型
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountMonthKpiCoverType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountMonthKpiCoverType(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		Map<String, Object> resultMap = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			resultMap = reportService.findCountMonthKpiCoverType(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs; 
		} catch (Exception e) {
			logger.info("保险KPI月报-按投保类型查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * APP月报-当期续保数
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountAppMonthDqxbs",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountAppMonthDqxbs(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		Map<String, Object> resultMap = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			resultMap = reportService.findCountAppMonthDqxbs(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs; 
		} catch (Exception e) {
			logger.info("APP月报-当期续保数查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * APP月报-综合续保数
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCountAppMonthZhxbs",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCountAppMonthZhxbs(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		Map<String, Object> resultMap = null;
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			resultMap = reportService.findCountAppMonthZhxbs(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs; 
		} catch (Exception e) {
			logger.info("APP月报-综合续保数查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
	}
	
	/**
	 * 续保专员客户流转报表
	 * @return 
	 */
	@RequestMapping(value="/findCustomerTrendData",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustomerTrendData(@RequestParam(name="recordTime") String recordTime,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("recordTime", recordTime);
			list = LegendUtils.sortLegend(reportService.findCustomerTrendData(param), "bf_bip_report_month_customer_trend");
		} catch (Exception e) {
			logger.info("续保专员客户流转报表查询异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	/**
	 * 续保专员客户流转报表明细
	 * @return 
	 */
	@RequestMapping(value="/findCustomerTrendDetail",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustomerTrendDetail(@RequestParam(name="recordTime") String recordTime,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="stackName") String stackName,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="startNum") Integer startNum){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("recordTime", recordTime);
			param.put("stackName", stackName);
			param.put("userId", userId);
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", ConstantUtil.pageSize);
			
			list = reportService.findCustomerTrendDetail(param);
		} catch (Exception e) {
			logger.info("续保专员客户流转报表明细查询异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", list);
		return rs; 
	}
	/**
	 * 查询当期续保率数据(趋势图)
	 * @param condition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/xbltjbbDqxbl_qushi",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse xbltjbbDqxbl_qushi(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		List<ReportData> lists = new ArrayList<ReportData>();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.xbltjbbDqxbl_qushi(param);
			if(list!=null&&list.size()>0){
				String str = "";
				Integer num = 0;
				for(int i=0;i<list.size();i++){
					if(list.get(i).getxId()==2){
						list.get(i).setStack(1);
					}else{
						if(list.get(i).getyId()==2){
							list.get(i).setStack(2);
						}else if(list.get(i).getyId()==3){
							list.get(i).setStack(3);
						}else if(list.get(i).getyId()==4){
							list.get(i).setStack(4);
						}else if(list.get(i).getyId()==5){
							list.get(i).setStack(5);
						}else if(list.get(i).getyId()==6){
							list.get(i).setStack(6);
						}
						list.get(i).setyName(list.get(i).getyName()+"(%)");
					}
					Integer yue = list.get(i).getRecordTime().getMonth()+1;
					list.get(i).setxId(yue);
					list.get(i).setxName(yue+"月");
					if(num==0){
						num = yue;
						str = "["+list.get(i).getyName()+"]";
					}else{
						if(num!=yue){
							if(!str.contains("[新转续]")){
								list.add(i,zuhe(num,2,"新转续",1,list.get(0).getStoreId()));
								i++;
							}
							num = yue;
							str = "";
						}else{
							str = str+"["+list.get(i).getyName()+"]";
						}
						if(list.size()-1==i){
							if(!str.contains("[新转续]")){
								list.add(i,zuhe(num,2,"新转续",1,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[续转续]")){
								list.add(i,zuhe(num,3,"续转续",1,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[间转续]")){
								list.add(i,zuhe(num,4,"间转续",1,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[潜转续]")){
								list.add(i,zuhe(num,5,"潜转续",1,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[首次]")){
								list.add(i,zuhe(num,6,"首次",1,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[新转续(%)]")){
								list.add(i,zuhe(num,2,"新转续(%)",2,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[续转续(%)]")){
								list.add(i,zuhe(num,3,"续转续(%)",3,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[间转续(%)]")){
								list.add(i,zuhe(num,4,"间转续(%)",4,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[潜转续(%)]")){
								list.add(i,zuhe(num,5,"潜转续(%)",5,list.get(0).getStoreId()));
								i++;
							}
							if(!str.contains("[首次(%)]")){
								list.add(i,zuhe(num,6,"首次(%)",6,list.get(0).getStoreId()));
								i++;
							}
						}
					}
				}
				Integer yue = list.get(0).getRecordTime().getMonth()+1;
				for(int i=1;i<yue;i++){
					lists.add(zuhe(i,2,"新转续",1,list.get(0).getStoreId()));
				}
				lists.addAll(list);
			}
		} catch (Exception e) {
			logger.info("当期续保率查询异常", e);
			rs.setSuccess(false);
			return rs;
		}
		lists = LegendUtils.sortLegend(lists, "bf_bip_report_day_xbltjbb_dqxbl_qst");
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.addContent("results", lists);
		return rs; 
	}
	
	/**
	 * 组合ReportData
	 * @param xId
	 * @param yId
	 * @param yName
	 * @param stack
	 * @param storeId
	 * @return
	 */
	public ReportData zuhe(Integer xId,Integer yId,String yName,Integer stack,Integer storeId){
		ReportData reportData = new ReportData();
		reportData.setId(0);
		reportData.setxId(xId);
		reportData.setxName(xId+"月");
		reportData.setyId(yId);
		reportData.setyName(yName);
		reportData.setStack(stack);
		reportData.setValue(0.0);
		reportData.setStoreId(storeId);
		return reportData;
	}
	
	/**
	 * 查询综合续保率数据(趋势图)2018-09-28  yujiantong整改
	 * @param condition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/xbltjbbZhxbl_qushi",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse xbltjbbZhxbl_qushi(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		List<ReportData> lists = new ArrayList<ReportData>();
		List<ReportData> list3 =new ArrayList<ReportData>();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> readValue = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)readValue.get("storeId");
			String time = (String)readValue.get("time");
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("time", time);
			list = reportService.xbltjbbZhxbl_qushi(param);
			if(list!=null&&list.size()>0){
				for(int i=0;i<list.size();i++){
					if(list.get(i).getxId()==2){
						list.get(i).setStack(1);
					}else if(list.get(i).getxId()==1){
						list.get(i).setStack(2);
					}else{
						list.get(i).setyName(list.get(i).getyName()+"(%)");
					}
					Integer yue = list.get(i).getRecordTime().getMonth()+1;
					list.get(i).setxId(yue);
					list.get(i).setxName(yue+"月");
				}
				lists.addAll(list);	
			}
			lists = LegendUtils.sortLegend(lists, "bf_bip_report_day_xbltjbb_zhxbl_qst");
			//月份排序
			Map<Integer,List<ReportData>>  map = new TreeMap<>();
            for (ReportData reportData : lists) {
            	if(map.containsKey(reportData.getxId())){
            		List<ReportData> list2 = map.get(reportData.getxId());
            		list2.add(reportData);
            		map.put(reportData.getxId(), list2);
            	}else{
            		List<ReportData>  reportDatas =new ArrayList<>();
            		reportDatas.add(reportData);
            		map.put(reportData.getxId(), reportDatas);
            	}
			}
            Collection<List<ReportData>> values = map.values();
            for (List<ReportData> list4 : values) {
            	 for (ReportData reportData : list4) {
					list3.add(reportData);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rs.setSuccess(false);
			return rs;
		}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list3);
		return rs; 
	}
	/**
	 * 查询异常数据报表
	 * @return 
	 */
	@RequestMapping(value="/findExceptionData",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findExceptionData(@RequestParam(name="recordTime") String recordTime,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		List<ReportData> list = null;
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("roleId", roleId);
			param.put("recordTime", recordTime);
			
			list = LegendUtils.sortLegend(reportService.findExceptionData(param), "bf_bip_report_day_exception");
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			rs.setMessage("查询异常报表成功");
			return rs; 
		} catch (Exception e) {
			logger.info("查询异常数据报表失败,程序异常: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询异常报表失败");
			return rs; 
		}
	}
	/**
	 * 查询异常数据报表明细
	 * @return 
	 */
	@RequestMapping(value="/findExceptionDataDetail",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findExceptionDataDetail(@RequestParam(name="recordTime") String recordTime,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="stackName") String stackName,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="startNum") Integer startNum){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> list = null;
		int detailCount = 0;
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("recordTime", recordTime);
			param.put("stackName", stackName);
			param.put("userId", userId);
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", ConstantUtil.pageSize);
			
			list = reportService.findExceptionDataDetail(param);
			detailCount = reportService.findExceptionDataDetailCount(param);
					
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", list);
			rs.addContent("detailCount", detailCount);
			rs.setMessage("查询异常报表明细成功");
			return rs;
		} catch (Exception e) {
			logger.info("查询异常数据报表明细失败,程序异常: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询异常报表明细失败");
			return rs; 
		}
	}
}
