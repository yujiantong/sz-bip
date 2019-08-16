package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.vo.CustomerTraceRecodeVo;

@Transactional
public interface CustomerTraceRecodeMapper {
    /**
     * 根据主键删除记录
     */
    int updateByCustomerTraceId(Map param) throws Exception;

    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(CustomerTraceRecode record);

    /**
     * 保存属性不为空的记录
     */
    int insertSelective(CustomerTraceRecode record);

    /**
     * 根据主键查询记录
     */
    CustomerTraceRecode selectByPrimaryKey(Integer customerTraceId);

    /**
     * 根据主键更新属性不为空的记录
     */
    int updateByPrimaryKeySelective(CustomerTraceRecode record);

    /**
     * 根据主键更新记录
     */
    int updateByPrimaryKey(CustomerTraceRecode record);
    
    /**
     * 根据id更新是否进店
     */
    int updateByTraceId(@Param("customerTraceId")Integer customerTraceId);
    
    /**
     * 根据主键查询记录
     */
    List<CustomerTraceRecode> selectByCustId(Integer customerId);
    
    List<CustomerTraceRecode> findTraceRecordByCustomerId(@Param("customerId")Integer customerId) throws Exception;
    
    Integer findWzsgzsInExcetion(Map<String, Object> param) throws Exception;
    
	Integer findTraceRecodeByPrincipal(Map<String, Object> param)throws Exception;
	
	Integer findTraceRecodeNumByPrincipal(Map<String, Object> param);


	List<Map<String, Object>> findTraceYearGroup(Map<String, Object> param)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;
	
	/**
     * 根据潜客id查询潜客跟踪记录（批量）
     */
    List<CustomerTraceRecodeVo> findCustomerInfoByCustomerIdList(@Param("customerIds")List<Integer> customerIds) throws Exception;
    
    /**
     * 根据潜客id查询对应潜客的跟踪记录条数
     */
	int findTraceCount(Integer customerId) throws Exception;
	
	/**
     * 根据潜客id查询失销原因
     */
	String findLostReasonByCustomerId(Integer customerId) throws Exception;
	
	/**
	 * 根据潜客ID和用户ID查询当前跟踪次数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findGzCount(Map<String, Object> param) throws Exception;
	
	/**
	 * 根据潜客ID和跟踪记录ID查询除删除掉的邀约外,最新的邀约
	 */
	CustomerTraceRecode findLatestInviteRecord(Map<String, Object> param);
	
	/**
	 * 校验邀约日期是否可用
	 */
	int findRecordByInviteDate(Map<String, Object> param) throws Exception;
	
}