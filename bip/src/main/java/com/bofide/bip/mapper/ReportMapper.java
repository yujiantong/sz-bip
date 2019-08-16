package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.ReportData;

public interface ReportMapper {

	List<ReportData> findInviteReportData(Map<String, Object> param)throws Exception;

	List<ReportData> findCustomerHolder(Map<String, Object> param)throws Exception;

	List<String> findReportSearchTime(Map<String, Object> param)throws Exception;

	List<ReportData> findComeStoreReportData(Map<String, Object> param)throws Exception;

	List<ReportData> findReturnReasonCount(Map<String, Object> param)throws Exception;

	List<ReportData> findLossReasonCount(Map<String, Object> param)throws Exception;
	
	List<ReportData> countInsuranceBill(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> findTraceCountByDay(Map<String, Object> param)throws Exception;

	List<Map<String,Object>> findInviteAndComeStoreByDay(Map<String, Object> param)throws Exception;

	List<ReportData> xbltjbbDqxbl(Map<String, Object> param)throws Exception;
	
	List<ReportData> xbltjbbZhxbl(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> traceCount(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> inviteComestore(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> insurancebillCount(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> insurancebillCountCompName(Map<String, Object> param)throws Exception;

	List<ReportData> findDataFromComeStoreReportData(Map<String, Object> param)throws Exception;

	List<ReportData> findDataTemplate(@Param(value="storeId") Integer storeId, @Param(value="tableName") String tableName)throws Exception;
	
	List<Map<String,Object>> countXbzyKPI(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countXsgwKPI(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countFwgwKPI(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countCdyKPI(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countXbzyKPIDetail(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countXbzyKPICoverType(Map<String, Object> param)throws Exception;
	
	List<Map<String,Object>> countMonthKpiCdy(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> countMonthKpiXbzy(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> countMonthKpiXbzyDetail(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> countMonthKpiInsurComp(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> selectMonthKpiCompany(Map<String, Object> param) throws Exception;
	
	Map<String,Object> selectMonthKpiCompanySum(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> selectInsuranceCompName(Map<String, Object> param) throws Exception;
	
	List<Map<String,Object>> countDayKpiInsurComp(Map<String, Object> param) throws Exception;

	//KPI月报按投保类型-资源
	List<Map<String,Object>> countMonthKpiCoverTypeResource(Map<String, Object> param) throws Exception;
	//KPI月报按投保类型-跟踪邀约
	List<Map<String,Object>> countMonthKpiCoverTypeGzyy(Map<String, Object> param) throws Exception;
	//KPI月报按投保类型-到店出单
	List<Map<String,Object>> countMonthKpiCoverTypeDdcd(Map<String, Object> param) throws Exception;
	//KPI月报按投保类型-续保完成率
	Map<String,Object> countMonthKpiCoverTypeXbwcl(Map<String, Object> param) throws Exception;
	//KPI月报按投保类型-综合续保
	Map<String,Object> countMonthKpiCoverTypeZhxb(Map<String, Object> param) throws Exception;
	//KPI月报按投保类型-当期续保
	List<Map<String,Object>> countMonthKpiCoverTypeDqxb(Map<String, Object> param) throws Exception;
	
	//APP月报-当期续保数
	Map<String,Object> countAppMonthDqxbs(Map<String, Object> param) throws Exception;
	
	//APP月报-综合续保数
	Map<String,Object> countAppMonthZhxbs(Map<String, Object> param) throws Exception;
	
	//根据表名和4s店id删除报表数据
	void deleteReportDataByStoreId(@Param(value = "storeId") Integer storeId,
			@Param(value = "tableName") String tableName) throws Exception;
	
	//续保专员客户流转报表
	List<ReportData> findCustomerTrendData(Map<String, Object> param)throws Exception;
	
	//续保专员客户流转报表明细
	List<Map<String, Object>> findCustomerTrendDetail(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询当期续保率数据(趋势图)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<ReportData> xbltjbbDqxbl_qushi(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询综合续保率数据(趋势图)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<ReportData> xbltjbbZhxbl_qushi(Map<String, Object> param)throws Exception;

	/**
	 * 查询异常数据报表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<ReportData> findExceptionData(Map<String, Object> param) throws Exception;
		
	/**
	 * 查询异常数据报表明细
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findExceptionDataDetail(Map<String, Object> param) throws Exception;
	/**
	 * 查询异常数据报表明细总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	int findExceptionDataDetailCount(Map<String, Object> param) throws Exception;
}
