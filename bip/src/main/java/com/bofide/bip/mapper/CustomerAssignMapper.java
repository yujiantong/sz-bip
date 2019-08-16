package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.User;

public interface CustomerAssignMapper {
    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer id);


    /**
     * 保存属性不为空的记录
     */
    int insertSelective(CustomerAssign record);

    /**
     * 根据主键查询记录
     */
    CustomerAssign selectByPrimaryKey(Integer id);

    /**
     * 根据不同id更新属性不为空的记录
     */
    int updateSelectiveByDifferentId(Map<String, Object> map);

    /**
     * 根据主键更新记录
     */
    int updateByPrimaryKey(CustomerAssign record);
    
    /**
     * 根据用户id和客户id查询潜客分配信息
     */
    CustomerAssign selectByCustUser(@Param("customerId")Integer customerId,@Param("userId")Integer userId);

    
	void updateInviteStatu(Map param) throws Exception;
	
	void updateAcceptStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId) throws Exception;
	
	void updateCseAcceptStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId) throws Exception;
	
	/**
     * 根据潜客id和用户id查询分配日期
     */
    String findAssignDate(@Param("customerId")Integer customerId,@Param("userId")Integer userId);
    
    /**
     * 根据潜客id查询该潜客是否分配给出单员
     */
    Integer findCustomerTraceId(@Param("customerId")Integer customerId) throws Exception;
    
    /**
     * 根据潜客id和用户id修改跟踪状态
     * @param userId 用户id
     * @param customerId 潜客id
     * @param statu 跟踪状态
     */
	void updateConsultantTraceStatu(@Param("customerId") Integer customerId, @Param("userId") Integer userId,
			@Param("statu") Integer statu) throws Exception;

    /**
     * 根据潜客id和用户或其上级id修改跟踪状态,同时修改自己和上级的跟踪状态
     * @param userId 用户id
     * @param superiorId 用户上级id
     * @param customerId 潜客id
     * @param statu 跟踪状态
     */
    void updateTraceStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId,
    		@Param("statu")Integer statu);
    
    /**
     * 根据潜客id和用户或其上级id修改跟踪完成状态
     * @param userId 用户id
     * @param superiorId 用户上级id
     * @param customerId 潜客id
     * @param traceStatu 跟踪状态
     */
    void updateTraceCompleteStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId,
    		@Param("traceStatu")Integer traceStatu,@Param("returnStatu")Integer returnStatu) throws Exception;
    
    
    /**
     * 更换负责人时,更新以前负责人的分配信息
     * @param customerId 潜客id
     * @param principalId 当前负责人id
     * @param userId 更换后负责人id
     */
    int updatePreviousAssignRecord(@Param("customerId")Integer customerId,@Param("userId")Integer userId,
			@Param("returnStatu")Integer returnStatu) throws Exception;
    
    /**
     * 更换负责人时,插入一条新的负责人的分配信息
     * @param customerId 潜客id
     * @param userId 新的负责人id
     */
	int insertNewPrincipalAssign(@Param("customerId")Integer customerId,@Param("userId")Integer userId,
			@Param("returnStatu")Integer returnStatu) throws Exception;

    /**
     * 更换负责人时,跟新当前负责人上级的分配信息
     * @param customerId 潜客id
     * @param superiorId 当前负责人上级的id
     */
    int updateSuperiorAssignRecord(@Param("customerId")Integer customerId,@Param("superiorId")Integer superiorId );
    
    /**
	 * 获取更新的记录的数据
	 */
	CustomerAssign findUpdateData(Map<String,Object> param) throws Exception;
	/**
	 * 在分配表插入客服专员的分配记录
	 * @param param
	 */
	void insertKfzy(Map param)throws Exception;

	
	/**
	 * 向分配表插入一天记录
	 * @param param
	 * @return 
	 */
	int insert(Map<String, Object> param)throws Exception;

	int updateUserReturnStatu(Map<String, Object> param)throws Exception;

	int updateSuperiorReturnStatu(Map<String, Object> param)throws Exception;

	void updatePrincipalReturnStatu(Map<String, Object> param)throws Exception;

	void updateSuperior(Map<String, Object> param)throws Exception;

	int deleteByCustomerIdAndUserId(Map<String, Object> param)throws Exception;

	void updateToKfzyWake(Map<String, Object> param)throws Exception;

	void updateToKfjlWake(Map<String, Object> param2)throws Exception;

	int assign(List<Map<String, Object>> list)throws Exception;

	int updateTraceStatuOnTime(Map<String,Object> param)throws Exception;

	CustomerAssign findXbzy(Map<String, Object> map)throws Exception;

	/*void updateReturnStatu(Map<String, Object> param);*/

	List<CustomerAssign> findAllAssignRecode(List<User> userList)throws Exception;

	Map<String, Object> findLeastCustomerByWorker(@Param("roleId")Integer roleId, @Param("fourSStoreId")Integer fourSStoreId)throws Exception;

	/*int assignSC(Map<String, Object> param);*/



	
	/**
	 * 延期操作(申请或审批),更新回退状态
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param superiorId 上级id
	 * @param returnStatu 回退状态
	 * @return 
	 */
	int updateReturnStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId,@Param("returnStatu")Integer returnStatu) throws Exception;
	
	/**
	 * 延期审批时,更新延期到期日
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param superiorId 上级id
	 * @param returnStatu 回退状态
	 * @return 
	 */
	int updateDelayDate(@Param("customerId")Integer customerId,
			@Param("userId")Integer userId) throws Exception;
	
	void updateDelayDate2(Map<String, Object> param)throws Exception;
	/**
	 * 删除分配记录
	 * @param list
	 * @return
	 */
	int deleteExistAssign(List<Customer> list)throws Exception;
	
	List<CustomerAssign> selectExistAssign(List<Customer> list)throws Exception; 
	
	void updateAssignInviteStatu(@Param("customerId")Integer customerId,
			@Param("userId")Integer userId,
			@Param("customerTraceId")Integer customerTraceId);
	
	/**
	 * 根据用户查询应跟踪数量
	 * @param userId 用户id
	 * @return
	 */
	int selectShouldTraceNum(@Param("userId")Integer userId) throws Exception;
	
	/**
	 * 根据用户查询已跟踪数量
	 * @param userId 用户id
	 * @return
	 */
	int selectTracedNum(@Param("userId")Integer userId) throws Exception;
	
	
	//查询用户是否存在分配信息
	int findExistAssign(@Param("customerId")Integer customerId,@Param("userId")Integer userId) throws Exception;

	/**
	 * 根据用户查询未接收数量
	 * @param userId 用户id
	 * @return
	 */
	int selectAcceptNum(@Param("userId")Integer userId) throws Exception;
	
	/**
	 * 根据用户查询待审批数量
	 * @param userId 用户id
	 * @return
	 */
	int selectApproveNum(@Param("userId")Integer userId) throws Exception;
	
	/**
	 * 根据用户查询待审批数量(续保专员)
	 * @param userId 用户id
	 * @return
	 */
	int selectApproveNumRC(@Param("userId")Integer userId) throws Exception;
	
	/**
	 * 查询待失销/已失销/已唤醒数量 
	 * @param userId 用户id
	 * @param returnStatu 4待失销5已失销6已唤醒
	 * @return
	 */
	int selectReturnNum(@Param("userId")Integer userId,
			@Param("returnStatu")Integer returnStatu) throws Exception;
	
	/**
     * 根据用户id修改其跟踪潜客的跟踪状态
     */
    int updateTraceStatustByUserId(@Param("userId")Integer userId,
    		@Param("traceStatu")Integer traceStatu);
    
    /**
     * 根据用户id查询未"跟踪完成"的潜客信息
     */
    List<CustomerAssign> findCustByUserId(@Param("userId")Integer userId) throws Exception;


	Map<String, Integer> findSADoYishixiao(@Param("roleId")Integer roleId, @Param("customerId")Integer customerId)throws Exception;

	CustomerAssign findAssignRecode(Map<String, Object> param)throws Exception;

	Integer findAssignRecodeByUserId(@Param("userId")Integer userId)throws Exception;

	void update(Map<String, Object> updateParam)throws Exception;

	void update2(Map<String, Object> updateParam)throws Exception;

	Integer findAcceptStatu(@Param("customerId")Integer customerId,@Param("userId")Integer userId) throws Exception;

	CustomerAssign findAssignRecode2(Map<String, Object> param)throws Exception;
	CustomerAssign findAssignRecode3(Map<String, Object> param)throws Exception;

	CustomerAssign findIsAssign(Map<String, Object> map)throws Exception;

	List<CustomerAssign> findAssignRecodeByCustomerId(@Param("customerId")Integer customerId)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;


	void updateByCustomerId(Map<String, Object> param)throws Exception;

	int deleteByCustomerId(@Param("customerId")Integer customerId) throws Exception;
	
	int findTraceStatu(@Param("customerId")Integer customerId) throws Exception;
	
	/**
	 * 根据潜客ID查询当前持有人
	 * @param customerId
	 * @return
	 * @throws Exception
	 */
	CustomerAssign findAssignByCustomerId(Integer customerId)throws Exception;


	//查询不包含参数的数据
	List<CustomerAssign> findAssignNoCustomer(@Param("customerId")Integer customerId, @Param("userId")Integer userId);

	//新插入一个分配信息后，删除和此不相关的分配信息
	void deleteById(@Param("id")Integer id);

	//取消睡眠后更新分配表中的信息
	void updateTraceStatuAndAcceptStatu(Map<String, Object> updateTraceAndAccept);
}