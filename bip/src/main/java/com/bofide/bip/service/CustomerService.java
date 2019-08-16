package com.bofide.bip.service;

import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bofide.bip.common.po.ReturnStatus;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.common.po.TraceStatus;
import com.bofide.bip.exception.CustomerNotMatchException;
import com.bofide.bip.exception.CustomerReceivedException;
import com.bofide.bip.exception.CustomerTracedException;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.mapper.ApprovalBillMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerBJRecodeMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.DefeatCustomerMapper;
import com.bofide.bip.mapper.DefeatCustomerRelateMapper;
import com.bofide.bip.mapper.InsuTypeMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.RoleMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.TraceDaySetMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Role;
import com.bofide.bip.po.User;
import com.bofide.common.util.CoverTypeStringUtil;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.DealStringUtil;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.CustomerBJRecode;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.GivingInformation;
import com.bofide.bip.po.InsuType;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;

/**
 *潜客服务类
 * @author lingzhenqing
 *
 */
@Service(value = "customerService")
@Transactional
public class CustomerService {
	private static Logger logger = Logger.getLogger(CustomerService.class);
	private static int PRINCIPAL_ROLEID = 2;
	private static int NO_RETURN_STATU = 1;
	private static int FINISHED_TRACE_STATU = 3;
	private static int DELAYED_RETURN_STATU = 8;
	private static int SLEEP_RETURN_STATU = 9;
	
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	
	@Resource(name = "approvalBillMapper")
	private ApprovalBillMapper approvalBillMapper;
	
	@Resource(name = "operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	
	@Resource(name = "customerBJRecodeMapper")
	private CustomerBJRecodeMapper customerBJRecodeMapper;
	
	@Autowired
	private AssignCustomerService assignCustomerService;
	
	@Autowired
	private UserService userService;
	
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	
	@Resource(name = "defeatCustomerMapper")
	private DefeatCustomerMapper defeatCustomerMapper;
	
	@Resource(name = "defeatCustomerRelateMapper")
	private DefeatCustomerRelateMapper defeatCustomerRelateMapper;
	
	@Resource(name = "roleMapper")
	private RoleMapper roleMapper;
	
	@Resource(name = "commonService")
	private CommonService commonService;
	
	@Resource(name="traceDaySetMapper")
	private TraceDaySetMapper traceDaySetMapper;
	
	@Resource(name = "sendPhoneMessageService")
	private SendPhoneMessageService sendPhoneMessageService;
		
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	
	@Resource(name = "insuTypeMapper")
	private InsuTypeMapper insuTypeMapper;
	
	/**
	 * 按潜客的潜客脱保状态条件查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByCusLostInsurStatu(Map<String,Object> param) throws Exception {
		logger.info("修改将脱保统计sql");
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByCusLostInsurStatu(param);
		return list;
	}
	
	/**
	 * 统计"按保单日期状态条件查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByCusLostInsurStatu1(Map<String,Object> param) throws Exception {
		logger.info("修改将脱保统计sql");
		Integer policyCount = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 统计"按保单日期状态条件查询潜客跟踪记录"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByCusLostInsurStatuGzjl(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByCusLostInsurStatuGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	
	/**
	 * 按跟踪状态条件查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByTraceStatu(Map<String,Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByTraceStatu(param);
		return list;
	}
	/**
	 * 统计"按跟踪状态条件查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByTraceStatu(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByTraceStatu(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 统计"按跟踪状态条件查询潜客跟踪记录"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByTraceStatuGzjl(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByTraceStatuGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 根据查询字段查询潜客信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByCondition(Map<String,Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByCondition(param);
		return list;
	}
	/**
	 * 统计"根据查询字段查询潜客信息"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByCondition(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByCondition(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 按接受状态查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByAcceptStatu(Map<String,Object> param) throws Exception {
		
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByAcceptStatu(param);
		return list;
	}
	/**
	 * 统计"按接受状态查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByAcceptStatu(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByAcceptStatu(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 统计"按接受状态查询潜客跟踪记录"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByAcceptStatuGzjl(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByAcceptStatuGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 按回退状态查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByReturnStatu(Map<String,Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByReturnStatu(param);
		return list;
	}
	/**
	 * 统计"按回退状态查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByReturnStatu(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByReturnStatu(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 统计"按回退状态查询潜客跟踪记录"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByReturnStatuGzjl(Map<String,Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByReturnStatuGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 按邀约状态查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByInviteStatu(Map<String,Object> param) throws Exception {
		List<RenewalingCustomer> list = null;
		Integer roleId = (Integer)param.get("roleId");
		if(roleId == RoleType.XBZY){
			list = renewalingCustomerMapper.findByInviteStatuRC(param);
		}else{
			list = renewalingCustomerMapper.findInvitedCust(param);
		}
		
		return list;
	}
	
	/**
	 * 统计"按邀约状态查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByInviteStatu(Map<String,Object> param) throws Exception {
		Integer roleId = (Integer)param.get("roleId");
		Integer policyCount = 0;
		if(roleId == 2){
			policyCount = renewalingCustomerMapper.countFindByInviteStatu(param);
		}else{
			policyCount = renewalingCustomerMapper.countFindInvitedCust(param);
		}
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 统计"按邀约状态查询潜客跟踪记录"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByInviteStatuGzjl(Map<String,Object> param) throws Exception {
		Integer roleId = (Integer)param.get("roleId");
		Integer policyCount = 0;
		if(roleId == 2){
			//policyCount = renewalingCustomerMapper.countFindByInviteStatu(param);
		}else{
			policyCount = renewalingCustomerMapper.countFindInvitedCustGzjl(param);
		}
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 续保专员回退
	 * @param customerId
	 * @param userId
	 * @param superiorId
	 * @param storeId 
	 * @param lastTraceResult 
	 * @param param 
	 * @throws Exception
	 */
	public void updateReturnStatu(Integer customerId,Integer userId,Integer superiorId,
			String returnReason, String userName, Integer storeId, String lastTraceResult,
			Integer principalId, String principal,String htyyxz,Integer applyStatu) throws Exception {
		//添加跟踪记录
		if("".equals(htyyxz)){
			htyyxz = "其他";
		}
		if(applyStatu==null){
			addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,htyyxz,userId);
		}else{
			addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		}
		
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		param.put("returnDate", new Date());
		param.put("returnStatu", 3);
		param.put("applyStatu", applyStatu);
		if(applyStatu!=null&&applyStatu==1){
			param.put("applyLossReason", htyyxz);
		}
		customerAssignMapper.updateUserReturnStatu(param);
	/*	int updateId2 = customerAssignMapper.updateSuperiorReturnStatu(param);*/
		
	}
	
	/**
	 * 续保专员撤销回退，失销，睡眠
	 * @param customerId
	 * @param userId
	 * @param returnReason
	 * @param lastTraceResult
	 * @param principalId
	 * @param principal
	 * @throws Exception
	 */
	public void cancelUpdateReturnStatu(Integer customerId,Integer userId,
			String returnReason, String lastTraceResult,Integer principalId, String principal) throws Exception {
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		param.put("returnDate", new Date());
		param.put("returnStatu", 1);
		customerAssignMapper.updateUserReturnStatu(param);
	}
	
	
	/**
	 * 新增潜客
	 * @param customer 潜客信息
	 * @param userId 
	 * @throws Exception
	 */
	public void saveCustomer(Customer customer,boolean generateCustomerFlag, Integer userId) throws Exception{
		//统一转换成大写
		customer.setChassisNumber(customer.getChassisNumber().toUpperCase());
		//虚拟virtualJqxdqr的值
		Date jqxrqEnd = customer.getJqxrqEnd();
		Calendar jqxrqEndCal = Calendar.getInstance();
		jqxrqEndCal.setTime(jqxrqEnd);
		String month = new Integer(jqxrqEndCal.get(Calendar.MONTH)+1).toString();
		String day = new Integer(jqxrqEndCal.get(Calendar.DAY_OF_MONTH)).toString();
		Calendar curCal = Calendar.getInstance();
		
		String curYear = new Integer(curCal.get(Calendar.YEAR)).toString();
		String curMonth = new Integer(curCal.get(Calendar.MONTH)+1).toString();
		String curDay = new Integer(curCal.get(Calendar.DAY_OF_MONTH)).toString();
		
		Date virtualJqxdqr = DateUtil.formatDate(curYear, month, day);
		//获取虚拟保险到期日
		//如果输入的交强险到期日大于当前时间+1年，则说明该潜客今年不应该被捞取，直接插入页面传入的保险到日期
		String curNextYear = new Integer(curCal.get(Calendar.YEAR)+1).toString();
		Date nextYearcurDate = DateUtil.formatDate(curNextYear, curMonth, curDay);
		//例如当前时间为2016/8/23,页面传递过来的是2017/8/24,则直接插入
		if(jqxrqEnd.getTime() >= nextYearcurDate.getTime() ){
			customer.setVirtualJqxdqr(jqxrqEnd);
		}else{
			customer.setVirtualJqxdqr(virtualJqxdqr);
		}
		customer.setStatus(1);
		customer.setDefeatFlag(1);
		
		if(generateCustomerFlag){
			customer.setDefeatFlag(2);
		}
		//新增潜客,分配潜客
		customerMapper.insert(customer);
		
		//BSP战败的潜客,生成BIP的潜客,修改战败潜客关联表的状态,记录相关信息
		if(generateCustomerFlag){
			Map<String,Object> map = new HashMap<>();
			map.put("storeId", customer.getFourSStoreId());
			map.put("contactWay", customer.getContactWay());
			map.put("deleted", 1);
			defeatCustomerRelateMapper.updateDefeatedRelateState(map);
			
			//添加操作记录信息
			Map<String,Object> generateMap = new HashMap<>();
			generateMap.put("userId", userId);
			generateMap.put("customerId", customer.getCustomerId());
			generateMap.put("operationFlag", 13);
			generateMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
			generateMap.put("coverType", customer.getRenewalType());
			//记录为生成潜客信息
			operationRecordMapper.insert(generateMap);
		}
		Integer fourSStoreId = customer.getFourSStoreId();
		List<Customer> customerList = new ArrayList<Customer>();
		customerList.add(customer);
		assignCustomerService.systemAssignRenewalCustomer(customerList,fourSStoreId);
		//添加跟踪记录
		String operation = "潜客建档";
		User user = userService.findUserById(userId);
		String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, user.getUserName());
		addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customer.getCustomerId(), lastTraceResult, lastTraceResult,null,null,userId);
	}
	
	/**
	 * 续保专员删除邀约
	 * @param customerTraceId
	 * @param userId
	 * @param userName 
	 * @param customerId 
	 * @param lastTraceResult 
	 * @throws Exception
	 */
	public void deleteInviteDay(Integer customerTraceId,Integer userId,
			String dealDeleteInvietReason, String userName, 
			Integer customerId, String lastTraceResult,Integer principalId,
			String principal) throws Exception {
		//添加跟踪处理
		addTraceRecord(principalId, principal, customerId, dealDeleteInvietReason,lastTraceResult,null,null,userId);
		
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("userId", userId);
		param.put("customerTraceId", customerTraceId);
		//将跟踪记录表的邀约日期更新为空
		customerTraceRecodeMapper.updateByCustomerTraceId(param);
		//如果该潜客被邀约了多次，只有邀约被全部删除才需要更改分配记录中的邀约状态
		List<CustomerTraceRecode> invateTraceRecords = new ArrayList<CustomerTraceRecode>();
		List<CustomerTraceRecode> traceRecords = customerTraceRecodeMapper.findTraceRecordByCustomerId(customerId);
		for(CustomerTraceRecode customerTraceRecode : traceRecords){
			Integer invite = customerTraceRecode.getInvite();
			Integer operatorId = customerTraceRecode.getOperatorID();
			//该跟踪记录是否有邀约
			if(invite != null && invite == 1 && operatorId != null && operatorId.equals(userId)){
				Date inviteDate = customerTraceRecode.getInviteDate();
				Calendar cal = Calendar.getInstance();
				Date date = DateUtil.formatDate(cal);
				//如果该记录有邀约，是否有邀约日期，并且该邀约日期是否有效，如果存在有效的邀约日期则将该跟踪记录存放在invateTraceRecords
				if(inviteDate != null && inviteDate.getTime() > date.getTime()){
					invateTraceRecords.add(customerTraceRecode);
				}
			}
		}
		//如果invateTraceRecords的size大于0，说明该潜客的跟踪记录存在有效的邀约，不更新分配表中的邀约状态为1
		if(invateTraceRecords.size() <= 0){
			customerAssignMapper.updateInviteStatu(param);
		}
		
		//把小池子的邀约日期更新成空,如果有多次邀约,更新成最新的那个
		param.put("customerId", customerId);
		CustomerTraceRecode traceRecode = customerTraceRecodeMapper.findLatestInviteRecord(param);
		if(traceRecode !=null&&traceRecode.getInviteDate() !=null){
			param.put("inviteDate", traceRecode.getInviteDate());
			renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
		}else{
			param.put("isInvite", 0);
			param.put("inviteDate", null);
			renewalingCustomerMapper.updateInviteDateAndStatu(param);
		}
		
	}

	/**
	 * 续保专员接受处理
	 * 
	 * @param customerId
	 * @param userId
	 * @param userName 
	 * @param traceRecordReason 
	 * @param lastTraceResult 
	 * @param principalId
	 * @param principal
	 * @throws Exception 
	 */
	public void updateAcceptStatu(Integer customerId,Integer userId,String userName, String traceRecordReason, 
			String lastTraceResult,Integer principalId, String principal) throws Exception{
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, traceRecordReason, lastTraceResult,null,null,userId);
				
		Integer acceptStatu = customerAssignMapper.findAcceptStatu(customerId, userId);
		if(acceptStatu != null && acceptStatu == 2){
			throw new CustomerReceivedException("用户id为"+ userId +"的用户已经接收过潜客id为" + customerId + "的潜客");
		}
		CustomerAssign customerAssign = findLastStatu(customerId,userId);
		if(customerAssign != null){
			if(customerAssign.getTraceStatu() !=null && customerAssign.getTraceStatu() ==3){
				throw new CustomerTracedException("潜客id为" + customerId + "的潜客的跟踪状态为跟踪完成");
			}
		}
		String firstAcceptDate = renewalingCustomerMapper.findFirstAcceptDate(customerId);
		if(firstAcceptDate == null){
			renewalingCustomerMapper.updateFirstAcceptDate(customerId);
		}
		//更改自己的接收状态
		customerAssignMapper.updateAcceptStatu(customerId, userId);
		//接收时,需要同步小池子的潜客应跟踪日期
		renewalingCustomerMapper.updateWillingTraceDate(customerId,new Date());
		
		
	}

	/**
	 * 续保专员接受处理(批量)
	 * 
	 * @param custInfoList 客户信息list
	 * @param lastTraceResult2 
	 * @param operation 
	 * @return void
	 * @throws Exception 
	 */

	public void updateAcceptStatuBatch(List<Map<String,Object>> custInfoList, String traceRecordReason, String lastTraceResult) throws Exception {
		for (Map<String,Object> map : custInfoList) {
			Integer customerId = (Integer)map.get("customerId");
			Integer userId = (Integer)map.get("userId");
			//String userName = (String) map.get("userName");
			Integer principalId = (Integer)map.get("principalId");
			String principal = (String) map.get("principal");
			
			Integer acceptStatu = customerAssignMapper.findAcceptStatu(customerId, userId);
			if(acceptStatu != null && acceptStatu == 2){
				throw new CustomerReceivedException("用户id为"+ userId +"的用户已经接收过潜客id为" + customerId + "的潜客");
			}
			CustomerAssign customerAssign = findLastStatu(customerId,userId);
			if(customerAssign != null){
				if(customerAssign.getTraceStatu() !=null && customerAssign.getTraceStatu() ==3){
					throw new CustomerTracedException("潜客id为" + customerId + "的潜客的跟踪状态为跟踪完成");
				}
			}
			//添加跟踪记录
			addTraceRecord(principalId, principal, customerId, traceRecordReason,lastTraceResult,null,null,userId);
			
			String firstAcceptDate = renewalingCustomerMapper.findFirstAcceptDate(customerId);
			if(firstAcceptDate == null){
				renewalingCustomerMapper.updateFirstAcceptDate(customerId);
			}
			//更改自己的接收状态
			customerAssignMapper.updateAcceptStatu(customerId, userId);
			//接收时,需要同步小池子的潜客应跟踪日期
			renewalingCustomerMapper.updateWillingTraceDate(customerId,new Date());
			
		}
	}
	
	
	public void updateForAction(Integer customerId, Date willingTraceDate, Date lastTraceDate, String lastTraceResult) throws Exception {
		Map<String,Object> rcMap = new HashMap<>();
		rcMap.put("customerId", customerId);
		//更新潜客(小池子)应跟踪时间
		rcMap.put("willingTraceDate", willingTraceDate);
		//更新潜客表(小池子)的末次跟踪日期
		rcMap.put("lastTraceDate", lastTraceDate);
		//更新潜客表(小池子)的末次跟踪结果
		rcMap.put("lastTraceResult", lastTraceResult);
		renewalingCustomerMapper.updateSelectiveByCustomerId(rcMap);
	}
	/**
	 * 续保专员 接收潜客 添加负责人.(修改principal为空bug)
	 * 2018-05-03 tiandefei
	 * @param customerId
	 * @param willingTraceDate
	 * @param lastTraceDate
	 * @param lastTraceResult
	 * @throws Exception
	 */
	public void updateForRenewalingCustomer(Integer customerId, Date willingTraceDate, Date lastTraceDate, String lastTraceResult,String principal,Integer principalId) throws Exception {
		Map<String,Object> rcMap = new HashMap<>();
		rcMap.put("customerId", customerId);
		//更新潜客(小池子)应跟踪时间
		rcMap.put("willingTraceDate", willingTraceDate);
		//更新潜客表(小池子)的末次跟踪日期
		rcMap.put("lastTraceDate", lastTraceDate);
		//更新潜客表(小池子)的末次跟踪结果
		rcMap.put("lastTraceResult", lastTraceResult);
		if(principal !=null && !"".equals(principal) && principalId !=null && !"".equals(principalId)){
			//更新潜客表(小池子)的 负责人
			rcMap.put("principal", principal);
			//更新潜客表(小池子)的负责人id
			rcMap.put("principalId", principalId);
		}
		
		renewalingCustomerMapper.updateSelectiveByCustomerId(rcMap);
	}

	/**
	 * 客服专员接受处理(批量)
	 * @param custInfoList 客户信息list
	 * @param lastTraceResult 
	 * @param operation 
	 * @return void
	 */
	public void updateCseAcceptStatuBatch(List<Map<String,Object>> custInfoList, String traceRecordReason, String lastTraceResult) throws Exception{
		for (Map<String,Object> map : custInfoList) {
			Integer customerId = (Integer)map.get("customerId");
			Integer userId = (Integer)map.get("userId");
			Integer principalId=null;
			//String userName = (String) map.get("userName");
			Object object = map.get("principalId");
			//Integer principalId = (Integer)map.get("principalId");
			if(object!=null && object!="" && !object.equals(null)){
				principalId = (Integer)map.get("principalId");
			}
			String principal = (String) map.get("principal");
			Integer acceptStatu = customerAssignMapper.findAcceptStatu(customerId, userId);
			if(acceptStatu != null && acceptStatu == 2){
				throw new CustomerReceivedException("用户id为"+ userId +"的用户已经接收过潜客id为" + customerId + "的潜客");
			}
			CustomerAssign customerAssign = findLastStatu(customerId,userId);
			if(customerAssign != null){
				if(customerAssign.getTraceStatu() !=null && customerAssign.getTraceStatu() ==3){
					throw new CustomerTracedException("潜客id为" + customerId + "的潜客的跟踪状态为跟踪完成");
				}
			}
			
			//添加跟踪记录
			addTraceRecord(principalId, principal, customerId, traceRecordReason, lastTraceResult,null,null,userId);
			
			//更改自己的接收状态
			customerAssignMapper.updateCseAcceptStatu(customerId, userId);
			
		}
	}
	
