package com.bofide.bip.mapper;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Customer;
import com.bofide.bip.po.RenewalingCustomer;

public interface RenewalingCustomerMapper {
    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(Integer customerId);



    /**
     * 根据主键查询记录
     * @param storeId 
     */
    RenewalingCustomer selectByPrimaryKey(@Param("customerId")Integer customerId, @Param("storeId")Integer storeId);

    /**
     * 根据潜客id更新小池子里面的相关信息,可选择的更新
     */
    int updateSelectiveByCustomerId(Map<String, Object> map) throws Exception;

    
    /**
     * 根据车架号查询记录
     */
    RenewalingCustomer selectBychaNum(@Param("chassisNumber")String chassisNumber
    		,@Param("storeId")Integer storeId);

  
    /**
     * 按潜客的潜客脱保状态条件查询潜客
     * @param param
     * @return
     */
	List<RenewalingCustomer> findByCusLostInsurStatu(Map<String,Object> param)throws Exception;
	/**
     * 按潜客的潜客脱保状态条件查询潜客跟踪记录总数
     * @param param
     * @return
     */
	Integer countFindByCusLostInsurStatuGzjl(Map<String,Object> param)throws Exception;
	
	/**
	 * 其他岗位统计"按潜客的潜客脱保状态条件查询潜客"总数(将脱保，已脱保)
	 * @param param
	 * @return
	 */
	Integer countFindByCusLostInsurStatu(Map<String,Object> param) throws Exception;
	
