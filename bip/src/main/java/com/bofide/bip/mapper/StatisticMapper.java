package com.bofide.bip.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface StatisticMapper {

	List<Map<String, Object>> findInsuranceStatistics(Map<String, Object> map) throws Exception;
	//此方法是修改上面方法findInsuranceStatistics中的traceCount，是上面方法中能查出的一个数traceCount，现在通过这个方法代替
	/**
	 * 查询某一个用户的跟踪数   
	 */
	/*Integer findTrceCount(Map<String, Object> map) throws Exception;*/ //2019-04-17注释的 , yujiantong
	
	List<Map<String, Object>> findServiceStatistics(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> findSaleStatistics(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> findRCInsuranceStatistics(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> findSAServiceStatistics(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> findSCSaleStatistics(Map<String, Object> map) throws Exception;
	
	List<Map<String, Object>> findCSCStatistics(Map<String, Object> map) throws Exception;
	
	Map<String, Object> findCSCUserStatistics(Map<String, Object> map) throws Exception;
	/**
	 * 查询某一个用户的相关出单数
	 * */
	Integer findBillCount(Map<String, Object> map) throws Exception;
	/**
	 * 查询某一个用户的当期潜客
	 * */
	Integer findMonthCustomer(Map<String, Object> map) throws Exception;
	/**
	 * 查询某一个用户的全部潜客
	 * */
	Integer findAllCustomer(Map<String, Object> map) throws Exception;
	/**
	 * 统计用户下的潜客是否到店
	 * @param traceMap
	 * @return 
	 */
	Map<String, BigDecimal> statistic(Map<String, Object> traceMap);
	
	/**
	 * 根据负责人id和投保类型统计所有潜客
	 */
	Integer countTraceCusNum(Map<String,Object> param)throws Exception;
	/**
	 * 根据负责人id和投保类型统计邀约成功的潜客
	 */
	Integer countInviteSuccessCusNum(Map<String,Object> param)throws Exception;
	
	/**
	 * 统计上月留存潜客
	 */
	Integer countSylcqk(Map<String,Object> param) throws Exception;
	
	/**
	 * 统计本月新下发潜客数
	 */
	Integer countXxfqks(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据负责人id和投保类型统计预计到店人数
	 */
	Integer countYjddrs(Map<String,Object> param)throws Exception;
	
	/**
	 * 根据负责人id和投保类型统计邀约到店成功的潜客
	 */
	Integer countComeStoreCusNum(Map<String,Object> param)throws Exception;
	
	/**
	 * 根据负责人id和投保类型统计邀约到店成交的潜客
	 */
	Integer countComeStoreDealCusesNum(Map<String,Object> param)throws Exception;
	
	/**
	 * 统计绩效到店成交数
	 */
	Integer getJxDdcjs(Map<String,Object> param) throws Exception;
	
	/**
	 * 统计绩效到店数
	 */
	Integer getJxDds(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据id统计出单数
	 */
	Integer countEntryInranceNumById(Map<String, Object> map)throws Exception;

	/**
	 * 根据id统计报价数
	 */
	Integer countQuotedPriceNumById(Map<String, Object> map)throws Exception;
	
	/**
	 * 统计所有工作人员的待回退数量
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> countAllWorkNumByStatus(Map<String, Object> param)throws Exception;
	/**
	 * 统计所有工作人员的今日邀约数量
	 * JRYY:今日邀约
	 */
	List<Map<String, Object>> countWorkJRYYNum(Map<String, Object> param);
	/**
	 * 查询到店未出单员工列表
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findDDWCDWorkCollection(Map<String, Object> param)throws Exception;
	/**
	 * 查询到店未出单潜客列表
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findDDWCDCustomer(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询到店未出单潜客列表的总记录数
	 * @param param
	 * @return
	 */
	Integer findDDWCDCustomerCount(Map<String, Object> param) throws Exception;
	
	/**
	 * 查询已激活潜客列表
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findByJiHuoMap(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询已激活潜客列表的总记录数
	 * @param param
	 * @return
	 */
	Integer findByJiHuocount(Map<String, Object> param) throws Exception;
	
	/**
	 * 可删除邀约
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> selectKSCYY(Map<String, Object> param)throws Exception;
	/**
	 * 查询跟踪完成员工列表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findGZWCWorkCollection(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询已回退员工列表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findYHTWorkCollection(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询战败线索员工列表
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findZBXSWorkCollection(Map<String, Object> param) throws Exception;
	
}
