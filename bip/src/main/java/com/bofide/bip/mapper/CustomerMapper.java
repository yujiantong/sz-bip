package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Customer;

public interface CustomerMapper {
    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer customerid);

    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(Customer record) throws Exception;


    /**
     * 根据主键查询记录
     */
    Customer selectByPrimaryKey(Integer customerId);


    /**
     * 根据主键更新记录
     */
    int updateByPrimaryKey(Customer record);
    /**
     * 
     * @param param
     * @return 
     */
	List<Customer> findRenewalCustomer(Map<String, Object> param)throws Exception;

	int updateStatu(List<Customer> list)throws Exception;

	void updateToUnAssignStatu(Map<String, Object> map)throws Exception;


	List<Customer> findRenewalCustomer2(Map<String, Object> param)throws Exception;


	/*int updateStatu(List<Customer> list);*/
	
	/**
     * 根据车架号查询潜客
	 * @param storeId 
     */
	Customer findCustomerByCarNum(@Param("chassisNumber")String chassisNumber, @Param("storeId")Integer storeId)throws Exception;
	
	/**
	 * 修改本店投保次数
	 */
	void updateInsurNumber(@Param("storeId") Integer storeId,
			@Param("chassisNumber") String chassisNumber,
			@Param("insurNumber") Integer insurNumber,
			@Param("renewalType") Integer renewalType) throws Exception;
	/**
	 * 根据投保类型查询潜客
	 * @param param 
	 * @return
	 */
	List<Customer> findLostInsurCustomer()throws Exception;
	/**
	 * 更新虚拟保险到期日
	 * @param map
	 * @return
	 * @throws Exception
	 */
	void reSetCustomer(Map<String, Object> map)throws Exception;
	
	/**
	 * 更新潜客信息(大池子)
	 * @param map
	 * @throws Exception
	 */
	int updateCustomerInfo(Map<String, Object> map)throws Exception;
	/**
     * 更换负责人时,更新潜客当前负责人
     */
    void updatePrincipal(@Param("customerId")Integer customerId,@Param("principalId")Integer principalId,
    		@Param("principal")String principal)throws Exception;

	 void updateClerk(@Param("customerId")Integer customerId,@Param("clerkId")Integer clerkId,
    		@Param("clerk")String clerk)throws Exception;

	void updateLastYearIsDeal(@Param("lastYearIsDeal")Integer lastYearIsDeal, @Param("customerId")Integer customerId)throws Exception;

	void updateInsuracneDateStatuOnTime(Map<String, Object> param);
	void updateCustomerLevel(@Param("customerId")Integer customerId,@Param("customerLevel")String customerLevel) throws Exception;

	void updateVirtualJqxdqr(Map<String, Object> virtualMap);

	void deleteByStoreId(Integer storeId)throws Exception;

	void updateCustomerByImport(Customer customer) throws Exception;
	
	//存放根据壁虎信息修改过的潜客修改前的数据
	int insertCustomerToBihu(Customer record) throws Exception;
	
	//只根据潜客ID查询潜客
	Customer findCustomerById(@Param("customerId")Integer customerId)throws Exception;
	//根据店ID查询有持有人的所有潜客
	List<Customer> findAllCustomerByStoreIdYes(Map<String, Object> param)throws Exception;
	//根据店ID查询没有持有人的所有潜客（不包括分配未接受的）
	List<Customer> findAllCustomerByStoreIdNo(Map<String, Object> param)throws Exception;
	//修改壁虎的更新状态 
	void updateCustomerByUpdateStatus(@Param("storeId")Integer storeId) throws Exception;
	
	/**
	 * 根据车牌号查询潜客信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Customer> selectByCLNumber(Map<String, Object> map)throws Exception;
	
	void updateCustomerByRepairData(@Param("storeId")Integer storeId) throws Exception;
	
	/**
	 * 修复正常状态的潜客进入到已脱保页面的数据
	 * @throws Exception
	 */
	void updateYtbCustomerByRepairData() throws Exception;
	/**
	 * 修复正常状态的潜客进入到将脱保页面的数据
	 * @throws Exception
	 */
	void updateJtbCustomerByRepairData() throws Exception;
    /**
     * 查询刚导入的潜客，需要更新保险信息的潜客(大池子)
     * @param importFlag
     * @return
     */
	List<Customer> selectByImportFlag(Integer importFlag) throws Exception;
	/**
     * 定时更新刚导入的潜客，需要更新保险信息的潜客(大池子)
     * @param importFlag
     * @return
     */
	int updateBxMessageList(List<Customer> list) throws Exception;
    /**
     * 定时更新刚导入的潜客，需要更新保险信息的潜客(大池子)单个
     * @param customer
     * @return
     */
	int updateBxMessage(Customer customer) throws Exception;

}