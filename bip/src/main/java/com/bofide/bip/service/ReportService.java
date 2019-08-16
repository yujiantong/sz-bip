package com.bofide.bip.service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.CoverType;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.CommonMapper;
import com.bofide.bip.mapper.ReportMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.ReportData;
import com.bofide.bip.po.User;

@Service(value = "reportService")
public class ReportService {
	@Resource(name = "reportMapper")
	private ReportMapper reportMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "commonMapper")
	private CommonMapper commonMapper;
	
	public List<ReportData> findInviteReportData(Map<String,Object> param) throws Exception {
		List<ReportData> oldList = reportMapper.findInviteReportData(param);
		//将提前邀约率为null值补0
		List<ReportData> newList = new ArrayList<ReportData>();
		for(ReportData reportData : oldList){
			Integer stack = reportData.getStack();
			Double value = reportData.getValue();
			if(stack == 3 && value == null){
				reportData.setValue(0.0);
			}
			newList.add(reportData);
		}
		//获取该店的所有处于正常状态的续保专员
		Integer roleId = RoleType.XBZY;
		Integer storeId = (Integer)param.get("storeId");
		List<User> userList = userMapper.findByRoleId(roleId, storeId);
		List<Integer> xIdList = new ArrayList<Integer>();
		for(ReportData reportData : newList){
			Integer xId = reportData.getxId();
			xIdList.add(xId);
		}
		for(User user : userList){
			Integer id = user.getId();
			List<ReportData> dataTemplate = new ArrayList<ReportData>();
			//如果xIdList不包含该id则为该id生成默认的报表数据
			if(!xIdList.contains(id)){
				//获取统计邀约率中一个续保专员的一个完整模板（包括所有的yId）
				String tableName = "bf_bip_report_day_invite";
				dataTemplate = reportMapper.findDataTemplate(storeId,tableName);
				//生成报表数据
				List<ReportData> list2 = generalReportDate(user,dataTemplate);
				for(ReportData reportData : list2){
					newList.add(reportData);
				}
				
			}
		}
		return newList;
	}
	

	public List<ReportData>  generalReportDate(Object object, List<ReportData> dataTemplate) {
		List<ReportData> list = new ArrayList<ReportData>();
		if(object instanceof User){
			User user = (User)object;
			for(ReportData reportData : dataTemplate){
				ReportData newReportData = new ReportData();
				newReportData.setxId(user.getId());
				newReportData.setxName(user.getUserName());
				newReportData.setyId(reportData.getyId());
				newReportData.setyName(reportData.getyName());
				newReportData.setStack(reportData.getStack());
				newReportData.setStackName(reportData.getStackName());
				newReportData.setValue(0.0);
				newReportData.setStoreId(reportData.getStoreId());
				list.add(newReportData);
			}
		}else{
			CoverType coverType = (CoverType)object;
			for(ReportData reportData : dataTemplate){
				ReportData newReportData = new ReportData();
				newReportData.setxId(coverType.getCoverType());
				newReportData.setxName(coverType.getCoverTypeName());
				newReportData.setyId(reportData.getyId());
				newReportData.setyName(reportData.getyName());
				newReportData.setStack(reportData.getStack());
				newReportData.setStackName(reportData.getStackName());
				newReportData.setValue(0.0);
				newReportData.setStoreId(reportData.getStoreId());
				list.add(newReportData);
			}
		}
		return list;
	}

	/**
	 * 获取所有潜客持有数数据
	 */
	public List<ReportData> findCustomerHolder(String searchTime, Integer storeId,Integer roleId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("searchTime", searchTime);
		param.put("storeId", storeId);
		param.put("roleId", roleId);
		List<ReportData> list = reportMapper.findCustomerHolder(param);
		return list;
	}
	
	public List<String> findReportSearchTime(Map<String, Object> param) throws Exception {
		List<String> list = reportMapper.findReportSearchTime(param);
		/*List<String> selectTimeList = new ArrayList<String>();
		for(String selectTimeStr : list){
			Date selectTimeDate = DateUtil.toDate(selectTimeStr);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(selectTimeDate);
			Integer year = calendar.get(Calendar.YEAR);
			Integer month = calendar.get(Calendar.MONTH)+1;
			StringBuffer sb = new StringBuffer();
	    	sb.append(year.toString());
			sb.append("-");
			sb.append(month.toString());
			String searchTime = sb.toString();
			selectTimeList.add(searchTime);
		}*/
		return list;
	}


	public List<ReportData> findComeStoreReportData(Map<String, Object> param) throws Exception {
		DecimalFormat df=new DecimalFormat(".##");
		List<ReportData> list = reportMapper.findComeStoreReportData(param);
		//查询出提前邀约人数 ，yId为1 
		Map<String, Object> tqyyrsParam = new HashMap<String,Object>();
		tqyyrsParam.put("yId", 1);
		tqyyrsParam.put("storeId", (Integer)param.get("storeId"));
		tqyyrsParam.put("startTime",(String)param.get("startTime"));
		tqyyrsParam.put("endTime",(String)param.get("endTime"));
		List<ReportData> tqyyrsDatas = reportMapper.findDataFromComeStoreReportData(tqyyrsParam);
		//查询出提前邀约到店人数 ，yId为3 
		Map<String, Object> tqyyddrsParam= new HashMap<String,Object>();
		tqyyddrsParam.put("yId", 3);
		tqyyddrsParam.put("storeId", (Integer)param.get("storeId"));
		tqyyddrsParam.put("startTime",(String)param.get("startTime"));
		tqyyddrsParam.put("endTime",(String)param.get("endTime"));
		List<ReportData> tqyyddrsDatas = reportMapper.findDataFromComeStoreReportData(tqyyddrsParam);
		//求该店的提前邀约到店率 = 提前邀约到店人数/提前邀约人数*100
		for(ReportData tqyyrsData : tqyyrsDatas){
			ReportData tqyyddrsRateData = new ReportData();
			tqyyddrsRateData.setxId(tqyyrsData.getxId());
			tqyyddrsRateData.setxName(tqyyrsData.getxName());
			tqyyddrsRateData.setyId(5);
			tqyyddrsRateData.setyName("5");
			tqyyddrsRateData.setStack(3);
			tqyyddrsRateData.setStackName("提前邀约到店率");
			tqyyddrsRateData.setStoreId(tqyyrsData.getStoreId());
			tqyyddrsRateData.setRecordTime(tqyyrsData.getRecordTime());
			Double tqyyddrsRate = 0.0;
			tqyyddrsRateData.setValue(tqyyddrsRate);
			Double tqyyrsValue = tqyyrsData.getValue();
			Integer tqyyrsUserId = tqyyrsData.getxId();
			//如果提前邀约人数为0，则提前邀约到店率为0
			if(tqyyrsValue == 0){
				tqyyddrsRateData.setValue(tqyyddrsRate);
			}else{
				for(ReportData tqyyddrsData :tqyyddrsDatas){
					Integer tqyyddrsUserId = tqyyddrsData.getxId();
					if(tqyyrsUserId.equals(tqyyddrsUserId)){
						Double tqyyddrsValue = tqyyddrsData.getValue();
						
						if(tqyyddrsValue == 0){
							tqyyddrsRate = 0.0;
						}else{
							tqyyddrsRate = (tqyyddrsValue/tqyyrsValue)*100;
							
						}
						tqyyddrsRateData.setValue(new Double(df.format(tqyyddrsRate)));
					}
					
				}
			}
			list.add(tqyyddrsRateData);
		}
		
		//获取该店的所有处于正常状态的续保专员
		Integer roleId = RoleType.XBZY;
		Integer storeId = (Integer)param.get("storeId");
		List<User> userList = userMapper.findByRoleId(roleId, storeId);
		List<Integer> xIdList = new ArrayList<Integer>();
		for(ReportData reportData : list){
			Integer xId = reportData.getxId();
			xIdList.add(xId);
		}
		for(User user : userList){
			Integer id = user.getId();
			List<ReportData> dataTemplate = new ArrayList<ReportData>();
			//如果xIdList不包含该id则为该id生成默认的报表数据
			if(!xIdList.contains(id)){
				//获取统计邀约率中一个续保专员的一个完整模板（包括所有的yId）
				String tableName = "bf_bip_report_day_comestore";
				dataTemplate = reportMapper.findDataTemplate(storeId,tableName);
				//生成报表数据
				List<ReportData> list2 = generalReportDate(user,dataTemplate);
				for(ReportData reportData : list2){
					list.add(reportData);
				}
				
			}
		}
		return list;
	}
	
	public List<ReportData> findReturnReasonCount(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.findReturnReasonCount(param);
		return list;
	}
	
	public List<ReportData> findLossReasonCount(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.findLossReasonCount(param);
		return list;
	}
	
	public List<ReportData> countInsuranceBill(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.countInsuranceBill(param);
		return list;
	}
	/**
	 * 查询当期续保率数据
	 * @return 
	 */
	public List<ReportData> xbltjbbDqxbl(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.xbltjbbDqxbl(param);
		//获取该店的所有处于正常状态的续保专员
		
		Integer storeId = (Integer)param.get("storeId");
		List<CoverType> coverTypes = commonMapper.findCoverTypeNoNewInsur();
		List<Integer> xIdList = new ArrayList<Integer>();
		for(ReportData reportData : list){
			Integer xId = reportData.getxId();
			xIdList.add(xId);
		}
		for(CoverType coverType : coverTypes){
			Integer coverTypeId = coverType.getCoverType();
			List<ReportData> dataTemplate = new ArrayList<ReportData>();
			//如果xIdList不包含该id则为该id生成默认的报表数据
			if(!xIdList.contains(coverTypeId)){
				//获取统计邀约率中一个续保专员的一个完整模板（包括所有的yId）
				String tableName = "bf_bip_report_day_xbltjbb_dqxbl";
				dataTemplate = reportMapper.findDataTemplate(storeId,tableName);
				//生成报表数据
				List<ReportData> list2 = generalReportDate(coverType,dataTemplate);
				for(ReportData reportData : list2){
					list.add(reportData);
				}
				
			}
		}
		return list;
	}

	public List<Map<String, Object>> findTraceCountByDay(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.findTraceCountByDay(param);
		return list;
	}
	
	public List<Map<String, Object>> findInviteAndComeStoreByDay(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.findInviteAndComeStoreByDay(param);
		return list;
	}
	
	public List<ReportData> xbltjbbZhxbl(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.xbltjbbZhxbl(param);
		//获取该店的所有处于正常状态的续保专员

		Integer storeId = (Integer)param.get("storeId");
		List<CoverType> coverTypes = commonMapper.findCoverTypeNoNewInsur();
		List<Integer> xIdList = new ArrayList<Integer>();
		for(ReportData reportData : list){
			Integer xId = reportData.getxId();
			xIdList.add(xId);
		}
		for(CoverType coverType : coverTypes){
			Integer coverTypeId = coverType.getCoverType();
			List<ReportData> dataTemplate = new ArrayList<ReportData>();
			//如果xIdList不包含该id则为该id生成默认的报表数据
			if(!xIdList.contains(coverTypeId)){
				//获取统计邀约率中一个续保专员的一个完整模板（包括所有的yId）
				String tableName = "bf_bip_report_day_xbltjbb_zhxbl";
				dataTemplate = reportMapper.findDataTemplate(storeId,tableName);
				//生成报表数据
				List<ReportData> list2 = generalReportDate(coverType,dataTemplate);
				for(ReportData reportData : list2){
					list.add(reportData);
				}
				
			}
		}
		return list;
	}
	
	public List<Map<String, Object>> traceCount(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.traceCount(param);
		return list;
	}
	
	public List<Map<String, Object>> inviteComestore(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.inviteComestore(param);
		return list;
	}
	
	public List<Map<String, Object>> insurancebillCount(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.insurancebillCount(param);
		return list;
	}
	
	public List<Map<String, Object>> insurancebillCountCompName(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.insurancebillCountCompName(param);
		return list;
	}
	
	public List<Map<String, Object>> countXbzyKPI(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countXbzyKPI(param);
		return list;
	}
	
	public List<Map<String, Object>> countXsgwKPI(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countXsgwKPI(param);
		return list;
	}
	
	public List<Map<String, Object>> countFwgwKPI(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countFwgwKPI(param);
		return list;
	}
	
	public List<Map<String, Object>> countCdyKPI(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countCdyKPI(param);
		return list;
	}
	
	public List<Map<String, Object>> countXbzyKPIDetail(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countXbzyKPIDetail(param);
		return list;
	}
	
	public List<Map<String, Object>> countXbzyKPICoverType(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.countXbzyKPICoverType(param);
		return list;
	}
	/**
	 * 保险KPI月报-分出单员 
	 */
	public List<Map<String, Object>> findCountMonthKpiCdy(Map<String, Object> param) throws Exception {
		int sumJdrs = 0;//接待人数合计
		int sumXbcs = 0;//续保车数合计
		int sumCds = 0;//出单数合计
		double sumDdcds = 0;//到店出单数合计
		int sumSyxcds = 0;//商业险出单数合计
		double sumBfhj = 0;//保费合计
		double sumSyxbfhj = 0;//商业险保费合计
		double avgDdcdl = 0;//到店出单率合计
		double avgSyxdjbf = 0;//商业险单均保费合计
		List<Map<String, Object>> list = null;
		Map<String, Object> sumMap = new HashMap<>();
		list = reportMapper.countMonthKpiCdy(param);
		for(int i =0;i<list.size();i++){
			Map<String, Object> map = list.get(i);
			int jdrs = (int) map.get("jdrs");
			int xbcs = (int) map.get("xbcs");
			int cds = (int) map.get("cds");
			int ddcds = (int) map.get("ddcds");
			int syxcds = (int) map.get("syxcds");
			double bfhj = (double) map.get("bfhj");
			double syxbfhj = (double) map.get("syxbfhj");
			
			sumJdrs += jdrs;
			sumXbcs +=xbcs;
			sumCds +=cds;
			sumDdcds +=ddcds;
			sumSyxcds +=syxcds;
			sumBfhj +=bfhj;
			sumSyxbfhj +=syxbfhj;
		}
		sumMap.put("userName", "合计");
		sumMap.put("jdrs", sumJdrs);
		sumMap.put("xbcs", sumXbcs);
		sumMap.put("cds", sumCds);
		if(sumJdrs>0){
			avgDdcdl = sumDdcds/sumJdrs*100;
		}
		if(sumSyxcds>0){
			avgSyxdjbf = sumSyxbfhj/sumSyxcds;
		}
		sumMap.put("ddcdl", avgDdcdl);
		sumMap.put("syxcds", sumSyxcds);
		sumMap.put("bfhj", sumBfhj);
		sumMap.put("syxbfhj", sumSyxbfhj);
		sumMap.put("syxdjbf", avgSyxdjbf);
		
		list.add(0, sumMap);
		return list;
	}
	
	/**
	 * 保险KPI月报-分续保专员
	 */
	public List<Map<String, Object>> findCountMonthKpiXbzy(Map<String, Object> param) throws Exception {
		int traceCountSum = 0;//跟踪人数合计
		double zsgzcsSum = 0;//准时跟踪次数合计
		double needTraceCountSum = 0;//应跟踪次数合计
		double inviteCountSum = 0;//邀约人数合计
		double yylInviteCountSum = 0;//邀月率邀约人数合计
		double cyqksSum = 0;//持有潜客数合计
		int yjddrsSum = 0;//预计到店人数合计
		double comeStoreCountSum = 0;//邀约到店人数合计
		int xbcsSum = 0;//续保车数合计
		int syxcdsSum = 0;//商业险出单数合计
		double zsgjlAvg = 0;//准时跟进率合计
		double qkyylAvg = 0;//潜客邀约率合计
		double yyddlAvg = 0;//邀约到店率合计
		List<Map<String, Object>> list = null;
		Map<String, Object> sumMap = new HashMap<>();
		list = reportMapper.countMonthKpiXbzy(param);
		for(int i =0;i<list.size();i++){
			Map<String, Object> map = list.get(i);
			int traceCount = (int) map.get("traceCount");
			int zsgzcs = (int) map.get("zsgzcs");
			int needTraceCount = (int) map.get("needTraceCount");
			int inviteCount = (int) map.get("inviteCount");
			int yylInviteCount = (int) map.get("yylInviteCount");
			int cyqks = (int) map.get("cyqks");
			int yjddrs = (int) map.get("yjddrs");
			int comeStoreCount = (int) map.get("comeStoreCount");
			int xbcs = (int) map.get("xbcs");
			int syxcds = (int) map.get("syxcds");
			
			traceCountSum += traceCount;
			zsgzcsSum += zsgzcs;
			needTraceCountSum += needTraceCount;
			inviteCountSum += inviteCount;
			yylInviteCountSum += yylInviteCount;
			cyqksSum += cyqks;
			yjddrsSum += yjddrs;
			comeStoreCountSum += comeStoreCount;
			xbcsSum += xbcs;
			syxcdsSum += syxcds;
		}
		if(needTraceCountSum>0){
			zsgjlAvg = zsgzcsSum/needTraceCountSum*100;
		}
		if(cyqksSum>0){
			qkyylAvg = yylInviteCountSum/cyqksSum*100;
		}
		if(yjddrsSum>0){
			yyddlAvg = comeStoreCountSum/yjddrsSum*100;
		}
		sumMap.put("userName", "合计");
		sumMap.put("traceCount", traceCountSum);
		sumMap.put("zsgjl", zsgjlAvg);
		sumMap.put("inviteCount", inviteCountSum);
		sumMap.put("qkyyl", qkyylAvg);
		sumMap.put("yjddrs", yjddrsSum);
		sumMap.put("comeStoreCount", comeStoreCountSum);
		sumMap.put("yyddl", yyddlAvg);
		sumMap.put("xbcs", xbcsSum);
		sumMap.put("syxcds", syxcdsSum);
		
		list.add(0, sumMap);
		return list;
	}
	
	public List<Map<String, Object>> findCountMonthKpiXbzyDetail(Map<String, Object> param) throws Exception {
		return reportMapper.countMonthKpiXbzyDetail(param);
	}
	
	public List<Map<String, Object>> findCountMonthKpiInsurComp(Map<String, Object> param) throws Exception {
		return reportMapper.countMonthKpiInsurComp(param);
	}
	
	public List<Map<String, Object>> findCountDayKpiInsurComp(Map<String, Object> param) throws Exception {
		return reportMapper.countDayKpiInsurComp(param);
	}
	
	public Map<String, Object> findCountMonthKpiCoverType(Map<String, Object> param) throws Exception {
		Map<String, Object> resultMap = new HashMap<>();
		List<Map<String, Object>> zyList = reportMapper.countMonthKpiCoverTypeResource(param);
		resultMap.put("zy", zyList);
		List<Map<String, Object>> gzyyList = reportMapper.countMonthKpiCoverTypeGzyy(param);
		resultMap.put("gzyy", gzyyList);
		List<Map<String, Object>> ddcdList = reportMapper.countMonthKpiCoverTypeDdcd(param);
		resultMap.put("ddcd", ddcdList);
		Map<String, Object> xbwclMap = reportMapper.countMonthKpiCoverTypeXbwcl(param);
		resultMap.put("xbwcl", xbwclMap);
		Map<String, Object> zhxbMap = reportMapper.countMonthKpiCoverTypeZhxb(param);
		resultMap.put("zhxb", zhxbMap);
		List<Map<String, Object>> dqxbList = reportMapper.countMonthKpiCoverTypeDqxb(param);
		resultMap.put("dqxb", dqxbList);
		return resultMap;
	}
	
	//APP月报-当期续保数
	public Map<String, Object> findCountAppMonthDqxbs(Map<String, Object> param) throws Exception {
		return reportMapper.countAppMonthDqxbs(param);
	}
	
	//APP月报-综合续保数
	public Map<String, Object> findCountAppMonthZhxbs(Map<String, Object> param) throws Exception {
		return reportMapper.countAppMonthZhxbs(param);
	}
	
	/**
	 * 续保专员客户流转报表
	 */
	public List<ReportData> findCustomerTrendData(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.findCustomerTrendData(param);
		return list;
	}
	/**
	 * 续保专员客户流转报表明细
	 */
	public List<Map<String, Object>> findCustomerTrendDetail(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.findCustomerTrendDetail(param);
		return list;
	}
	
	
	/**
	 * 查询当期续保率数据(趋势图)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<ReportData> xbltjbbDqxbl_qushi(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.xbltjbbDqxbl_qushi(param);
		return list;
	}
	
	/**
	 * 查询综合续保率数据(趋势图)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<ReportData> xbltjbbZhxbl_qushi(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.xbltjbbZhxbl_qushi(param);
		return list;
	}
	
	/**
	 * 查询异常数据报表
	 */
	public List<ReportData> findExceptionData(Map<String, Object> param) throws Exception {
		List<ReportData> list = reportMapper.findExceptionData(param);
		return list;
	}
	/**
	 * 查询异常数据报表明细
	 */
	public List<Map<String, Object>> findExceptionDataDetail(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = reportMapper.findExceptionDataDetail(param);
		return list;
	}
	/**
	 * 查询异常数据报表明细总数
	 */
	public int findExceptionDataDetailCount(Map<String, Object> param) throws Exception {
		return reportMapper.findExceptionDataDetailCount(param);
	}
	
	public List<Map<String, Object>> selectMonthKpiCompany(Map<String, Object> param) throws Exception{
		List<Map<String, Object>> resultList = new ArrayList<>();
		//查询出店内有数据的所有保险公司
		List<Map<String, Object>> companys = reportMapper.selectInsuranceCompName(param);
		if(companys.size()>0){
			for(int i=0;i<companys.size();i++){
				Map<String,Object> companyMap = companys.get(i);
				String insuranceCompName = companyMap.get("insuranceCompName").toString();
				if(i==0){
					//所有保险公司的合计
					List<Map<String,Object>> shujuAllList = new ArrayList<>();
					Map<String, Object> resultMapAll = new HashMap<>();
					resultMapAll.put("insuranceCompName", "合计");
					resultMapAll.put("num", 4);
					for(int z=0;z<4;z++){
						Map<String,Object> shujuSumMap = new HashMap<>();
						if(z==0){
							shujuSumMap = reportMapper.selectMonthKpiCompanySum(param);
							shujuSumMap.put("name", "合计");
							shujuAllList.add(shujuSumMap);
						}else{
							param.put("type", z);
							shujuSumMap = reportMapper.selectMonthKpiCompanySum(param);
							if(z == 1){
								shujuSumMap.put("name", "新保-全");
							}else if(z == 2){
								shujuSumMap.put("name", "新保-贷");
							}else if(z == 3){
								shujuSumMap.put("name", "续保");
							}
							shujuAllList.add(shujuSumMap);
						}
					}
					resultMapAll.put("shuju", shujuAllList);
					resultList.add(resultMapAll);
				}
				
				param.put("insuranceCompName", insuranceCompName);
				//查询每个该保险公司出单的各种情况
				List<Map<String,Object>> list = reportMapper.selectMonthKpiCompany(param);
				Map<String, Object> resultMap = new HashMap<>();
				resultMap.put("insuranceCompName", insuranceCompName);
				List<Map<String, Object>> shujuList = new ArrayList<>();
				
				//保险公司里面的合计
				Map<String,Object> companySumMap = new HashMap<>();
				Integer jqxcdsSum = 0;
				Integer syxcdsSum = 0;
				Integer cdsSum = 0;
				Double jqxbfSum = 0.0;
				Double syxbfSum = 0.0;
				Double bfSum = 0.0;
				Double jqxsxfAmountSum = 0.0;
				Double syxsxfAmountSum = 0.0;
				Double sxfAmountSum = 0.0;
				//存放标志,如果保险公司的type(1:新保-全,2:新保-贷,3:续保)存在缺少的,则缺少的type需要补0
				List<Integer> tempList = new ArrayList<>();
				for(int j=0;j<list.size();j++){
					Map<String, Object> listMap = list.get(j);
					Integer type = Integer.valueOf(listMap.get("type").toString());
					if(!tempList.contains(type)){
						tempList.add(type);
					}
					jqxcdsSum += Integer.valueOf(listMap.get("jqxcds").toString());
					syxcdsSum += Integer.valueOf(listMap.get("syxcds").toString());
					cdsSum += Integer.valueOf(listMap.get("cdsSum").toString());
					jqxbfSum += Double.valueOf(listMap.get("jqxbf").toString());
					syxbfSum += Double.valueOf(listMap.get("syxbf").toString());
					bfSum += Double.valueOf(listMap.get("bfSum").toString());
					jqxsxfAmountSum += Double.valueOf(listMap.get("jqxsxfAmount").toString());
					syxsxfAmountSum += Double.valueOf(listMap.get("syxsxfAmount").toString());
					sxfAmountSum += Double.valueOf(listMap.get("sxfAmountSum").toString());
					companySumMap.put("jqxcds", jqxcdsSum);
					companySumMap.put("syxcds", syxcdsSum);
					companySumMap.put("cdsSum", cdsSum);
					companySumMap.put("jqxbf", new DecimalFormat("0.##").format(jqxbfSum));
					companySumMap.put("syxbf", new DecimalFormat("0.##").format(syxbfSum));
					companySumMap.put("bfSum", new DecimalFormat("0.##").format(bfSum));
					companySumMap.put("jqxsxfRate", "-");
					companySumMap.put("syxsxfRate", "-");
					companySumMap.put("jqxsxfAmount", new DecimalFormat("0.##").format(jqxsxfAmountSum));
					companySumMap.put("syxsxfAmount", new DecimalFormat("0.##").format(syxsxfAmountSum));
					companySumMap.put("sxfAmountSum", new DecimalFormat("0.##").format(sxfAmountSum));
					companySumMap.put("type", 0);
					companySumMap.put("name", "合计");
				}
				shujuList.add(companySumMap);
				if(tempList.size()<3){
					for(int x=1;x<4;x++){
						if(!tempList.contains(x)){
							//没有的则补0
							Map<String, Object> map = new HashMap<>();
							map.put("type", x);
							map.put("jqxcds", 0);
							map.put("syxcds", 0);
							map.put("cdsSum", 0);
							map.put("jqxbf", 0);
							map.put("syxbf", 0);
							map.put("bfSum", 0);
							map.put("jqxsxfRate", 0);
							map.put("syxsxfRate", 0);
							map.put("jqxsxfAmount", 0);
							map.put("syxsxfAmount", 0);
							map.put("sxfAmountSum", 0);
							list.add(map);
						}
					}
				}
				resultMap.put("num", list.size()+1);
				//对该保险公司的情况排序, 确保顺序为 合计,新保-全,新保-贷,续保
				Collections.sort(list, new Comparator<Map<String, Object>>() {
					@Override
					public int compare(Map<String, Object> o1,Map<String, Object> o2) {
						Integer type1 = Integer.valueOf(o1.get("type").toString());
						Integer type2 = Integer.valueOf(o2.get("type").toString());
						//升序
						return type1.compareTo(type2);
					}
				});
				int xbq = 0;
				int xbd = 0;
				int xb =0;
				for(int k=0;k<list.size();k++){
					Map<String, Object> listMap = list.get(k);
					Integer type = Integer.valueOf(listMap.get("type").toString());
					if(type == 1){
						if(xbq==0){
							listMap.put("name", "新保-全");
						}else{
							listMap.put("name", "新保-全"+xbq);
						}
						xbq +=1;
					}else if(type == 2){
						if(xbd==0){
							listMap.put("name", "新保-贷");
						}else{
							listMap.put("name", "新保-贷" + xbd);
						}
						xbd += 1;
					}else if(type == 3){
						if(xb==0){
							listMap.put("name", "续保");
						}else{
							listMap.put("name", "续保" + xb);
						}
						xb += 1;
					}
					shujuList.add(listMap);
				}
				resultMap.put("shuju", shujuList);
				resultList.add(resultMap);
			}
		}else{
			List<Map<String,Object>> shujuAllList = new ArrayList<>();
			Map<String, Object> resultMapAll = new HashMap<>();
			resultMapAll.put("insuranceCompName", "合计");
			resultMapAll.put("num", 4);
			for(int z=0;z<4;z++){
				Map<String, Object> map = new HashMap<>();
				if(z==0){
					map.put("name", "合计");
				}else if(z == 1){
					map.put("name", "新保-全");
				}else if(z == 2){
					map.put("name", "新保-贷");
				}else if(z == 3){
					map.put("name", "续保");
				}
				map.put("jqxcds", 0);
				map.put("syxcds", 0);
				map.put("cdsSum", 0);
				map.put("jqxbf", 0);
				map.put("syxbf", 0);
				map.put("bfSum", 0);
				map.put("jqxsxfRate", 0);
				map.put("syxsxfRate", 0);
				map.put("jqxsxfAmount", 0);
				map.put("syxsxfAmount", 0);
				map.put("sxfAmountSum", 0);
				shujuAllList.add(map);
			}
			resultMapAll.put("shuju", shujuAllList);
			resultList.add(resultMapAll);
		}
		return resultList;
	}
}
