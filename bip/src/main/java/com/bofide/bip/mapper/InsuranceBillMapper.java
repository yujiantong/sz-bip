package com.bofide.bip.mapper;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.InsuranceBill;
import com.bofide.bip.po.InsuranceBillExpand;

public interface InsuranceBillMapper {
    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer insurancebillid);

    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(InsuranceBill record);

    /**
     * 根据主键更新记录
     */
    int updateByPrimaryKey(InsuranceBill record);
    
    /**
     * 根据承保类型和出单日期查询
     */
    List<InsuranceBill> findByCovertypeAndCdrq(Map<String, Object> param);
    
    /**
     * 统计“根据承保类型和出单日期查询”总数
     */
    Integer countFindByCovertypeAndCdrq(Map<String, Object> param);

    /**
     * 续保专员按投保类型查询保单
     */
    List<InsuranceBill> findRCInsuranceBill(Map<String, Object> param) throws Exception;
    
    /**
     * 统计"续保专员按投保类型查询保单"数量
     */
    Integer countFindRCInsuranceBill(Map<String, Object> param) throws Exception;
    
    /**
     * 销售或者服务顾问按投保类型查询保单
     */
    List<InsuranceBill> findSCOrSAInsuranceBill(Map<String, Object> param) throws Exception;
    
    /**
     * 统计"销售或者服务顾问按投保类型查询保单"数量
     */
    Integer countFindSCOrSAInsuranceBill(Map<String, Object> param) throws Exception;
    
    /**
     * 销售或者服务经理按投保类型查询保单
     */
    List<InsuranceBill> findSeMOrSaMInsuranceBill(Map<String, Object> param) throws Exception;
    
    /**
     * 统计"销售或者服务经理按投保类型查询保单"数量
     */
    Integer countFindSeMOrSaMInsuranceBill(Map<String, Object> param) throws Exception;
    
	/**
     * 查询明细
     * @param insuranceId
     * @return
     */
	InsuranceBill findDetail(Integer insuranceBillId) throws Exception;
	
	/**
     * 根据不同情况查询保单,保单的多功能查询
     */
	List<InsuranceBill> findByMoreCondition(InsuranceBillExpand record) throws Exception;
	
	List<InsuranceBill> findScMOrSaMByMoreCondition(InsuranceBillExpand record,@Param("roleId")Integer roleId) throws Exception;
	
	/**
     * 统计“根据不同情况查询保单,保单的多功能查询”总数
     */
    Integer countFindByMoreCondition(InsuranceBillExpand record) throws Exception;
	
	/**
	 * 根据车架号查询所有的保单
	 * @param chassisNumber
	 * @return
	 */
	List<InsuranceBill> findInsurBillByChassisNum(String chassisNumber);
	/**
     * 校验保单已入库
     */
	List<InsuranceBill> verifyInsuranceBill(
			@Param("chassisNumber") String chassisNumber,
			@Param("year") int year,
			@Param("fourSStoreId") Integer fourSStoreId,
			@Param("dateFlag") String dateFlag) throws Exception;
	
	/**
     * 校验保单已入库(交强险)
     */
	List<InsuranceBill> verifyInsuranceBill_jqxrq(
			@Param("chassisNumber") String chassisNumber,
			@Param("jqxrqStart") String jqxrqStart,
			@Param("jqxrqEnd") String jqxrqEnd,
			@Param("fourSStoreId") Integer fourSStoreId) throws Exception;
	/**
	 * 校验保单已入库(商业险）
	 */
	List<InsuranceBill> verifyInsuranceBill_syxrq(
			@Param("chassisNumber") String chassisNumber,
			@Param("syxrqStart") String syxrqStart,
			@Param("syxrqEnd") String syxrqEnd,
			@Param("fourSStoreId") Integer fourSStoreId) throws Exception;
	
	int findNewInsurBillNum(Map<String, Object> param)throws Exception;

	List<InsuranceBill> findInsurBillByPrincipalId(Map<String, Object> param)throws Exception;
	/**
	 * 根据车架号去查询所有保单并从大到小排序
	 * @param chassisNumber
	 * @return
	 */
	InsuranceBill findLastYearInsurBillInfo(@Param("chassisNumber")String chassisNumber,@Param("fourSStoreId")Integer fourSStoreId)throws Exception;
	
	void updateInsuranceBillInfo(Map<String, Object> map) throws Exception; 
	
	Map<String, Double> coverageSumNoTime(Map<String, Object> param)throws Exception;
	
	Map<String, Double> coverageSum(Map<String, Object> param)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;

	Integer countDqxbs(Map<String, Object> param)throws Exception;
	
	List<InsuranceBill> findDealInsuranceNum(Map<String, Object> param)throws Exception;

	Integer countZhxbs(Map<String, Object> param)throws Exception;
	
	Integer countQnZhxbs(Map<String, Object> param) throws Exception;
	
	Integer findBillCountToday(Map<String, Object> param) throws Exception;

	//按车架号校验本月是否已出单
	Integer findExistBillThisMonth(Map<String, Object> param) throws Exception;
	
	List<Map<String, Object>> findBillTodayCreate(Map<String, Object> param) throws Exception;
	
	Integer findBillTodayCreateCount(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据条件统计保费总额度
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Double sumPremiumCount(InsuranceBillExpand record) throws Exception;
	
	/**
	 * 查询所有没有被迁移数据的保单
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findBillAll()throws Exception;

	List<InsuranceBill> findRepeatBill(Integer fourSStoreId) throws Exception;
}