	/**
	 * 管理岗位统计"按潜客的潜客脱保状态条件查询潜客"总数(将脱保，已脱保)
	 * @param param
	 * @return
	 */
	Integer countFindByCusLostInsurStatu1(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据保单日期状态查询潜客信息
	 * @param param
	 * @return
	 */
	List<RenewalingCustomer> findByTraceStatu(Map<String,Object> param) throws Exception;
	
	/**
	 * 统计"按跟踪状态条件查询潜客"总数(应跟踪，已跟踪)
	 * @param param
	 * @return
	 */
	Integer countFindByTraceStatu(Map<String,Object> param) throws Exception;
	/**
	 * 统计"按跟踪状态条件查询潜客跟踪记录"总数(应跟踪，已跟踪)
	 * @param param
	 * @return
	 */
	Integer countFindByTraceStatuGzjl(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据查询字段查询潜客信息
	 * @param param
	 * @return
	 */
	List<RenewalingCustomer> findByCondition(Map<String,Object> param) throws Exception;
	
	/**
	 * 统计"根据查询字段查询潜客信息"总数
	 * @param param
	 * @return
	 */
	Integer countFindByCondition(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据接受状态查询潜客信息
	 * @param param
	 * @return
	 */
	List<RenewalingCustomer> findByAcceptStatu(Map<String,Object> param) throws Exception;
	
	/**
	 * 统计"根据接受状态查询潜客信息"总数
	 * @param param
	 * @return
	 */
	Integer countFindByAcceptStatu(Map<String,Object> param) throws Exception;
	/**
	 * 统计"根据接受状态查询潜客信息跟踪记录"总数
	 * @param param
	 * @return
	 */
	Integer countFindByAcceptStatuGzjl(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据回退状态查询潜客信息
	 * @param param
	 * @return
	 */
	List<RenewalingCustomer> findByReturnStatu(Map<String,Object> param) throws Exception;
   
	/**
	 * 统计"根据回退状态查询潜客信息"总数
	 * @param param
	 * @return
	 */
	Integer countFindByReturnStatu(Map<String,Object> param) throws Exception;
	
	/**
	 * 根据回退状态查询潜客信息潜客跟踪记录总数
	 * @param param
	 * @return
	 */
	Integer countFindByReturnStatuGzjl(Map<String,Object> param) throws Exception;
	
    /**
     * 根据邀约日期查询邀约客户
     */
    List<RenewalingCustomer> findInvitedCust(Map<String,Object> param);
    
    /**
     * 统计"根据邀约日期查询邀约客户"数量
     */
    Integer countFindInvitedCust(Map<String,Object> param);
    /**
     * 统计"根据邀约日期查询邀约客户跟踪记录"数量
     */
    Integer countFindInvitedCustGzjl(Map<String,Object> param);

    /**
     * 根据邀约状态查询邀约客户
     */
	List<RenewalingCustomer> findByInviteStatuRC(Map<String,Object> param) throws Exception;

	/**
     * 统计"按邀约状态查询潜客"总数
     */
	Integer countFindByInviteStatu(Map<String,Object> param);
	
    /**
     * 根据潜客id查询潜客跟踪记录
     */
    RenewalingCustomer findCustomerInfoByCustomerId(@Param("customerId")Integer customerId) throws Exception;
    
    /**
	 * 根据多条件查询潜客信息
	 * @param param
	 * @return
	 */
	List<RenewalingCustomer> findCustomerByCondition(Map<String,Object> param) throws Exception;
	
	/**
     * 统计"根据多条件查询潜客信息"总数
     */
    Integer countFindCustByCondition(Map<String,Object> param) throws Exception;
    
    /**
     * 统计"根据多条件查询潜客信息跟踪记录"总数
     */
    Integer countFindCustByConditionGzjl(Map<String,Object> param) throws Exception;
    
	/**
     * 查询初始接收日期
     */
    String findFirstAcceptDate(@Param("customerId")Integer customerId);
    
    /**
     * 设置初始接收日期
     */
    void updateFirstAcceptDate(@Param("customerId")Integer customerId);
    
    /**
     * 修改应跟踪日期
     */
    void updateWillingTraceDate(@Param("customerId")Integer customerId,@Param("willingTraceDate")Date willingTraceDate);
    
    /**
     * 更换负责人时,更新潜客当前负责人
     */
    void updatePrincipal(@Param("customerId")Integer customerId,@Param("principalId")Integer principalId,
    		@Param("principal")String principal)throws Exception;
    
    /**
     * 销售,服务等经理更换负责人时,更新潜客当前业务员
     */
    void updateClerk(@Param("customerId")Integer customerId,@Param("clerkId")Integer clerkId,
    		@Param("clerk")String clerk)throws Exception;

	int insertUnAssignCustomer(Customer customer)throws Exception;

	void findExist(List<Customer> list)throws Exception;

	int deleteExist(List<Customer> list)throws Exception;

	List<RenewalingCustomer> findAssignCustomer(List<Customer> list)throws Exception;
	/**
	 * 查询符合更新潜客脱保状态的潜客
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	List<RenewalingCustomer> findUpdateCustomerLostStatu(@Param("storeId")Integer storeId)throws Exception;


	Integer findAllDealInsurance(Map<String, Object> param)throws Exception;

	Integer findAllDealCustomer(Map<String, Object> param)throws Exception;

	Integer findAllDealInsuranceNoTime(Map<String, Object> param)throws Exception;



	List<RenewalingCustomer> findByApproval(Map<String,Object> param)throws Exception;
	
	Integer findByApprovalCount(Map<String,Object> param)throws Exception;
	
	/**
	 * 查询待审批潜客跟踪记录总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Integer countFindByApprovalGzjl(Map<String,Object> param)throws Exception;


	Integer findAllDealInsurance2(Map<String, Object> param)throws Exception;

	List<RenewalingCustomer> findCoverInsurance2(Map<String, Object> param)throws Exception;

	/**
	 * 修改本店投保次数
	 */
	void updateInsurNumber(@Param("storeId") Integer storeId,
			@Param("chassisNumber") String chassisNumber,
			@Param("insurNumber") Integer insurNumber,
			@Param("renewalType") Integer renewalType) throws Exception;
	/**
	 * 更新将要续保的潜客表的虚拟保险到期日字段
	 * @param map
	 * @throws Exception
	 */
	void updateVirtualJqxdqr(Map<String, Object> map)throws Exception;
	
	/**
	 * 更新潜客信息(小池子)
	 * @param map
	 * @throws Exception
	 */
	int updateRenewalingCustomerInfo(Map<String, Object> map)throws Exception;
	
	/**
	 * 查询该店的所有潜客
	 * @param storeId
	 * @return
	 */
	List<RenewalingCustomer> findAllCsutomerByStoreId(@Param("storeId")Integer storeId);
	
	/**
	 * 定时更新潜客脱保状态
	 */
	int updateInsuracneDateStatuOnTime(Map<String, Object> param)throws Exception;

	Integer selectWillOutAndOutNum(Map<String, Object> param)throws Exception;
	
	/**
	 * 更新小池子里面的是否邀约
	 * @param customerId
	 * @throws Exception
	 */
	void updateIsInvite(@Param("customerId")Integer customerId) throws Exception;
	
	
	void updateCustomerLevel(@Param("customerId")Integer customerId,@Param("customerLevel")String customerLevel) throws Exception;
	/**
	 * 查询将要跟踪的潜客
	 * @param storeId 
	 * @return
	 */
	List<RenewalingCustomer> findWillTraceCustomer(@Param("storeId")Integer storeId)throws Exception;
	
	/**
	 * 更新负责人信息
	 * @param param
	 * @throws Exception
	 */
	void updatePrincipalInfo(Map<String,Object> param);

	List<RenewalingCustomer> findByCusLostInsurStatu2(Map<String, Object> param)throws Exception;

	Integer countFindByCusLostInsurStatu2(Map<String, Object> param)throws Exception;

	void updateToUnAssignStatu(Map<String, Object> map)throws Exception;

	List<RenewalingCustomer> findRCByStoreId(@Param("fourSStoreId")Integer fourSStoreId)throws Exception;

	RenewalingCustomer findRCBycustomerId(@Param("customerId")Integer customerId)throws Exception;

	void deleteByStoreId(Integer storeId)throws Exception;

	List<RenewalingCustomer> findCustomerByStoreIdAndChassisNumber(Map<String,Object> map) throws Exception;

	List<RenewalingCustomer> findActivateCustomer(Map<String, Object> param)throws Exception;

	/*int countFindActivateCustomer(Map<String, Object> param)throws Exception;*/
	//查询已唤醒总记录数 
	Integer findCountActivateCustomer(Map<String, Object> param)throws Exception;
	/**
	 * 查询已唤醒潜客跟踪记录总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Integer countFindActivateCustomerGzjl(Map<String, Object> param)throws Exception;

	List<RenewalingCustomer> findBeenLostCus(Map<String, Object> param)throws Exception;

	int findCountBeenLostCus(Map<String, Object> param)throws Exception;


	void updateData(Map<String, Object> map)throws Exception;

	/**
	 * 按回退状态查询潜客跟踪记录总数<管理> 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	int findCountBeenLostCusGzjl(Map<String, Object> param)throws Exception;
	
	
	List<RenewalingCustomer> fixData()throws Exception;
	
	void updateRenewalingCustomerByImport(Customer customer) throws Exception;

	List<Map<String, Object>> findInviteRecord(Map<String, Object> param) throws Exception;
	
	int findInviteRecordCount(Map<String, Object> param) throws Exception;
	
	//根据4SD店ID，车架号，车牌号，联系人，建档人查询所有潜客（分配与不分配均查询出来）
	public List<RenewalingCustomer> findCustomerByCreater(Map<String,Object> param)throws Exception;
		
	int findCustomerByCreaterCount(Map<String, Object> param)throws Exception;
	//按审批的类别查询待审批(回退待审批,延期待审批)
	Integer findCountByApprovalCategory(Map<String, Object> param) throws Exception;
	//查询今日到店数
	Integer findComeStoreCountToday(Map<String, Object> param) throws Exception;
	//查询今日到店未出单数
	Integer findComeStoreNoBillCountToday(Map<String, Object> param) throws Exception;
	
	/**
	 * 按状态和用户id查询潜客列表信息
	 * @param param
	 * @return list
	 * @throws Exception
	 */
	List<Map<String, Object>> findByStatuAndUserId(Map<String, Object> param) throws Exception;
	
	/**
	 * 按状态和用户id查询潜客列表的所有记录数
	 * @param param
	 * @return Integer
	 * @throws Exception
	 */
	Integer findCountByStatuAndUserId(Map<String, Object> param) throws Exception;
	
	//查询今日发起邀约潜客数
	Integer findInviteToday(Map<String, Object> param) throws Exception;


	/**
	 * 根据userId查询今日邀约的潜客列表
	 * @param param
	 * @return
	 */
	List<Map<String, Object>> findJRYYCustomerListByUserId(Map<String, Object> param)throws Exception;
	
	Integer findJRYYCustomerListCountByUserId(Map<String, Object> param)throws Exception;
	
	//已激活查询
	List<RenewalingCustomer> findByJiHuo(Map<String, Object> param)throws Exception;
	//已激活查询总数
	int countFindByJiHuo(Map<String, Object> param)throws Exception;
	
	//查询到店未出单潜客
	List<RenewalingCustomer> findDdwcdCus(Map<String, Object> param)throws Exception;
	//查询到店未出单潜客的总数
	int countDdwcdCus(Map<String, Object> param)throws Exception;
	//前台主管按不同状态查询潜客
	List<RenewalingCustomer> findByStatusQtzg(Map<String, Object> param) throws Exception;
	
	//前台主管按不同状态查询潜客总数
	int findByStatusQtzgCount(Map<String, Object> param) throws Exception;
	
	//前台主管的潜客查询
	List<RenewalingCustomer> findByConditionQtzg(Map<String, Object> param) throws Exception;
	
	//前台主管的潜客查询总数
	int findByConditionQtzgCount(Map<String, Object> param) throws Exception;
	
	//APP已回退查询
	List<Map<String, Object>> findYHTCustomerAPP(Map<String, Object> param) throws Exception;
		
	//APP已回退查询总数
	int findYHTCustomerCountAPP(Map<String, Object> param) throws Exception;
	
	//APP已失销查询
	List<Map<String, Object>> findYSXCustomerAPP(Map<String, Object> param) throws Exception;
			
	//APP已失销查询总数
	int findYSXCustomerCountAPP(Map<String, Object> param) throws Exception;
	
	//APP无状态查询潜客
	List<Map<String, Object>> findByConditionAPP(Map<String, Object> param) throws Exception;
				
	//APP无状态查询潜客总数
	int findByConditionCountAPP(Map<String, Object> param) throws Exception;
	
	//已回退查询潜客记录数
	List<RenewalingCustomer> findByYiHuiTui(Map<String, Object> param) throws Exception;
					
	//已回退查询潜客记录数总数
	int countFindByYiHuiTui(Map<String, Object> param) throws Exception;
	//已回退查询潜客记录数总数
	int findByReturnStatuGzjl(Map<String, Object> param) throws Exception;
	
	//APP顾问跟踪完成潜客列表查询
	List<Map<String, Object>> findGZFinishedCustomer(Map<String, Object> param) throws Exception;
						
	//APP顾问跟踪完成潜客列表查询总数
	int findGZFinishedCustomerCount(Map<String, Object> param) throws Exception;
	
	//修改邀约状态和邀约日期
	void updateInviteDateAndStatu(Map<String, Object> param) throws Exception;
	
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
	 * 统计某个角色持有的潜客数
	 * @throws Exception
	 */
	int countFindByRoleId(Map<String, Object> param) throws Exception;
	
	/**
     * 定时更新刚导入的潜客，需要更新保险信息的潜客(小池子)
     * @param importFlag
     * @return
     */
	int updateBxMessageList(List<RenewalingCustomer> list) throws Exception;

	/**
     * 定时更新刚导入的潜客，需要更新保险信息的潜客(小池子)单个
     * @param customer
     * @return
     */
	int updateBxMessage(RenewalingCustomer renewalingCustomer);
}