//	/**
//	 * 销售,服务等顾问接受处理
//	 * @param lastTraceResult2 
//	 * @param operation 
//	 * @throws Exception 
//	 */
//	public void updateConsultantAcceptStatu(Integer customerId,Integer userId,String userName, String traceRecordReason, String lastTraceResult,Integer principalId, String principal) throws Exception{
//		Integer acceptStatu = customerAssignMapper.findAcceptStatu(customerId, userId);
//		if(acceptStatu != null && acceptStatu == 2){
//			throw new CustomerReceivedException("用户id为"+ userId +"的用户已经接收过潜客id为" + customerId + "的潜客");
//		}
//		CustomerAssign customerAssign = findLastStatu(customerId,userId);
//		if(customerAssign != null){
//			if(customerAssign.getTraceStatu() !=null && customerAssign.getTraceStatu() ==3){
//				throw new CustomerTracedException("潜客id为" + customerId + "的潜客的跟踪状态为跟踪完成");
//			}
//		}
//		String firstAcceptDate = renewalingCustomerMapper.findFirstAcceptDate(customerId);
//		if(firstAcceptDate == null){
//			renewalingCustomerMapper.updateFirstAcceptDate(customerId);
//		}
//		//更改自己的接收状态
//		customerAssignMapper.updateAcceptStatu(customerId, userId);
//		//接收时,需要同步小池子的潜客应跟踪日期
//		renewalingCustomerMapper.updateWillingTraceDate(customerId,new Date());
//		//添加跟踪记录
//		addTraceRecord(principalId, principal, customerId, traceRecordReason,lastTraceResult);
//	}
	/**
	 * 管理人员不同意回退
	 * @param customerId
	 * @param userId
	 * @param principalId
	 * @param storeId 
	 * @param lastTraceResult 
	 * @throws Exception 
	 */
	public void updateReturnStatuUnAgree(Integer customerId, Integer userId, Integer principalId,String principal,
			String returnReason, String userName, Integer storeId, String lastTraceResult) throws Exception {
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		param.put("returnStatu", 1);
		param.put("returnDate", new Date());
		//修改管理人员自己的分配记录的回退状态为未回退(1)
		customerAssignMapper.updateUserReturnStatu(param);
		
	}
	
	/**
	 * 销售,服务等顾问接受处理(批量)
	 * @param custInfoList 客户信息list
	 * @param lastTraceResult2 
	 * @param operation 
	 * @return void
	 */
	public void updateConsultantAcceptStatuBatch(List<Map<String,Object>> custInfoList, String traceRecordReason, String lastTraceResult) throws Exception{
		for (Map<String,Object> map : custInfoList) {
			Integer customerId = (Integer)map.get("customerId");
			Integer userId = (Integer)map.get("userId");
			//String userName = (String)map.get("userName");
			Integer principalId = (Integer)map.get("principalId");
			String principal = (String) map.get("principal");
			Integer acceptStatu = customerAssignMapper.findAcceptStatu(customerId, userId);
			if(acceptStatu != null && acceptStatu == 2){
				throw new CustomerReceivedException("用户id为"+ userId +"的用户已经接收过潜客id为" + customerId + "的潜客");
			}
			CustomerAssign customerAssign = findLastStatu(customerId,userId);
			if(customerAssign != null){
				if(customerAssign.getTraceStatu() !=null && customerAssign.getTraceStatu() ==3){
					throw new CustomerTracedException("潜客id为" + customerId + "的潜客的跟踪状态为跟踪完成");
				}
			}
			
			//添加跟踪记录
			addTraceRecord(principalId, principal, customerId, traceRecordReason, lastTraceResult,null,null,userId);
			
			String firstAcceptDate = renewalingCustomerMapper.findFirstAcceptDate(customerId);
			if(firstAcceptDate == null){
				renewalingCustomerMapper.updateFirstAcceptDate(customerId);
			}
			//更改自己的接收状态
			customerAssignMapper.updateAcceptStatu(customerId, userId);
			//接收时,需要同步小池子的潜客应跟踪日期
			renewalingCustomerMapper.updateWillingTraceDate(customerId,new Date());
			
		}
	}
	
	/**
	 * 续保主管回退
	 * @param customerId
	 * @param userId
	 * @param principalId
	 * @param lastTraceResult 
	 * @param fourSStoreId 
	 * @throws Exception
	 */
	public void updateReturnStatuXbzg(Integer customerId, Integer userId,Integer principalId, String principal,
			String returnReason,String userName, Integer storeId, String lastTraceResult) throws Exception {
		//添加跟踪处理
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", principalId);
		param.put("returnDate", new Date());
		param.put("returnStatu", 2);
		param.put("traceStatu", 3);
		param.put("traceDate", new Date());
		param.put("operationFlag", 2);
		param.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		//修改续保专员的分配记录的回退状态为已回退(2)
		customerAssignMapper.updateUserReturnStatu(param);
		//向操作表insert当前操作记录
		operationRecordMapper.insert(param);
		//获取更新的记录的数据
		CustomerAssign ca = customerAssignMapper.findUpdateData(param);
		//回退后分配客服专员
		insertKfzy(ca,storeId,customerId);
		
	}
	
	
	private void insertKfzy(CustomerAssign ca,Integer storeId, Integer customerId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		//查询分配潜客最少的客服专员，并分配给他
		Integer roleId = RoleType.KFZY;
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		Integer renewalType = renewalingCustomer.getRenewalType();
		User user = userService.findAssignCustomerUser(roleId, storeId,renewalType);
		//User user = assignCustomerService.findLeastCustomerByWorker(roleId, storeId);
		if(user != null){
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("userId", user.getId());
			map.put("customerId", customerId);
			//根据潜客id和用户id查询是否存在没有跟踪完成的分配记录
			CustomerAssign findAssignRecode = customerAssignMapper.findIsAssign(map);
			if(findAssignRecode != null){
				//如果不为空，说明该次回退时已经失销——唤醒后，再次回退，此时不insert新的记录，而是更新该记录
				param.put("customerId", ca.getCustomerId());
				param.put("userId", user.getId());
				param.put("traceStatu", 0);
				param.put("traceDate", null);
				param.put("inviteStatu", null);
				param.put("inviteDate", null);
				param.put("acceptStatu", 1);
				param.put("acceptDate", null);
				param.put("returnStatu", null);
				param.put("returnDate",null);
				param.put("customerTraceId", null);
				param.put("assignDate", new Date());
				param.put("delayDate",ca.getDelayDate());
				customerAssignMapper.update2(param);
			}else{
				param.put("customerId", ca.getCustomerId());
				param.put("userId", user.getId());
				param.put("traceStatu", 0);
				param.put("traceDate", null);
				param.put("inviteStatu", null);
				param.put("inviteDate", null);
				param.put("acceptStatu", 1);
				param.put("acceptDate", null);
				param.put("returnStatu", null);
				param.put("returnDate",null);
				param.put("customerTraceId", null);
				param.put("assignDate", new Date());
				param.put("delayDate",ca.getDelayDate());
				customerAssignMapper.insert(param);
			}
		}else{
			throw new NoUserAssignException("回退失败，没有客服接收");
		}
		
		
	}

	/**
	 * 更换负责人
	 * @param lastTraceResult 
	 * @param customer 潜客信息
	 * @throws Exception
	 */
	public void updatePrincipal(Integer customerId, Integer principalId,
			String principal,Integer prePrincipalId,String prePrincipal,String returnReason, String userName,
			String lastTraceResult, Integer userId) throws Exception{
		//添加跟踪记录
		addTraceRecord(prePrincipalId, prePrincipal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		//跟新当前负责人的跟踪状态
		customerAssignMapper.updateConsultantTraceStatu(customerId, prePrincipalId, FINISHED_TRACE_STATU);
		
		//判断新的负责人是否有该潜客的分配信息
		int existCount = customerAssignMapper.findExistAssign(customerId, principalId); 
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		Date virtualJqxdqr = customer.getVirtualJqxdqr();
		if (existCount > 0) {
			if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
				//如果潜客已脱保,则更新回退状态为已延期
				int count = customerAssignMapper.updatePreviousAssignRecord(customerId, principalId,DELAYED_RETURN_STATU);
				if(count > 0){
					//修改延期日期
					customerAssignMapper.updateDelayDate(customerId, principalId);
				}
			}else{
				// 存在分配信息则更新相应状态
				customerAssignMapper.updatePreviousAssignRecord(customerId, principalId,NO_RETURN_STATU);
			}
		} else {
			if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
				//如果潜客已脱保,则分配时自动进行延期
				int count = customerAssignMapper.insertNewPrincipalAssign(customerId, principalId, DELAYED_RETURN_STATU);
				if(count > 0){
					//修改延期日期
					customerAssignMapper.updateDelayDate(customerId, principalId);
				}
			}else{
				//添加一条新的负责人的分配信息
				customerAssignMapper.insertNewPrincipalAssign(customerId, principalId, NO_RETURN_STATU);
			}
			//新插入一个分配信息后，删除和此不相关的分配信息(旧的续保专员的分配信息)
			List<CustomerAssign> customerAssignList = customerAssignMapper.findAssignNoCustomer(customerId, principalId);
			if(customerAssignList.size()>0){
				for (CustomerAssign customerAssign : customerAssignList) {
					customerAssignMapper.deleteById(customerAssign.getId());
				}
			}
		}
		
		Map<String, Object> map = new HashMap<>();
		map.put("customerId", customerId);
		map.put("principalId", principalId);
		map.put("principal", principal);
		// 修改大池子潜客的负责人
		customerMapper.updateCustomerInfo(map);
		// 修改小池子潜客的负责人
		renewalingCustomerMapper.updateRenewalingCustomerInfo(map);
		
		//将操作记录操作记录表
		Map<String,Object> outMap = new HashMap<>();
		outMap.put("userId", prePrincipalId);
		outMap.put("customerId", customerId);
		outMap.put("operationFlag", 5);
		outMap.put("virtualJqxdqr",virtualJqxdqr);
		//被换掉的人记录为转出信息
		operationRecordMapper.insert(outMap);
		
		Map<String,Object> intoMap = new HashMap<>();
		intoMap.put("userId", principalId);
		intoMap.put("customerId", customerId);
		intoMap.put("operationFlag", 4);
		//新的负责人记录为转入信息
		operationRecordMapper.insert(intoMap);
		intoMap.put("operationFlag", 6);
		intoMap.put("coverType", customer.getRenewalType());
		intoMap.put("virtualJqxdqr",virtualJqxdqr);
		intoMap.put("assignSource", 3);
		//新的负责人记录为分配信息
		operationRecordMapper.insert(intoMap);
		
	}
	
	/**
	 * 销售,服务等经理更换负责人
	 * @param customerId 潜客id
	 * @param clerkId 更换后业务员id
	 * @param clerk 更换后业务员
	 * @param userId 更换前负责人id
	 * @param lastTraceResult 
	 * @param superiorId 更换前负责人上级id,即更换接收人的操作者
	 * @throws Exception
	 */
	public void updateManagerChangePrincipal(Integer customerId, Integer clerkId,
			String clerk,Integer prePrincipalId,String prePrincipal, String returnReason,
			String userName, String lastTraceResult,Integer userId) throws Exception{
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		//添加跟踪记录
		addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customerId, returnReason,lastTraceResult,null,null,userId);
				
		//跟新当前负责人的跟踪状态
		customerAssignMapper.updateConsultantTraceStatu(customerId, prePrincipalId, FINISHED_TRACE_STATU);
		
		//判断新的负责人是否有该潜客的分配信息
		int existCount = customerAssignMapper.findExistAssign(customerId, clerkId);
		if (existCount > 0) {
			if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
				//如果潜客已脱保,则更新回退状态为已延期
				int count = customerAssignMapper.updatePreviousAssignRecord(customerId, clerkId,DELAYED_RETURN_STATU);
				if(count > 0){
					//修改延期日期
					customerAssignMapper.updateDelayDate(customerId, clerkId);
				}
			}else{
				// 存在分配信息则更新相应状态
				customerAssignMapper.updatePreviousAssignRecord(customerId, clerkId,NO_RETURN_STATU);
			}
		} else {
			if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
				//如果潜客已脱保,则分配时自动进行延期
				int count = customerAssignMapper.insertNewPrincipalAssign(customerId, clerkId, DELAYED_RETURN_STATU);
				if(count > 0){
					//修改延期日期
					customerAssignMapper.updateDelayDate(customerId, clerkId);
				}
			}else{
				//添加一条新的业务员的分配信息
				customerAssignMapper.insertNewPrincipalAssign(customerId, clerkId, NO_RETURN_STATU);
			}
		}
		
		Map<String, Object> map = new HashMap<>();
		map.put("customerId", customerId);
		map.put("clerkId", clerkId);
		map.put("clerk", clerk);
		// 修改大池子潜客的业务员
		customerMapper.updateCustomerInfo(map);
		// 修改小池子潜客的业务员
		renewalingCustomerMapper.updateRenewalingCustomerInfo(map);
			
		//将操作记录操作记录表
		Map<String,Object> outMap = new HashMap<>();
		outMap.put("userId", prePrincipalId);
		outMap.put("customerId", customerId);
		outMap.put("operationFlag", 5);
		outMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		//被换掉的人记录为转出信息
		operationRecordMapper.insert(outMap);
				
		Map<String,Object> intoMap = new HashMap<>();
		intoMap.put("userId", clerkId);
		intoMap.put("customerId", customerId);
		intoMap.put("operationFlag", 4);
		//新的负责人记录为转入信息
		operationRecordMapper.insert(intoMap);
		intoMap.put("operationFlag", 6);
		intoMap.put("coverType", customer.getRenewalType());
		intoMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		intoMap.put("assignSource", 3);
		//新的负责人记录为分配信息
		operationRecordMapper.insert(intoMap);
		
	}
	
	/**
	 * 跟踪完成操作(顾问)
	 * @param assign 顾问信息
	 * @param commissionerAssign 续保专员分配信息
	 * @param storeId 4s店id
	 * @param string 
	 * @param lastTraceResult 
	 * @throws Exception
	 */
	public void insertNewAssign(CustomerAssign assign, CustomerAssign commissionerAssign, 
			Integer storeId,String userName, String lastTraceResult,Integer principalId,
			String principal,Integer roleId) throws Exception {
		String traceContext = "操作：跟踪完成；操作人：" + userName;
		//添加跟踪记录
		addTraceRecord(principalId, principal, assign.getCustomerId(), traceContext,lastTraceResult,null,null,assign.getUserId());
		//更新自己和上级的跟踪状态
		customerAssignMapper.updateTraceCompleteStatu(assign.getCustomerId(), assign.getUserId(), 3, ReturnStatus.TRACK_COMPLETE);
		logger.info("用户id为:" + assign.getUserId() + "的用户对潜客id为" +assign.getCustomerId()+ "的潜客做了跟踪完成的操作");
		logger.info("潜客id为" + assign.getCustomerId() + "的潜客分配给用户id为"+ commissionerAssign.getUserId()+"的用户");
		//给续保专员添加一条分配信息
		int assignCount = customerAssignMapper.insertSelective(commissionerAssign);
		String newPrincipal = userMapper.findUserNameByStoreIdAndUserId(storeId, commissionerAssign.getUserId());
		if(assignCount > 0){
			renewalingCustomerMapper.updateWillingTraceDate(assign.getCustomerId(), null);
			//int superiorAssignCount = customerAssignMapper.insertSelective(superiorAssign);
			renewalingCustomerMapper.updatePrincipal(assign.getCustomerId(), commissionerAssign.getUserId(), newPrincipal);
			customerMapper.updatePrincipal(assign.getCustomerId(), commissionerAssign.getUserId(), newPrincipal);
		}
		Customer customer = customerMapper.selectByPrimaryKey(commissionerAssign.getCustomerId());
		Date virtualJqxdqr = customer.getVirtualJqxdqr();
		Map<String,Object> map = new HashMap<>();
		map.put("userId", commissionerAssign.getUserId());
		map.put("customerId", commissionerAssign.getCustomerId());
		map.put("operationFlag", 6);
		map.put("coverType", customer.getRenewalType());
		map.put("virtualJqxdqr", virtualJqxdqr);
		if(roleId==6){
			map.put("assignSource", 1);
		}else if(roleId==8){
			map.put("assignSource", 2);
		}
		//给续保专员添加一条分配记录,需要记录为分配信息
		operationRecordMapper.insert(map); 
		
	}
	/**
	 * 服务顾问或是销售顾问回退潜客
	 * @param customerId
	 * @param userId
	 * @param storeId 
	 * @param lastTraceResult 
	 * @throws Exception 
	 */
	public void updateReturnByPrincipal(Integer customerId, Integer userId, 
			Integer superiorId, String returnReason,String userName, Integer storeId, String lastTraceResult,
			Integer principalId,String principal) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		param.put("returnStatu", 3);
		param.put("returnDate", new Date());
		//销售顾问更改状态为待回退
		customerAssignMapper.updateUserReturnStatu(param);
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
	}
	/**
	 * 服务经理或是销售经理回退潜客
	 * @param customerId
	 * @param userId
	 * @param fourSStoreId 
	 * @param lastTraceResult 
	 * @throws Exception 
	 */
	public void updateReturnBySuperior(Integer customerId, Integer userId, Integer clerkId, 
			Integer fourSStoreId, String returnReason, String userName, String lastTraceResult,
			Integer principalId, String principal) throws Exception {
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("userId", clerkId);
		param.put("returnStatu", 2);
		param.put("customerId", customerId);
		param.put("sfgyx", 0);
		
		//将大小池子潜客设置高意向为否
		customerMapper.updateCustomerInfo(param);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
		
		param.put("returnDate", new Date());
		param.put("traceStatu", 3);
		param.put("traceDate", new Date());
		param.put("coverType", customer.getRenewalType());
		param.put("operationFlag", 2);
		param.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		//修改销售专员的回退状态
		customerAssignMapper.updateUserReturnStatu(param);
		//向操作表添加一条回退操作记录
		operationRecordMapper.insert(param);
		//将潜客分配给续保专员
		CustomerAssign data = customerAssignMapper.findUpdateData(param);
		insertXbzyBySCM(customer,data,fourSStoreId);
		
	}

	private void insertXbzyBySCM(Customer customer, CustomerAssign data, Integer fourSStoreId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		Integer roleId = RoleType.XBZY;
		param.put("customerId", data.getCustomerId());
		param.put("traceStatu", null);
		param.put("traceDate", null);
		param.put("inviteStatu", null);
		param.put("inviteDate", null);
		param.put("acceptStatu", 1);
		param.put("acceptDate", null);
		param.put("returnStatu", null);
		param.put("returnDate", null);
		param.put("traceDate", null);
		param.put("customerTraceId", data.getCustomerTraceId());
		param.put("assignDate", new Date());
		param.put("delayDate", data.getDelayDate());
		//如果负责人id不为空则优先分配给负责人
		Integer principalId = customer.getPrincipalId();
		String principal = customer.getPrincipal();
		Integer renewalType = customer.getRenewalType();
		Date virtualJqxdqr = customer.getVirtualJqxdqr();
		User user = null;
		if(principalId != null){//说明有指定的续保专员
			//校验指定的负责人是否状态正常
			boolean isNormal = userService.findCheckUserStatu(principalId);
			if(isNormal == true){
				param.put("userId", principalId);
				param.put("principalId", principalId);
				param.put("principal", principal);
			}else{
				user = userService.findAssignCustomerUser(roleId, fourSStoreId,renewalType);
				Integer userId = user.getId();
				String userName = user.getUserName();
				param.put("userId", userId);
				param.put("principalId", userId);
				param.put("principal", userName);
			}
		}else{
			//查询分配潜客最少的续保专员，并分配给他
			user = userService.findAssignCustomerUser(roleId, fourSStoreId,renewalType);
			Integer userId = user.getId();
			String userName = user.getUserName();
			param.put("userId", userId);
			param.put("principalId", userId);
			param.put("principal", userName);
		}
		
		//销售经理同意回退失败，因为主键冲突，现在这里增加一个更新的操作,先拿着customerId和userId去查询，如果有记录，更新，如果没有，还是走原来的方法
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("userId", param.get("userId"));
		map.put("customerId", param.get("customerId"));
		CustomerAssign customerAssign = customerAssignMapper.findXbzy(map);
		if(customerAssign!=null){
			customerAssignMapper.update(param);
		}else{
			customerAssignMapper.insert(param);
		}
		//更新大小池子的负责人的id和负责人
		customerMapper.updateCustomerInfo(param);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
		//向操作表insert一条分配记录表
		param.put("operationFlag", 6);
		param.put("coverType", customer.getRenewalType());
		param.put("virtualJqxdqr", virtualJqxdqr);
		operationRecordMapper.insert(param);
	}
	/**
	 * 客服专员失销
	 * @param customerId
	 * @param userId
	 * @param superiorId
	 * @param dealLostReason 
	 * @param userName 
	 * @param principalId 
	 * @param lastTraceResult 
	 * @param fourSStoreId 
	 * @throws Exception 
	 */
	public void updateRSByLostSale(Integer customerId, Integer userId, Integer superiorId, Integer storeId, 
			String dealLostReason, String userName, Integer principalId, String principal,String lastTraceResult,String sxyyxz) throws Exception {
		//添加跟踪记录
		if("".equals(sxyyxz)){
			sxyyxz = "其他";
		}
		addTraceRecord(principalId, principal, customerId, dealLostReason,lastTraceResult,sxyyxz,null,userId);
		
		//当潜客的保险到期日大于当日+首次提醒天数，则默认为这次失销为了拖迟捞取潜客，反之则认为这次失销是失销战败潜客，明年才捞取
		//根据customerId获取潜客信息
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		Date jqxrqEnd = customer.getJqxrqEnd();
		//获得该店的首次提醒天数
		Map<String,Object> traceSetParam = new HashMap<String,Object>();
		traceSetParam.put("customerLevel", "Z");
		traceSetParam.put("storeId", storeId);
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceTimeByCl(traceSetParam);
		Integer sctxts = traceDaySet.getDayNumber();
		/*//比较当前时间，首次提醒天数和保险到期日的关系
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, sctxts);
		//time1 = 当前时间+首次提醒天数
		Date date1 = DateUtil.formatDate(calendar);
		long time1 = date1.getTime();*/
		boolean trueToLost = isTrueToLost(jqxrqEnd,sctxts);
		//修改customerId的所有分配记录都更新为跟踪完成，已失销
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", null);//过滤掉userId这个查询条件
		param.put("traceStatu", 3);
		param.put("traceDate", new Date());
		param.put("returnStatu", 5);
		param.put("returnDate", new Date());
		if(principalId!=null){
			param.put("principalId", principalId);
		}
		List<User> users = userMapper.selectUserByroleId(storeId,5);
		if(users!=null&&users.size()>0){
			String ids = "";
			for(int i=0;i<users.size();i++){
				if(ids.equals("")){
					ids = users.get(i).getId()+"";
				}else{
					ids = ids+","+users.get(i).getId();
				}
			}
			param.put("caozuoId", ids);
		}
//		if(userId!=null&&principalId!=null){
//			param.put("caozuoId", userId);
//			param.put("principalId", principalId);
//		}
		customerAssignMapper.updateUserReturnStatu(param);
		
		//将潜客级别更新为F

		Map<String,Object> param3 = new HashMap<String,Object>();
		param3.put("customerId", customerId);
		param3.put("customerLevel", "F");
		//如果保险到期日大于time1，说明需要将潜客的分配状态改为1,时间到即可分配
		if(trueToLost == false){
			param3.put("status", 1);
		}else{
			//如果是真失销, 表示潜客去年没有出单
			param3.put("lastYearIsDeal", 0);
		}
		customerMapper.updateCustomerInfo(param3);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param3);
		
		//添加操作记录信息
		Map<String,Object> lostMap = new HashMap<>();
		lostMap.put("userId", userId);
		lostMap.put("customerId", customerId);
		lostMap.put("operationFlag", 10);
		lostMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		lostMap.put("coverType", customer.getRenewalType());
		//记录为失销信息
		operationRecordMapper.insert(lostMap);
	}
	
	/**
	 * 续保主管同意失销
	 * @param customerId
	 * @param userId
	 * @param dealLostReason 
	 * @param userName 
	 * @param principalId 
	 * @param lastTraceResult 
	 * @param fourSStoreId 
	 * @throws Exception 
	 */
	public void updateRSByLostSaleXBZG(Integer customerId, Integer userId, Integer storeId, 
			String dealLostReason, String userName, Integer principalId, String principal,String lastTraceResult,String sxyyxz) throws Exception {
		//添加跟踪记录
		if("".equals(sxyyxz)){
			sxyyxz = "其他";
		}
		addTraceRecord(principalId, principal, customerId, dealLostReason,lastTraceResult,sxyyxz,null,userId);
		
		//当潜客的保险到期日大于当日+首次提醒天数，则默认为这次失销为了拖迟捞取潜客，反之则认为这次失销是失销战败潜客，明年才捞取
		//根据customerId获取潜客信息
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		Date jqxrqEnd = customer.getJqxrqEnd();
		//获得该店的首次提醒天数
		Map<String,Object> traceSetParam = new HashMap<String,Object>();
		traceSetParam.put("customerLevel", "Z");
		traceSetParam.put("storeId", storeId);
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceTimeByCl(traceSetParam);
		Integer sctxts = traceDaySet.getDayNumber();
		/*//比较当前时间，首次提醒天数和保险到期日的关系
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, sctxts);
		//time1 = 当前时间+首次提醒天数
		Date date1 = DateUtil.formatDate(calendar);
		long time1 = date1.getTime();*/
		boolean trueToLost = isTrueToLost(jqxrqEnd,sctxts);
		//修改customerId的所有分配记录都更新为跟踪完成，已失销
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", null);//过滤掉userId这个查询条件
		param.put("traceStatu", 3);
		param.put("traceDate", new Date());
		param.put("returnStatu", 5);
		param.put("returnDate", new Date());
		if(principalId!=null){
			param.put("principalId", principalId);
		}
		List<User> users = userMapper.selectUserByroleId(storeId,5);
		if(users!=null&&users.size()>0){
			String ids = "";
			for(int i=0;i<users.size();i++){
				if(ids.equals("")){
					ids = users.get(i).getId()+"";
				}else{
					ids = ids+","+users.get(i).getId();
				}
			}
			param.put("caozuoId", ids);
		}
		customerAssignMapper.updateUserReturnStatu(param);
		
		//将潜客级别更新为F

		Map<String,Object> param3 = new HashMap<String,Object>();
		param3.put("customerId", customerId);
		param3.put("customerLevel", "F");
		//如果保险到期日大于time1，说明需要将潜客的分配状态改为1,时间到即可分配
		if(trueToLost == false){
			param3.put("status", 1);
		}else{
			//如果是真失销, 表示潜客去年没有出单
			param3.put("lastYearIsDeal", 0);
		}
		customerMapper.updateCustomerInfo(param3);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param3);
		
		//添加操作记录信息
		Map<String,Object> lostMap = new HashMap<>();
		lostMap.put("userId", principalId);
		lostMap.put("customerId", customerId);
		lostMap.put("operationFlag", 10);
		lostMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		lostMap.put("coverType", customer.getRenewalType());
		lostMap.put("returnFlag", 1);
		//记录为失销信息
		operationRecordMapper.insert(lostMap);
	}
	

	/**
	 * 激活
	 * @param assignUserId 
	 * @param customerId 
	 * @param userName 
	 * @param dealWakeReason 
	 * @param storeId 
	 * @param lastTraceResult2 
	 * @param insuranceDateStatu 
	 * @throws Exception 
	 */
	public void updateWakeUpCustomer(Integer customerId, Integer userId, Integer principalId,
			String principal, String dealWakeReason, String userName, Integer storeId, 
			String lastTraceResult,Integer loginRoleId) throws Exception {
		//添加跟踪记录
		addTraceRecord(principalId, principal, customerId, dealWakeReason, lastTraceResult,null,null,userId);
		
		//判断负责人是否存在,如果存在则重新分配给该负责人，让其重新跟踪；如果该负责人不存在则按分配规则分配（此方法取消，谁激活的负责人就是谁）
		User existPrincipal = userMapper.findRoleByUserId(principalId);
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", principalId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode2(param);
		String principalName = null;
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		Integer renewalType = renewalingCustomer.getRenewalType();
		if(existPrincipal == null){
			Integer roleId = RoleType.XBZY;
			User user = userService.findAssignCustomerUser(roleId, storeId,renewalType);
			/*谁激活的还是分给谁
		    principalId = user.getId();
			principalName = user.getUserName();*/
			//为了明年下发时按分派原则下发，失销时小池子潜客负责人置空了，那么这里激活时，谁激活的将谁的名字和id给set进去，这里需要考虑出单员的激活,负责人只能为续保专员
			if(loginRoleId==2){
				user.setId(userId);//分配表只需要userId，userName不需要
			}else{
				 principalId = user.getId();
				 principalName = user.getUserName();
			}
			Map<String, Object> map = assignCustomerService.toListMap(renewalingCustomer, user);
			//Map<String, Object> map = assignCustomerService.systemAssignCustomerToWorker(renewalingCustomer, storeId, roleId, principalId);
			//激活失败，因为(customerId_userId_index)冲突，现在这里增加一个更新的操作,先拿着customerId和userId去查询，如果有记录，更新，如果没有，还是走原来的方法
			//customerAssignMapper.insert(map);
			Map<String, Object> m= new HashMap<String,Object>();
			m.put("userId", map.get("userId"));
			m.put("customerId", map.get("customerId"));
			CustomerAssign cAssign= customerAssignMapper.findXbzy(m);
			if(cAssign!=null){
				customerAssignMapper.update(map);
			}else{
				customerAssignMapper.insert(map);
			}
		}else{
			Map<String,Object> assignParam = new HashMap<String,Object>();
			if(customerAssign != null){
				assignParam.put("customerId", customerId);
				assignParam.put("userId", principalId);
				assignParam.put("returnStatu", 6);
				assignParam.put("returnDate", new Date());
				assignParam.put("acceptStatu", 1);
				assignParam.put("acceptDate", null);
				assignParam.put("traceStatu",0);
				assignParam.put("traceDate", null);
				assignParam.put("inviteStatu", customerAssign.getInviteStatu());
				assignParam.put("inviteDate", customerAssign.getInviteDate());
				assignParam.put("assignDate", new Date());
				assignParam.put("delayDate", customerAssign.getDelayDate());
				assignParam.put("customerTraceId", customerAssign.getCustomerTraceId());
			}
			customerAssignMapper.update2(assignParam);
		}
		//向操作表insert一条续保专员下的潜客被唤醒的操作记录
		Map<String,Object> operationParam = new HashMap<String,Object>();
		operationParam.put("customerId", customerId);
		operationParam.put("userId", userId);
		operationParam.put("operationFlag", 3);
		operationRecordMapper.insert(operationParam);
		
		//更新客服专员回退状态为已激活
		Map<String,Object> param2 = new HashMap<String,Object>();
		//获取失销潜客的客服专员
//		Integer roleId = RoleType.KFZY;
//		Map<String,Integer> map = customerAssignMapper.findSADoYishixiao(roleId,customerId);
//		Integer kfzyId = map.get("userId");
		param2.put("customerId", customerId);
		param2.put("userId", null);//修改该潜客的所有分配记录,不分人
		param2.put("returnStatu", 6);
		param2.put("returnDate", new Date());
		customerAssignMapper.updateUserReturnStatu(param2);
		//将潜客级别更新为A
		Map<String,Object> param3 = new HashMap<String,Object>();
		param3.put("customerId", customerId);
		param3.put("customerLevel", "A");
		if(loginRoleId==2){
			param3.put("principalId", userId);
			param3.put("principal", userName);//谁激活的负责人就是谁,只有在续保专员的情况下
		}else{
			param3.put("principalId", principalId);
			param3.put("principal", principalName);//出单员也有激活操作，走原来的方法
		}
		param3.put("status", 2);
		customerMapper.updateCustomerInfo(param3);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param3);
	}
	

	/**
	 * 延期操作(申请或审批),更新回退状态
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param lastTraceResult2 
	 * @param superiorId 上级id
	 * @throws Exception 
	 */
	public void updateReturnStatuToDyq(Integer customerId, Integer userId,
			String returnReason, String userName, String lastTraceResult,
			Integer principalId, String principal,String applyDelayDayStr) throws Exception {
		//customerAssignMapper.updateReturnStatu(customerId, userId, 7);
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		param.put("applyDelayDay", DateUtil.toDate(applyDelayDayStr));
		param.put("returnStatu",7);
		param.put("returnDate", new Date());
		customerAssignMapper.updateSelectiveByDifferentId(param);
		//新增跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
	}
	
	/**
	 * 延期审批同意时,更新回退状态和延期到期日
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param lastTraceResult 
	 * @param superiorId 上级id
	 * @throws Exception 
	 */
	public void updateReturnStatuToYyq(Integer customerId, Integer principalId, String principal,
			String returnReason, String lastTraceResult, Integer userId) throws Exception {
		//新增跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		//获取申请延期日期
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", principalId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode3(param);
		Date applyDelayDay = customerAssign.getApplyDelayDay();
		param.put("returnStatu", 8);
		param.put("delayDate", applyDelayDay);
		int count = customerAssignMapper.updateSelectiveByDifferentId(param);
		if(count > 0){
			Map<String,Object> delayMap = new HashMap<>();
			delayMap.put("userId", principalId);
			delayMap.put("customerId", customerId);
			delayMap.put("operationFlag", 1);
			//记录为延期信息
			operationRecordMapper.insert(delayMap);
		}
		
}
	/**
	 * 续保主管直接延期
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param lastTraceResult 
	 * @throws Exception 
	 */
	public void updateReturnStatuZjyq(Integer customerId, Integer principalId, String principal,
			String returnReason,String lastTraceResult, Integer userId) throws Exception {
		//新增跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		
		//续保主管直接延期,只需要将延期日期加7天即可
		int count = customerAssignMapper.updateDelayDate(customerId, principalId);
		if(count > 0){
			Map<String,Object> delayMap = new HashMap<>();
			delayMap.put("userId", principalId);
			delayMap.put("customerId", customerId);
			delayMap.put("operationFlag", 1);
			//记录为延期信息
			operationRecordMapper.insert(delayMap);
		}
		
	}
	
	/**
	 * 插入审批单相关信息
	 * @param approvalBill
	 * @param zsxxList
	 * @param insuTypeList
	 * @return
	 * @throws Exception 
	 */
	public void saveApprovalBill(ApprovalBill approvalBill, List<GivingInformation> givingInformationList,
			List<InsuType> insuTypeList) throws Exception {
		approvalBill.setChassisNumber(approvalBill.getChassisNumber().toUpperCase());
		//根据approvalBillId 删除历史审批单
		String chassisNumber = approvalBill.getChassisNumber();
		int fourSStoreId = approvalBill.getFourSStoreId();
		//防止高并发访问多次操作delete不存在的记录导致死锁，所以在删之前先select
		ApprovalBill approvalBill2 = approvalBillMapper.findInfofromApprovalBill(chassisNumber, fourSStoreId);
		
		if(approvalBill2 != null){
			approvalBillMapper.deleteApprovalBill(chassisNumber,fourSStoreId);
			approvalBillMapper.deleteGivingInformation(approvalBill2.getId());
			//删除临时表中的险种信息
			Map<String, Object> insuMap = new HashMap<>();
			insuMap.put("insuId", approvalBill2.getId());
			insuMap.put("type", 3);
			insuTypeMapper.deleteByInsuIdAndType(insuMap);
		}
		approvalBillMapper.insertApprovalBill(approvalBill);
		
		if(givingInformationList!=null&&givingInformationList.size()>0){
			for(int k =0;k<givingInformationList.size();k++){
				GivingInformation givingInformation = givingInformationList.get(k);
				//未开启台帐模块时由于前端传递“空值”是一个空字符串，所以要剔除这个情况,如果开启台帐模块时用不到这个字段,不需要处理
				if(!"".equals(givingInformation.getZsxx())){
					givingInformation.setApprovalBillId(approvalBill.getId());
					approvalBillMapper.insertGivingInformation(givingInformation);
				}
			}
		}
		//插入商业险险种信息
		if (insuTypeList != null && insuTypeList.size() > 0) {
			for (int i = 0; i < insuTypeList.size(); i++) {
				InsuType insuType = insuTypeList.get(i);
				insuType.setInsuId(approvalBill.getId());
				insuType.setStoreId(approvalBill.getFourSStoreId());
				insuType.setType(3);
				insuTypeMapper.insert(insuType);
			}
		}
	}

	
	/**
	 * 延期操作(申请或审批),更新回退状态
	 * @param customerId 潜客id
	 * @param userId 用户id
	 * @param lastTraceResult 
	 * @param superiorId 上级id
	 * @throws Exception 
	 */
	public void updateReturnStatuToCszt(Integer customerId, Integer principalId,String principal,
			String returnReason, String userName, String lastTraceResult,Integer userId) throws Exception {
		//新增跟踪记录
		addTraceRecord(principalId, principal, customerId, returnReason,lastTraceResult,null,null,userId);
		customerAssignMapper.updateReturnStatu(customerId, principalId, 1);
		
	}
	/**
	 * 根据待审批查询
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public List<RenewalingCustomer> findByApproval(Map<String,Object> param) throws Exception { 
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByApproval(param);
		return list;
	}
	
	/**
	 * 根据待审批查询总数
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public int findByApprovalCount(Map<String,Object> param) throws Exception 
	{
		Integer policyCount = renewalingCustomerMapper.findByApprovalCount(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 根据待审批查询潜客跟踪记录总数
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public int countFindByApprovalGzjl(Map<String,Object> param) throws Exception 
	{
		Integer policyCount = renewalingCustomerMapper.countFindByApprovalGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 回退/延期/更换负责人等操作时,添加跟踪记录
	 * @param userId 操作人id
	 * @param userName 操作人名称
	 * @param customerId 潜客id
	 * @param traceContext 跟踪内容
	 * @param lastTraceResult 
	 * @param lossReason 失销原因
	 * @param returnReason 回退原因
	 * @return
	 * @throws Exception 
	 */
	public void addTraceRecord(Integer userId,String userName,Integer customerId,String traceContext, 
			String lastTraceResult, String lossReason,String returnReason,Integer operatorID) throws Exception{
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		CustomerTraceRecode traceRecode = new CustomerTraceRecode();
		traceRecode.setBxdqr(customer.getJqxrqEnd());
		traceRecode.setCx(customer.getVehicleModel());
		traceRecode.setLxr(customer.getContact());
		traceRecode.setLxfs(customer.getContactWay());
		traceRecode.setRenewalType(DealStringUtil.getCoverTypeName(customer.getRenewalType()));
		traceRecode.setVirtualJqxdqr(customer.getVirtualJqxdqr());
		if(renewalingCustomer!=null){
			traceRecode.setNewNextTraceDate(renewalingCustomer.getWillingTraceDate());
		}
		if(traceContext.endsWith("操作：出单")){
			traceRecode.setDealInsur(1);
		}
		if(traceContext.endsWith("接收")){
			traceRecode.setNewNextTraceDate(new Date());
		}
		if(traceContext.endsWith("操作：确认到店")){
			traceRecode.setComeStore(1);
			traceRecode.setComeStoreDate(new Date());
		}
		
		traceRecode.setPrincipalId(userId);
		traceRecode.setPrincipal(userName);
		traceRecode.setCustomerId(customerId);
		traceRecode.setTraceContext(traceContext);
		//traceRecode.setCurrentTraceDate(new Date());
		traceRecode.setCustomerLevel(null);
		traceRecode.setCurrentNeedTraceDate(null);
		traceRecode.setLossReason(lossReason);
		traceRecode.setReturnReason(returnReason);
		traceRecode.setOperatorID(operatorID);
		customerTraceRecodeMapper.insert(traceRecode);
		//更新潜客末次跟踪信息
		Date willingTraceDate = null;
		Date lastTraceDate = new Date();
		//updateForAction(customerId,willingTraceDate,lastTraceDate,lastTraceResult);
		//修改bug (principalId 为空)
		logger.info("updateForRenewalingCustomer小池子末次跟踪==> customerId 为 "+ customerId + " 负责人为 " + userId +" " + userName);
		updateForRenewalingCustomer(customerId,willingTraceDate,lastTraceDate,lastTraceResult,userName,userId);
	}
	
	public Customer findCustomerByChassisNumber(String chassisNumber, Integer storeId) throws Exception {
		Customer customer = customerMapper.findCustomerByCarNum(chassisNumber,storeId);
		return customer;
	}
	
	/**
	 * 更新潜客信息
	 * @param map
	 * @param customer 
	 * @param isModifyChassisNumber 
	 * @param flag 
	 * @throws Exception 
	 */
	public void updateCustomerInfo(Map<String,Object> map, Customer customer, boolean isModifyInsurEndDay,Integer principalId,String principal) throws Exception{
		Integer customerId = (Integer)map.get("customerId");
		int userId =(int) map.get("userId");
		String userName =(String) map.get("userName");
		String contactWay =(String) map.get("contactWay");
		String jqxrqEnd = (String)map.get("jqxrqEnd");
		String chassisNumber = (String)map.get("chassisNumber");
		map.put("chassisNumber", chassisNumber.toUpperCase());
		Date oldJqxdqrEnd = customer.getJqxrqEnd();//原交强险日期
		String oldJqxdqrEndStr = DateUtil.toString(oldJqxdqrEnd);
		Integer oldRenewalType = customer.getRenewalType();//原续保类型
		String oldContactWay = customer.getContactWay();//原联系方式
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findRCBycustomerId(customerId);
		int fourSStoreId = customer.getFourSStoreId();
		int renewalType =(int) map.get("renewalType");
		Date newVirtualJqxdqr = (Date)map.get("newVirtualJqxdqr");
		if(renewalType != customer.getRenewalType()){
			Map<String,Object> delayMap = new HashMap<>();
			delayMap.put("userId", userId);
			delayMap.put("customerId", customerId);
			delayMap.put("operationFlag", 6);
			delayMap.put("coverType", renewalType);
			if(isModifyInsurEndDay){
				delayMap.put("virtualJqxdqr", newVirtualJqxdqr);
			}else{
				delayMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
			}
			
			//更改投保类型，要给新的续保类型插入一个分配标志
			operationRecordMapper.insert(delayMap);
		}
		
		String operation = "修改潜客信息";
		String activateContent = "修改";
		Boolean isChange = false;
		if(!oldJqxdqrEndStr.equals(jqxrqEnd)){
			activateContent += "交强险日期由'"+oldJqxdqrEndStr+"'改为'"+jqxrqEnd+"'；";
			isChange = true;
		}
		if(!oldContactWay.equals(contactWay)){
			activateContent += "联系方式由'"+oldContactWay+"'改为'"+contactWay+"'；";
			isChange = true;
		}
		if(renewalType!=oldRenewalType){
			activateContent += "投保类型由'"+CoverTypeStringUtil.integerToString(oldRenewalType)
					+"'改为'"+CoverTypeStringUtil.integerToString(renewalType)+"'；";
			isChange = true;
		}
		if(!customer.getChassisNumber().equals((String)map.get("chassisNumber"))){
			activateContent += "车架号由'"+customer.getChassisNumber()
					+"'改为'"+(String)map.get("chassisNumber")+"'；";
			isChange = true;
		}
		if(isChange){
			String dealActivateReason = DealStringUtil.dealTraceRecordContent(operation, activateContent, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			//添加操作记录
			addTraceRecord(principalId, principal, customerId, dealActivateReason, lastTraceResult,null,null,userId);
		}
		
		int count = customerMapper.updateCustomerInfo(map);
		//如果renewalingCustomer不为空则说明该潜客是被分配过的，反之说明该潜客从来没有被分配过
		if(renewalingCustomer != null){
			if(count > 0){
				//小池子更新潜客信息后，id置空了，在这里加上
				map.put("principalId",principalId);
				renewalingCustomerMapper.updateRenewalingCustomerInfo(map);
			}
			
			String newJqxrqEndStr2 = (String)map.get("jqxrqEnd");
			String newJqxrqEndStr = newJqxrqEndStr2.substring(0, 10);
			Date newJqxrqEnd = DateUtil.toDate(newJqxrqEndStr);
			List<RenewalingCustomer> list =  new ArrayList<RenewalingCustomer>();
			if(isModifyInsurEndDay == true){
				//如果修改的保险到期日大于延期日期那么就把延期日删除
				renewalingCustomer = renewalingCustomerMapper.findRCBycustomerId(customerId);
				List<CustomerAssign> customerAssigns = customerAssignMapper.findAssignRecodeByCustomerId(customerId);
				User user = assignCustomerService.findNeedStatisticalWorker(customerAssigns);
				if(renewalingCustomer != null && user != null){
					Map<String,Object> param = new HashMap<String,Object>();
					param.put("customerId", customerId);
					param.put("delayDate", null);
					param.put("userId", user.getId());
					CustomerAssign assignRecode = customerAssignMapper.findAssignRecode(param);
					Date delayDate = null;
					//如果delayDate为空就说明没有延期过，不做处理
					if(assignRecode != null){
						delayDate = assignRecode.getDelayDate();
						if(delayDate != null){
							if(newJqxrqEnd.getTime() >= delayDate.getTime()){
								customerAssignMapper.updateDelayDate2(param);
							}
						}
					}
				}
				//如果修改了保险到期日，则需要及时更新潜客脱保状态
				renewalingCustomer.setVirtualJqxdqr(newVirtualJqxdqr);
				list.add(renewalingCustomer);
				assignCustomerService.updateInsuranceDateStatuOnTime(list);
			}
		}else{//如果修改的日期符合分配规则则要开始分配
			String customerLevel = map.get("customerLevel")==null||"".equals(map.get("customerLevel"))?"":map.get("customerLevel").toString();
			if(!"S".equals(customerLevel)){//S级潜客不分配
				List<Customer> customerList = new ArrayList<Customer>();
				customer = customerMapper.selectByPrimaryKey(customerId);
				customerList.add(customer);
				assignCustomerService.systemAssignRenewalCustomer(customerList,fourSStoreId);
			}
		}
		
		
		
	}
	
	/**
	 * 根据潜客id查询潜客
	 * @param customerId 潜客id
	 * @return customer 潜客信息
	 * @throws Exception 
	 */
	public Customer findCustomer(Integer customerId)throws Exception{
		
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		return customer;
	}
	
	/**
	 * 根据userId，cutomerId查询该条记录
	 * @param userId
	 * @param customerId
	 * @return
	 * @throws Exception 
	 */
	public CustomerAssign findAssignRecode(Integer userId, Integer customerId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("userId", userId);
		param.put("customerId", customerId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode(param);
		return customerAssign;
	}

	public CustomerAssign findLastStatu(Integer customerId, Integer userId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", userId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode3(param);
		return customerAssign;
	}

	public List<RenewalingCustomer> findByCusLostInsurStatu2(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findByCusLostInsurStatu2(param);
		return list;
	}

	public int countFindByCusLostInsurStatu2(Map<String, Object> param) throws Exception {
		Integer policyCount = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}

	/**
	 * 潜客导入
	 * @param customerList
	 * @param isFugai 导入覆盖标志
	 * @param userId 操作人id
	 */
	public List<Map<String, Object>> saveCustomerFromImport(List<Customer> customerList,Integer isFugai,Integer userId) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<customerList.size();i++){
			Customer customer = customerList.get(i);
			try {
				customer.setChassisNumber(customer.getChassisNumber().toUpperCase());
				//查询负责人id
				List<User> users = userMapper.findUserIdByUserName(customer.getFourSStoreId(),
						customer.getPrincipal(), PRINCIPAL_ROLEID);
				if(users.size() > 0){
					User user = RandomOne(users);
					customer.setPrincipalId(user.getId());
				}
				
				//查询业务员id
				List<User> list = userService.findClerkIdByUserName(customer.getFourSStoreId(),customer.getClerk());
				Integer clerkId = null;
				if(list.size() > 0){
					User user = RandomOne(list);
					Integer id = user.getId();
					clerkId = id;
				}
				customer.setClerkId(clerkId);
				if(customer.getRenewalType() != null && customer.getRenewalType() == 5){
					customer.setServiceConsultantId(clerkId);
					customer.setServiceConsultant(customer.getClerk());
				}
				if(customer.getRenewalType() == 2 || customer.getRenewalType() == 3){
					customer.setLastYearIsDeal(1);
				}else{
					customer.setLastYearIsDeal(0);
				}
				
				//虚拟virtualJqxdqr的值
				Date jqxrqEnd = customer.getJqxrqEnd();
				Calendar jqxrqEndCal = Calendar.getInstance();
				jqxrqEndCal.setTime(jqxrqEnd);
				String month = new Integer(jqxrqEndCal.get(Calendar.MONTH)+1).toString();
				String day = new Integer(jqxrqEndCal.get(Calendar.DAY_OF_MONTH)).toString();
				Calendar curCal = Calendar.getInstance();
				
				String curYear = new Integer(curCal.get(Calendar.YEAR)).toString();
				String curMonth = new Integer(curCal.get(Calendar.MONTH)+1).toString();
				String curDay = new Integer(curCal.get(Calendar.DAY_OF_MONTH)).toString();
				//获取虚拟保险到期日
				StringBuffer sb = new StringBuffer();
				sb.append(curYear);
				sb.append("-");
				sb.append(month);
				sb.append("-");
				sb.append(day);
				String dateString = sb.toString();
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				Date virtualJqxdqr = sdf.parse(dateString);
				//如果输入的交强险到期日大于当前时间+1年，则说明该潜客今年不应该被捞取，直接插入页面传入的保险到日期
				String curNextYear = new Integer(curCal.get(Calendar.YEAR)+1).toString();
				StringBuffer sb2 = new StringBuffer();
				sb2.append(curNextYear);
				sb2.append("-");
				sb2.append(curMonth);
				sb2.append("-");
				sb2.append(curDay);
				String nextYearString = sb2.toString();
				SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
				Date nextYearcueDate = sdf2.parse(nextYearString);
				//例如当前时间为2016/8/23,页面传递过来的是2017/8/24,则直接插入
				if(jqxrqEnd.getTime() >= nextYearcueDate.getTime() ){
					customer.setVirtualJqxdqr(jqxrqEnd);
				}else{
					customer.setVirtualJqxdqr(virtualJqxdqr);
				}
				
				//将今年以前的日期的年份，设置为当年，今年以后的日期保留不变
				Date jqxrqEndActual = DateUtil.convertToCurrentYear(customer.getJqxrqEnd());
				customer.setJqxrqEnd(jqxrqEndActual);
				Date syxrqEndActual = DateUtil.convertToCurrentYear(customer.getSyxrqEnd());
				customer.setSyxrqEnd(syxrqEndActual);
				
				Customer existCustomer = customerMapper.findCustomerByCarNum(customer.getChassisNumber(),customer.getFourSStoreId());
				if(existCustomer == null){
					customer.setCustomerLevel("A");
					customer.setStatus(1);
					customer.setDefeatFlag(0);
					
					customerMapper.insert(customer);
				}else{
					if(isFugai == 0){
						logger.info("车架号为: "+customer.getChassisNumber()+" 的潜客已经存在,跳过导入.");
						Map<String, Object> duplicateMap = new HashMap<>();
						duplicateMap.put("errorType", "duplicate");
						duplicateMap.put("errorRow", customer.getRowNumber());
						duplicateMap.put("errorString", "潜客已经存在,跳过导入");
						errorMessage.add(duplicateMap);
					}else{
						//插入一条跟踪记录
						User operatUser = userMapper.findUserByIdIsNoDel(userId, existCustomer.getFourSStoreId());
						String operation = "导入覆盖";
						String traceContext = DealStringUtil.dealLastTraceResult(operation,operatUser.getUserName());
						addTraceRecord(existCustomer.getPrincipalId(), existCustomer.getPrincipal(), 
								existCustomer.getCustomerId(), traceContext,traceContext,null,null,userId);
						
						
						String existJqxrqEnd = new SimpleDateFormat("yyyy-MM-dd").format(existCustomer.getJqxrqEnd());
						String jqxrqEndStr = new SimpleDateFormat("yyyy-MM-dd").format(customer.getJqxrqEnd());
						customer.setCustomerId(existCustomer.getCustomerId());
						
						if(existJqxrqEnd.equals(jqxrqEndStr)){
							int assignCount = customerAssignMapper.findTraceStatu(existCustomer.getCustomerId());
							if(assignCount > 0){
								customer.setPrincipal(existCustomer.getPrincipal());
								customer.setPrincipalId(existCustomer.getPrincipalId());
								customer.setClerk(existCustomer.getClerk());
								customer.setClerkId(existCustomer.getClerkId());
								//对于已经分配过的有持有人的潜客,去年投保标志还是取系统中的
								customer.setLastYearIsDeal(existCustomer.getLastYearIsDeal());
								logger.info("车架号为: "+customer.getChassisNumber()+" 的潜客已经存在,保险到期日不变,该潜客不被持有,除负责人业务员不更新外,其余信息覆盖成最新");
							}else{
								logger.info("车架号为: "+customer.getChassisNumber()+" 的潜客已经存在,保险到期日不变,信息覆盖成最新");
							}
							//customer.setLastYearIsDeal(existCustomer.getLastYearIsDeal());
							renewalingCustomerMapper.updateRenewalingCustomerByImport(customer);
						}else{
							customer.setStatus(1);
							renewalingCustomerMapper.deleteByPrimaryKey(existCustomer.getCustomerId());
							customerAssignMapper.deleteByCustomerId(existCustomer.getCustomerId());
							logger.info("车架号为: "+customer.getChassisNumber()+" 的潜客已经存在,保险到期日变更,删除分配信息");
						}
						customerMapper.updateCustomerByImport(customer);
					}
				}
			} catch (Exception e) {
				logger.error("导入失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorType", "error");
				errorMap.put("errorRow", customer.getRowNumber());
				errorMap.put("errorString", "数据异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
	/**
	 * 查询出将要重置的潜客
	 * @param reSetParam
	 * @return
	 * @throws Exception
	 */
	public List<Customer> findRenewalCustomer(Map<String, Object> reSetParam) throws Exception {
		List<Customer> list = customerMapper.findRenewalCustomer(reSetParam);
		return list;
	}
	/**
	 * 查询出将要分配的潜客
	 * @param assignParam
	 * @return
	 * @throws Exception
	 */
	public List<Customer> findRenewalCustomer2(Map<String, Object> assignParam) throws Exception {
		List<Customer> list = customerMapper.findRenewalCustomer2(assignParam);
		return list;
	}
	
	/**
	 * 按潜客ID查询该潜客所有的报价信息
	 * 
	 * @param customerId  潜客Id
	 * @return
	 * @throws Exception
	 */
	public List<CustomerBJRecode> findListCustomerBJRecode(Integer customerId ) throws Exception {
		List<CustomerBJRecode> list = customerBJRecodeMapper.findListCustomerBJRecode(customerId);
		return list;
	}
	
	/**
	 * 新增报价信息记录
	 * @param customerBJRecode  报价PO
	 * @return
	 * @throws Exception
	 */
	public int insertCustomerBJRecode(CustomerBJRecode customerBJRecode ) throws Exception {
	
		Map<String,Object> rcMap = new HashMap<>();
		rcMap.put("customerId", customerBJRecode.getCustomerId());
		rcMap.put("isQuote", 1);
		rcMap.put("quoteDate", new Date());
		renewalingCustomerMapper.updateSelectiveByCustomerId(rcMap);
		return customerBJRecodeMapper.insertCustomerBJRecode(customerBJRecode);
	}
	/**
	 * 唤醒
	 * @param customerId
	 * @param userId
	 * @param principalId
	 * @param dealWakeReason
	 * @param userName
	 * @param storeId
	 * @param lastTraceResult
	 * @throws Exception 
	 */
	public void updateActivateCustomer(Integer customerId, Integer userId, Integer principalId, String principal,
			String dealActivateReason,String userName, Integer storeId, String lastTraceResult) throws Exception {
		//添加操作记录
		addTraceRecord(principalId, principal, customerId, dealActivateReason, lastTraceResult,null,null,userId);
		
		//唤醒后的潜客的回退状态为10（已唤醒）
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		//param.put("userId", principalId);
		param.put("returnStatu", ReturnStatus.BEENACTIVE);
		param.put("returnDate", new Date());
		param.put("traceStatu", TraceStatus.TRACEOVER);
		param.put("traceDate", new Date());
		customerAssignMapper.updateByCustomerId(param);
		//将潜客级别更新为A
		Map<String,Object> param2 = new HashMap<String,Object>();
		param2.put("customerId", customerId);
		param2.put("customerLevel", "A");
		param2.put("principalId", null);
		param2.put("principal", null);
		customerMapper.updateCustomerInfo(param2);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param2);
		
		
		//添加操作记录信息
		Map<String,Object> awakenMap = new HashMap<>();
		awakenMap.put("userId", userId);
		awakenMap.put("customerId", customerId);
		awakenMap.put("operationFlag", 12);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		awakenMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		awakenMap.put("coverType", customer.getRenewalType());
		//记录为唤醒信息
		operationRecordMapper.insert(awakenMap);
	}
	/**
	 * 指定负责人
	 * @param customerId
	 * @param principalId
	 * @param principal
	 * @param prePrincipalId
	 * @param dealReturnReason
	 * @param userName
	 * @param lastTraceResult
	 * @param userId 
	 * @throws Exception 
	 */
	public void updateAssignPrincipal(Integer customerId, Integer principalId, String principal, Integer prePrincipalId,
			String dealReturnReason, String userName, String lastTraceResult, Integer userId) throws Exception {
		//添加操作记录
		addTraceRecord(principalId, principal, customerId, dealReturnReason, lastTraceResult,null,null,userId);
		
		//检测该潜客是否处于已脱保
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		Integer renewalType = renewalingCustomer.getRenewalType();
		Date virtualJqxdqr = renewalingCustomer.getVirtualJqxdqr();
		Integer cusLostInsurStatu = renewalingCustomer.getCusLostInsurStatu();
		Date delayDate = null;
		if(cusLostInsurStatu != null && cusLostInsurStatu == 2){
			//组装延期日期
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.DAY_OF_MONTH, 7);
			delayDate = DateUtil.formatDate(calendar);
			
		}
		
		//将已激活状态抹掉(一定要在指定负责人插入分配记录之前抹掉)
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("returnStatu", 1);
		param.put("returnDate", new Date());
		param.put("customerId", customerId);
		//param.put("userId", prePrincipalId);
		customerAssignMapper.updateByCustomerId(param);
		//查询指定的负责人是否拥有过该潜客，如果有就重置该分配记录，如果没有则新增该分配记录
		int isExistAssign = customerAssignMapper.findExistAssign(customerId, principalId);
		if(isExistAssign != 0){//如果有就重置该分配记录
			
			customerAssignMapper.updateSuperiorAssignRecord(customerId,principalId);
			if(delayDate != null){
				//自动更新分配表的延期日期
				Map<String,Object> updateParam = new HashMap<String,Object>();
				updateParam.put("customerId", customerId);
				updateParam.put("userId", principalId);
				updateParam.put("delayDate", delayDate);
				customerAssignMapper.update(updateParam);
			}
		}else{
			Map<String,Object> assignParam = new HashMap<String,Object>();
			assignParam.put("customerId", customerId);
			assignParam.put("userId", principalId);
			assignParam.put("traceStatu", 0);
			assignParam.put("traceDate", null);
			assignParam.put("inviteStatu", null);
			assignParam.put("inviteDate", null);
			assignParam.put("acceptStatu", 1);
			assignParam.put("acceptDate", null);
			assignParam.put("returnStatu", null);
			assignParam.put("returnDate",null);
			assignParam.put("customerTraceId", null);
			assignParam.put("assignDate", new Date());
			assignParam.put("delayDate",delayDate);
			customerAssignMapper.insert(assignParam);
			//向操作表insert当前操作记录
			Map<String,Object> oprationParam = new HashMap<String,Object>();
			oprationParam.put("customerId", customerId);
			oprationParam.put("userId", userId);
			oprationParam.put("operationFlag", 6);
			oprationParam.put("coverType", renewalType);
			oprationParam.put("virtualJqxdqr", virtualJqxdqr);
			operationRecordMapper.insert(oprationParam);
		}
		
		//更新大小池子的负责人id和名字
		Map<String,Object> param2 = new HashMap<String,Object>();
		param2.put("customerId", customerId);
		param2.put("principalId", principalId);
		param2.put("principal", principal);
		customerMapper.updateCustomerInfo(param2);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param2);
		
	}

	
	/**
	 * 潜客睡眠
	 * @param customerId 潜客id
	 * @param userId 操作用户id
	 * @param userName 操作用户名字
	 * @param principalId 负责人id
	 * @param principal 负责人
	 * @param sleepReason 睡眠原因
	 * @throws Exception
	 */
	public void saveCustomerSleep(Integer customerId,Integer userId,String userName,Integer principalId,
			String principal,String sleepReason) throws Exception {
		String operation = "睡眠";
		String traceContext = DealStringUtil.dealTraceRecordReason(operation, sleepReason, userName);
		//String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
		addTraceRecord(principalId, principal, customerId, traceContext,traceContext,null,null,userId);
		
		customerMapper.updateCustomerLevel(customerId, "S");
		renewalingCustomerMapper.updateCustomerLevel(customerId, "S");
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		//此处不专门修改谁的分配信息,而是修改所有带有该潜客id的分配记录,故传一个null的参数
		param.put("userId", null);
		param.put("traceStatu", FINISHED_TRACE_STATU);
		param.put("traceDate", new Date());
		param.put("returnStatu", SLEEP_RETURN_STATU);
		param.put("returnDate", new Date());
		customerAssignMapper.updateUserReturnStatu(param);
		
		//添加操作记录信息
		Map<String,Object> sleepMap = new HashMap<>();
		sleepMap.put("userId", userId);
		sleepMap.put("customerId", customerId);
		sleepMap.put("operationFlag", 11);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		sleepMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		sleepMap.put("coverType", customer.getRenewalType());
		//记录为睡眠信息
		operationRecordMapper.insert(sleepMap);
	}
	
	/**
	 * 续保主管同意睡眠潜客
	 * @param customerId 潜客id
	 * @param userId 操作用户id
	 * @param userName 操作用户名字
	 * @param principalId 负责人id
	 * @param principal 负责人
	 * @param sleepReason 睡眠原因
	 * @throws Exception
	 */
	public void saveCustomerSleepXBZG(Integer customerId,Integer userId,String userName,Integer principalId,
			String principal,String sleepReason) throws Exception {
		String operation = "同意睡眠";
		String traceContext = DealStringUtil.dealTraceRecordReason(operation, sleepReason, userName);
		//String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
		addTraceRecord(principalId, principal, customerId, traceContext,traceContext,null,null,userId);
		
		customerMapper.updateCustomerLevel(customerId, "S");
		renewalingCustomerMapper.updateCustomerLevel(customerId, "S");
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		//此处不专门修改谁的分配信息,而是修改所有带有该潜客id的分配记录,故传一个null的参数
		param.put("userId", null);
		param.put("traceStatu", FINISHED_TRACE_STATU);
		param.put("traceDate", new Date());
		param.put("returnStatu", SLEEP_RETURN_STATU);
		param.put("returnDate", new Date());
		customerAssignMapper.updateUserReturnStatu(param);
		
		//添加操作记录信息
		Map<String,Object> sleepMap = new HashMap<>();
		sleepMap.put("userId", principalId);
		sleepMap.put("customerId", customerId);
		sleepMap.put("operationFlag", 11);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		sleepMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		sleepMap.put("coverType", customer.getRenewalType());
		sleepMap.put("returnFlag", 2);
		//记录为睡眠信息
		operationRecordMapper.insert(sleepMap);
	}

	/**
	 * 续保主管潜客睡眠
	 * @param customerId 潜客id
	 * @param userId 操作用户id
	 * @param userName 操作用户名字
	 * @param principalId 负责人id
	 * @param principal 负责人
	 * @param sleepReason 睡眠原因
	 * @throws Exception
	 */
	public void saveCustomerSleepByRD(Integer customerId,Integer userId,String userName,Integer principalId,
			String principal,String sleepReason) throws Exception {
		String operation = "睡眠";
		String traceContext = DealStringUtil.dealTraceRecordReason(operation, sleepReason, userName);
		String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
		addTraceRecord(principalId, principal, customerId, traceContext,lastTraceResult,null,null,userId);
		
		customerMapper.updateCustomerLevel(customerId, "S");
		renewalingCustomerMapper.updateCustomerLevel(customerId, "S");
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", customerId);
		param.put("userId", null);
		param.put("traceStatu", FINISHED_TRACE_STATU);
		param.put("traceDate", new Date());
		param.put("returnStatu", SLEEP_RETURN_STATU);
		param.put("returnDate", new Date());
		customerAssignMapper.updateUserReturnStatu(param);
		
		//添加操作记录信息
		Map<String,Object> sleepMap = new HashMap<>();
		sleepMap.put("userId", userId);
		sleepMap.put("customerId", customerId);
		sleepMap.put("operationFlag", 11);
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		sleepMap.put("virtualJqxdqr", customer.getVirtualJqxdqr());
		sleepMap.put("coverType", customer.getRenewalType());
		//记录为睡眠信息
		operationRecordMapper.insert(sleepMap);
	}

	
	/**
	 * 查询bsp战败从而转到bip的潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findDefeatCustomer(Map<String,Object> param) throws Exception {
		List<Map<String, Object>> list = defeatCustomerMapper.findDefeatCustomer(param);
		return list;
	}
	/**
	 * 统计"查询bsp战败从而转到bip的潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindDefeatCustomer(Map<String,Object> param) throws Exception {
		Integer policyCount = defeatCustomerMapper.countFindDefeatCustomer(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 战败潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public void saveDefeatCustomer(Map<String,Object> map) throws Exception {
		defeatCustomerRelateMapper.updateDefeatedRelateState(map);
	}

	public List<RenewalingCustomer> findActivateCustomer(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findActivateCustomer(param);
		return list;
	}

	public Integer findCountActivateCustomer(Map<String, Object> param) throws Exception {
		return renewalingCustomerMapper.findCountActivateCustomer(param);
	}
	
	public Integer countFindActivateCustomerGzjl(Map<String, Object> param) throws Exception {
		return renewalingCustomerMapper.countFindActivateCustomerGzjl(param);
	}
	
	
	/*public int countFindActivateCustomer(Map<String, Object> param) throws Exception {
		int numCount = renewalingCustomerMapper.countFindActivateCustomer(param);
		return numCount;
	}*/

	public List<RenewalingCustomer> findBeenLostCus(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findBeenLostCus(param);
		return list;
	}
	
	public User RandomOne(List<User> list) {
		 Random r = new Random();
		 User user = list.get(r.nextInt(list.size()));
		 return user;
	}

	public int findCountBeenLostCus(Map<String, Object> param) throws Exception {
		int count = renewalingCustomerMapper.findCountBeenLostCus(param);
		return count;
	}
	/**
	 * 按回退状态查询潜客跟踪记录总数<管理> 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findCountBeenLostCusGzjl(Map<String, Object> param) throws Exception {
		int count = renewalingCustomerMapper.findCountBeenLostCusGzjl(param);
		return count;
	}

	/**
	 * 主动回退
	 * @param customerId
	 * @param userId
	 * @param principalId
	 * @param dealReturnReason
	 * @param userName
	 * @param storeId
	 * @param lastTraceResult
	 * @param content
	 * @param chassisNumber
	 * @throws Exception
	 */
	public void updateActiveReturn(Integer customerId, Integer userId,
			Integer principalId, String principal,String dealReturnReason, String userName,
			Integer storeId, String lastTraceResult, String content, String chassisNumber) throws Exception {
		//同意回退接口
		updateReturnStatuXbzg(customerId, userId,principalId, principal,dealReturnReason, userName, storeId, lastTraceResult);
		//想通知到插入一条通知记录，用于通知该记录的持有人
		//新增未读消息
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("userId", principalId);
		param.put("operatorId", userId);
		param.put("operatorName",userName);
		param.put("content", content);
		param.put("customerId", customerId);
		param.put("chassisNumber", chassisNumber);
		commonService.insertMessage(param);
	}
	
	/**
	 * 批量睡眠潜客
	 * @param customerList
	 * @return 
	 * @throws Exception 
	 */
	public List<Map<String, Object>> saveSleepBatch(List<Map<String,Object>> customerList,Integer userId) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<customerList.size();i++){
			Map<String, Object> map = customerList.get(i);
			try {
				String chassisNumber = (String) map.get("chassisNumber");
				Integer fourSStoreId = (Integer) map.get("fourSStoreId");
				Customer customer = customerMapper.findCustomerByCarNum(chassisNumber,fourSStoreId);
				if(customer != null){
					if(!"S".equals(customer.getCustomerLevel())){
						String operation = "批量睡眠";
						User user = userMapper.findUserById(userId);
						String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, user.getUserName());
						addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customer.getCustomerId(),
								lastTraceResult,lastTraceResult,null,null,userId);
						
						customerMapper.updateCustomerLevel(customer.getCustomerId(), "S");
						renewalingCustomerMapper.updateCustomerLevel(customer.getCustomerId(), "S");
						Map<String,Object> param = new HashMap<String,Object>();
						param.put("customerId", customer.getCustomerId());
						//此处不专门修改谁的分配信息,而是修改所有带有该潜客id的分配记录,故传一个null的参数
						param.put("userId", null);
						param.put("traceStatu", FINISHED_TRACE_STATU);
						param.put("traceDate", new Date());
						param.put("returnStatu", SLEEP_RETURN_STATU);
						param.put("returnDate", new Date());
						customerAssignMapper.updateUserReturnStatu(param);
					}else{
						logger.info("车架号为: "+chassisNumber+" 的潜客已经睡眠,跳过睡眠");
					}
				}else{
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer) map.get("rowNumber"));
					errorMap.put("errorString", chassisNumber);
					errorMessage.add(errorMap);
				}

			} catch (Exception e) {
				logger.error("睡眠潜客失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorRow", (Integer) map.get("rowNumber"));
				errorMap.put("errorString", "程序异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
	
	public Customer findCustomerById(Integer customerId) throws Exception {
		return customerMapper.findCustomerById(customerId);
	}
	
	public List<Map<String, Object>> findInviteRecord(Map<String, Object> param) throws Exception {
		List<Map<String, Object>> list = renewalingCustomerMapper.findInviteRecord(param);
		return list;
	}
	public Integer findInviteRecordCount(Map<String, Object> param) throws Exception{
		Integer policyCount = renewalingCustomerMapper.findInviteRecordCount(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}

	/**
	 * 批量更换负责人或持有人
	 * @param infoList 信息列表
	 * @param storeId 4s店id
	 * @param userId 操作人id
	 * @param userName 操作人名字 
	 * @param changePrincipalFlag 更换标志, 1表示续保主管更换负责人,反之为0
	 * @throws Exception
	 */
	public void updateChangePrincipalBatch(List<Map<String, Object>> infoList,
			Integer storeId, Integer userId, String userName,
			String changePrincipalFlag) throws Exception {
		for (Map<String,Object> infoMap : infoList) {
			Integer customerId = (Integer) infoMap.get("customerId");
			Integer prePrincipalId = (Integer) infoMap.get("prePrincipalId");
			String prePrincipal =  (String) infoMap.get("prePrincipal");
			Integer newPrincipalId = (Integer) infoMap.get("newPrincipalId");
			String newPrincipal =  (String) infoMap.get("newPrincipal");
			
			// 根据原有的潜客的分配信息做相应的校验
			CustomerAssign customerAssign = findLastStatu(customerId, prePrincipalId);
			if(customerAssign == null){
				if("1".equals(changePrincipalFlag)){
					logger.info("潜客id为" + customerId + "的潜客不属于续保专员跟踪");
					throw new CustomerNotMatchException("潜客id为" + customerId + "的潜客不属于续保专员跟踪");	
				}
			}else{
				if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu() == 3){
					logger.info("潜客id为" + customerId + "用户id为"+ prePrincipalId +"的分配信息为跟踪完成");
					throw new CustomerTracedException("潜客id为" + customerId + "用户id为"+ prePrincipalId +"的分配信息为跟踪完成");
				}
			}
			
			//如果前后是同一个人，则跳过
			if(prePrincipalId != null && prePrincipalId.equals(newPrincipalId)){
				continue;
			}
			Customer customer = customerMapper.selectByPrimaryKey(customerId);
			//添加跟踪记录
			String operation = "批量换人";
			String traceContent = prePrincipal + "换给" + newPrincipal;
			String traceContext = DealStringUtil.dealTraceRecordContent(operation, traceContent, userName);
			addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customerId, traceContext,traceContext,null,null,userId);
			
			//跟新当前负责人的跟踪状态
			customerAssignMapper.updateConsultantTraceStatu(customerId, prePrincipalId, FINISHED_TRACE_STATU);
			//判断新的负责人是否有该潜客的分配信息
			int existCount = customerAssignMapper.findExistAssign(customerId, newPrincipalId);
			
			Date virtualJqxdqr = customer.getVirtualJqxdqr();
			if (existCount > 0) {
				//如果新的负责人存在该潜客的分配信息
				if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
					//如果潜客已脱保,则更新回退状态为已延期
					int count = customerAssignMapper.updatePreviousAssignRecord(customerId, newPrincipalId, DELAYED_RETURN_STATU);
					if(count > 0){
						//修改延期日期
						customerAssignMapper.updateDelayDate(customerId, newPrincipalId);
					}
				}else{
					// 如果未脱保,则更新相应状态
					customerAssignMapper.updatePreviousAssignRecord(customerId, newPrincipalId, NO_RETURN_STATU);
				}
			} else {
				//如果新的负责人不存在该潜客的分配信息
				if(customer.getCusLostInsurStatu() != null && customer.getCusLostInsurStatu() == 2){
					//如果潜客已脱保,则分配时自动进行延期
					int count = customerAssignMapper.insertNewPrincipalAssign(customerId, newPrincipalId, DELAYED_RETURN_STATU);
					if(count > 0){
						//修改延期日期
						customerAssignMapper.updateDelayDate(customerId, newPrincipalId);
					}
				}else{
					//添加一条新的业务员的分配信息
					customerAssignMapper.insertNewPrincipalAssign(customerId, newPrincipalId, NO_RETURN_STATU);
				}
			}
			
			Map<String, Object> map = new HashMap<>();
			map.put("customerId", customerId);
			if("1".equals(changePrincipalFlag)){
				map.put("principalId", newPrincipalId);
				map.put("principal", newPrincipal);
			}else{
				map.put("clerkId", newPrincipalId);
				map.put("clerk", newPrincipal);
			}
			// 修改大池子潜客的负责人或者业务员
			customerMapper.updateCustomerInfo(map);
			// 修改小池子潜客的负责人或者业务员
			renewalingCustomerMapper.updateRenewalingCustomerInfo(map);
			
			//将操作记录存到操作记录表
			Map<String,Object> outMap = new HashMap<>();
			outMap.put("userId", prePrincipalId);
			outMap.put("customerId", customerId);
			outMap.put("operationFlag", 5);
			outMap.put("virtualJqxdqr", virtualJqxdqr);

			//被换掉的人记录为转出信息
			operationRecordMapper.insert(outMap);
			
			Map<String,Object> intoMap = new HashMap<>();
			intoMap.put("userId", newPrincipalId);
			intoMap.put("customerId", customerId);
			intoMap.put("operationFlag", 4);
			//新的负责人记录为转入信息
			operationRecordMapper.insert(intoMap);
			intoMap.put("operationFlag", 6);
			intoMap.put("coverType", customer.getRenewalType());
			intoMap.put("virtualJqxdqr", virtualJqxdqr);
			intoMap.put("assignSource", 3);
			
			//新的负责人记录为分配信息
			operationRecordMapper.insert(intoMap);
			
			//获取车架号拼装消息内容
			String chassisNumber = customer.getChassisNumber();
			String content = "";
			if("1".equals(changePrincipalFlag)){
				content = "你车架号为" + chassisNumber + "的潜客被更换负责人。------" + userName;
			}else{
				content = "你车架号为" + chassisNumber + "的潜客被更换持有人。------" + userName;
			} 
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", prePrincipalId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			
			
		}
	}
	
	//根据param查询建档人的新增潜客
	public List<RenewalingCustomer> findCustomerByCreater(Map<String, Object> param) throws Exception{
		List<RenewalingCustomer> list = renewalingCustomerMapper.findCustomerByCreater(param);
		return list;
	}

	public int findCustomerByCreaterCount(Map<String, Object> param) throws Exception {
		int policyCount = renewalingCustomerMapper.findCustomerByCreaterCount(param);
		return policyCount;
	}

	public boolean chassisNumberIsExist(String chassisNumber, int storeId) throws Exception {
		boolean flag = false;
		Customer customer = customerMapper.findCustomerByCarNum(chassisNumber, storeId);
		if(customer != null){
			flag = true;
		}
		return flag;
	}
	/**
	 * 按状态和用户id查询潜客列表信息
	 * @param param
	 * @return list
	 * @throws Exception
	 */
	public List<Map<String, Object>> findByStatuAndUserId(Map<String, Object> param) throws Exception {
		return renewalingCustomerMapper.findByStatuAndUserId(param);
	}
	
	/**
	 * 按状态和用户id查询潜客列表的所有记录数
	 * @param param
	 * @return Integer
	 * @throws Exception
	 */
	public Integer findCountByStatuAndUserId(Map<String, Object> param) throws Exception {
		return renewalingCustomerMapper.findCountByStatuAndUserId(param);
	}
	
	/**
	 * 查询潜客跟踪记录
	 * param: customerId
	 */
	public List<CustomerTraceRecode> findTraceRecordByCustomerId(Map<String, Object> param) throws Exception {
		String customerIdStr = (String) param.get("customerId");
		Integer customerId = new Integer(customerIdStr);
		return customerTraceRecodeMapper.findTraceRecordByCustomerId(customerId);
	}
	
	
	/**
	 * 判断是真失销还是假失销的规则
	 * flag = true 是真失销；反之为假失销
	 */
	public boolean isTrueToLost(Date jqxrqEnd, Integer sctxts) throws Exception {
		boolean flag = true;
		//比较当前时间，首次提醒天数和保险到期日的关系
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, sctxts);
		//time1 = 当前时间+首次提醒天数
		Date date1 = DateUtil.formatDate(calendar);
		long time1 = date1.getTime();
		//如果jqxrqEnd.getTime() > time1则说明是假失销，虚拟保险到日期一到就需要分配
		if(jqxrqEnd.getTime() > time1){
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 根据潜客ID查询潜客
	 * param: customerId
	 */
	public Customer selectByPrimaryKey(Integer customerId) throws Exception {
		Customer customer = customerMapper.selectByPrimaryKey(customerId);
		return customer;
	}
	
	/**
	 * 销售战败线索导入
	 * @param customerList
	 * @return 
	 * @throws Exception 
	 */
	public List<Map<String, Object>> saveDefeatCustomer(List<Map<String,Object>> customerList) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<customerList.size();i++){
			Map<String, Object> map = customerList.get(i);
			try {
				String contactWay = map.get("contactWay").toString();
				Integer bip_storeId = (Integer) map.get("bip_storeId");
				Integer existCount = defeatCustomerMapper.findExistDefeatCustomer(map);
				if(existCount > 0){
					logger.info("bip_storeId为: "+bip_storeId +",电话为:"+contactWay+"的战败线索已经导入,跳过导入");
				}else{
					map.put("bipImportData", 1);
					map.put("createDate", new Date());
					defeatCustomerMapper.saveDefeatCustomer(map);
				}
			} catch (Exception e) {
				logger.error("导入战败线索失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorRow", (Integer) map.get("rowNumber"));
				errorMap.put("errorString", "程序异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}

	/**
	 * 前台主管按不同状态查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByStatusQtzg(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByStatusQtzg(param);
	}
	/**
	 * 统计"前台主管按不同状态查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findByStatusQtzgCount(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByStatusQtzgCount(param);
	}
	
	/**
	 * 前台主管的潜客查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByConditionQtzg(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByConditionQtzg(param);
	}
	/**
	 * 统计"前台主管的潜客查询"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findByConditionQtzgCount(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByConditionQtzgCount(param);
	}
	
	/**
	 * APP已回退查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findYHTCustomerAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findYHTCustomerAPP(param);
	}
	/**
	 * 统计"APP已回退查询"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findYHTCustomerCountAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findYHTCustomerCountAPP(param);
	}
	
	/**
	 * APP已失销查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findYSXCustomerAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findYSXCustomerAPP(param);
	}
	/**
	 * 统计"APP已失销查询"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findYSXCustomerCountAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findYSXCustomerCountAPP(param);
	}
	
	/**
	 * APP无状态查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findByConditionAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByConditionAPP(param);
	}
	/**
	 * 统计"APP无状态查询潜客"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findByConditionCountAPP(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findByConditionCountAPP(param);
	}
	
	/**
	 * APP顾问跟踪完成潜客列表查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findGZFinishedCustomer(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findGZFinishedCustomer(param);
	}
	/**
	 * 统计"APP顾问跟踪完成潜客列表查询"总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findGZFinishedCustomerCount(Map<String,Object> param) throws Exception {
		return renewalingCustomerMapper.findGZFinishedCustomerCount(param);
	}
	
	/**
	 * 取消睡眠
	 * @param customerId 潜客id
	 * @param userId 操作用户id
	 * @param userName 操作用户名字
	 * @param principalId 负责人id
	 * @param principal 负责人
	 * @throws Exception
	 */
	public void saveCancelSleep(Integer customerId,Integer userId,String userName,Integer principalId,
			String principal ,Integer fourSStoreId,String jqxrqEnd) throws Exception {
		String operation = "取消睡眠";
		String traceContext = DealStringUtil.dealLastTraceResult(operation, userName);
		
		addTraceRecord(principalId, principal, customerId, traceContext,traceContext,null,null,userId);
		
		Map<String,Object> param = new HashMap<>();
		param.put("customerId", customerId);
		param.put("status", 1);
		param.put("customerLevel", "A");
		
		customerMapper.updateCustomerInfo(param);
		renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
		
		//取消睡眠后更新分配表中的信息(保险日期符合下发原则的)
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceDaySetSouCiCount(fourSStoreId);
		if(DateUtil.validJqxrqEnd(jqxrqEnd,traceDaySet.getDayNumber())){
			Map<String,Object> updateTraceAndAccept = new HashMap<>();
			updateTraceAndAccept.put("customerId", customerId);
			updateTraceAndAccept.put("userId", principalId);
			customerAssignMapper.updateTraceStatuAndAcceptStatu(updateTraceAndAccept);
		}
	}
	/**
	 * 根据customerId和dcbjrq查询报价信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<CustomerBJRecode> findBJListByCustomerId(Map<String,Object> param) throws Exception {
		return customerBJRecodeMapper.findBJListByCustomerId(param);
	}
	
	public List<Customer> selectByCLNumber(Map<String,Object> param) throws Exception {
		List<Customer> lists = customerMapper.selectByCLNumber(param);
		return lists;
	}
	
	/**
	 * 营销短信链接修改高意向
	 * @param param
	 * @throws Exception
	 */
	public void updateCustomer(Map<String,Object> param) throws Exception{
		if(sendPhoneMessageService.findPhoneBySFDJCount(param)==0){
			//修改潜客高意向
			customerMapper.updateCustomerInfo(param);
			renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
			//修改是否点击感兴趣
			sendPhoneMessageService.updateSFDJ(param);
			//新增未读消息
			Integer customerId = (Integer)param.get("customerId");
			Map<String,Object> map = new HashMap<String,Object>();
			Customer cus = customerMapper.selectByPrimaryKey(customerId);
			CustomerAssign as = customerAssignMapper.findAssignByCustomerId(customerId);
			map.put("storeId", cus.getFourSStoreId());
			map.put("userId", as.getUserId());
			map.put("operatorId", 0);
			map.put("operatorName","系统");
			map.put("content", "车架号为"+cus.getChassisNumber()+"的潜客对营销短信感兴趣,已经变为高意向！");
			map.put("customerId", customerId);
			map.put("chassisNumber", cus.getChassisNumber());
			
			//给持有人发消息
			commonService.insertMessage(map);
			
			//给续保主管发消息
			List<User> users = userService.selectByStoreIdAndRoleId(cus.getFourSStoreId(), 3);
			map.put("userId", users.get(0).getId());
			commonService.insertMessage(map);
		}
	}
	
	public void updateCustomerByRepairData(Integer storeId) throws Exception {
		customerMapper.updateCustomerByRepairData(storeId);
	}
	
	public void updateYtbCustomerByRepairData() throws Exception {
		customerMapper.updateYtbCustomerByRepairData();
		renewalingCustomerMapper.updateYtbCustomerByRepairData();
	}
	
	public void updateJtbCustomerByRepairData() throws Exception {
		customerMapper.updateJtbCustomerByRepairData();
		renewalingCustomerMapper.updateJtbCustomerByRepairData();
	}
	
	/**
	 * 批量失销
	 * @param maps
	 * @param userId
	 * @param storeId
	 * @param superiorId
	 * @param userName
	 * @throws Exception
	 */
	public void updateBatchLostSale(List<Map<String,Object>> maps,Integer userId,Integer storeId,Integer superiorId,String userName) throws Exception{
		String operation = "批量失销";
		for(int i=0;i<maps.size();i++){
			Integer customerId = (Integer)maps.get(i).get("customerId");
			Integer principalId = (Integer)maps.get(i).get("principalId");
			String principal = (String)maps.get(i).get("principal");
			CustomerAssign customerAssign = findLastStatu(customerId,userId);
				if(customerAssign!=null){
					Integer returnStatu = customerAssign.getReturnStatu();
					if(returnStatu != null && returnStatu == ReturnStatus.BEENLOST){
						throw new CustomerReceivedException("潜客id为" + customerId + "的潜客已经失销，失销失败！");
					}
					if(returnStatu != null && returnStatu == ReturnStatus.CHECKLOST){
						//String dealLostReason = DealStringUtil.dealTraceRecordReason(operation, lostReason, userName);
						String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
						updateRSByLostSale(customerId,userId,superiorId,storeId,lastTraceResult,userName,principalId,principal,lastTraceResult,null); 			
					}else{
						throw new CustomerTracedException("潜客id为" + customerId + "的潜客不处于待失销状态，失销失败！");
					}
				}else{
					//续保主管批量失销
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					updateRSByLostSaleXBZG(customerId,userId,storeId,lastTraceResult,userName,principalId,principal,lastTraceResult,null);
				}
			}
		}
	
	/**
	 * 战败线索分配
	 * @param id
	 * @param bangStatu
	 * @param contactWay
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public boolean saveDefeatCustomerRelate(Integer id,Integer bangStatu,String contactWay,Integer storeId,Integer roleId) throws Exception{
		Map<String,Object> map = new HashMap<>();
		if (bangStatu != null && bangStatu == 1) {
			map.put("bsp_storeId", id);
		} else {
			map.put("bip_storeId", id);
		}
		map.put("contactWay", contactWay);
		Integer countExist = defeatCustomerRelateMapper.findExistRelate(map);
		User user = findNeedUser(storeId,roleId);
		if(user==null){
			return false;
		}
		map.put("userId", user.getId());
		map.put("storeId", storeId);
		if(countExist > 0){
			defeatCustomerRelateMapper.updateDefeatedRelateState(map);
		}else{
			defeatCustomerRelateMapper.saveDefeatCustomerRelate(map);
		}
		return true;
	}
	
	/**
	 * 战败线索平均分配查找用户
	 * @param storeId
	 * @param flag
	 * @return
	 * @throws Exception
	 */
	public User findNeedUser(Integer storeId,Integer roleId) throws Exception{
		Map<String, Object> param = new HashMap<String,Object>();
		param.put("fourSStoreId", storeId);
		param.put("renewalType", 7);
		param.put("roleId", roleId);
		List<User> listMap = userMapper.findUsersByStoreIdAndRoleId(storeId,roleId);
		User assignUser = null;
		if(listMap!=null&&listMap.size()>0){
			List<User> users = userMapper.findUserByDistribution(param);//查询上次分配少分配的所有人
			Map<String, Object> map1 = new HashMap<String,Object>();
			if(users==null||users.size()==0){//这种情况是上次少分配的人被禁用或者停用了，导致这次查不到少分配的人
				map1.put("storeId", storeId);
				map1.put("roleId", roleId);
				map1.put("renewalType", 7);
				map1.put("num", 0);
				userMapper.updateUserByDistribution(map1);
				users = userMapper.findUserByDistribution(param);
			}
			Integer userId = users.get(0).getId();
			assignUser = users.get(0);
			Map<String, Object> map = new HashMap<String,Object>();
			if(users.size()==1){//如果查询到少分配的的人只有一个，这个时候把这个投保类型的标志全部重置为0
				map.put("storeId", storeId);
				map.put("roleId", roleId);
				map.put("renewalType", 7);
				map.put("num", 0);
			}else{//如果查询倒少分配的人有多个，这个时候只需要把当前返回的人的投保类型的标志变成1
				map.put("userId", userId);
				map.put("renewalType", 7);
				map.put("num", 1);
			}
			userMapper.updateUserByDistribution(map);
		}else{
			Store store = storeMapper.selectByPrimaryKey(storeId);
			Role role = roleMapper.findRoleNameByRoleId(roleId);
			String roleName = role.getRoleName();
			String storeName = store.getStoreName();
			String errorMessage = storeName+"没有角色为"+roleName+"的用户可以被分配战败线索，请检查你的用户状态或者新建该类型的用户";
			logger.info(errorMessage);
		}
		return assignUser;
	}
	
	/**
	 * 查找需要维护的数据
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findNeedMaintenance(Map<String,Object> param) throws Exception {
		return defeatCustomerMapper.findNeedMaintenance(param);
	}
	
	/**
	 * 按用户id查询线索列表信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findDefeatedSourceByUserId(Map<String,Object> param) throws Exception {
		return defeatCustomerMapper.findDefeatedSourceByUserId(param);
	}
	
	/**
	 * 按用户id查询线索列表总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int findCountDefeatedSourceByUserId(Map<String,Object> param) throws Exception {
		return defeatCustomerMapper.findCountDefeatedSourceByUserId(param);
	}
	
	/**
	 * 根据线索id查询线索
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	public Map<String, Object> findDefeatedSourceById(Map<String,Object> param) throws Exception { 
		return defeatCustomerMapper.findDefeatedSourceById(param);
	}
    /**
     * 查询刚导入的潜客，需要更新保险信息的潜客(大池子)
     * @param i
     * @return
     */
	public List<Customer>  selectByImportFlag(Integer importFlag) throws Exception  {
		List<Customer> list = customerMapper.selectByImportFlag(importFlag);
		return list;
	}
	/**
     * 更新刚导入的潜客，需要更新保险信息的潜客(大池子)批量
     * @param i
     * @return
     */
	public int updateBxMessageList(List<Customer> list) throws Exception {
		return customerMapper.updateBxMessageList(list);
	}
	/**
	 * 更新刚导入的潜客，需要更新保险信息的潜客(大池子)单个
	 * @param customer
	 */
	public int updateBxMessage(Customer customer) throws Exception {
		return customerMapper.updateBxMessage(customer);
	}
}
