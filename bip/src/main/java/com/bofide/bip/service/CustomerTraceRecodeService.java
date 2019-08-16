package com.bofide.bip.service;

import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.User;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.common.util.DealStringUtil;

/**
 *潜客跟踪服务类
 * 
 * @author huliangqing
 *
 */
@Service(value = "customerTraceRecordService")
public class CustomerTraceRecodeService {
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	@Resource(name = "userService")
	private UserService userService;
	@Resource(name = "customerService")
	private CustomerService customerService;
	
	
	/**
	 * 跟踪处理信息插入
	 * @param customer 跟踪处理信息 
	 * @param userId 用户Id 
	 * @param traceFlag 跟踪标志,1 表示跟踪, 2表示跟踪完成 
	 * @param virtualJqxdqr 
	 * @throws Exception
	 */
	public void insert(CustomerTraceRecode customerTraceRecode,Integer userId,Integer storeId,
			Integer traceFlag,Integer roleId,Map<String,Object> mapht,Integer applyStatu) throws Exception {
		Map<String,Object> map = new HashMap<>();
		map.put("customerId", customerTraceRecode.getCustomerId());
		map.put("userId", userId);
		CustomerAssign customerAssign = customerAssignMapper.findAssignRecode3(map);
		
		//获取相减后天数
		int cyts = (int)((new Date().getTime()-customerAssign.getAcceptDate().getTime())/(24*60*60*1000));
		customerTraceRecode.setCyts(cyts);
		if(customerTraceRecode.getInviteDate() != null){
			customerTraceRecode.setInvite(1);
		}
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerTraceRecode.getCustomerId());
		if(renewalingCustomer != null){
			customerTraceRecode.setCurrentNeedTraceDate(renewalingCustomer.getWillingTraceDate());
		}
		int i = customerTraceRecodeMapper.insert(customerTraceRecode);
		if(i>0){
			Map<String,Object> rcMap = new HashMap<>();
			Map<String,Object> rcMap2 = new HashMap<>();
			rcMap.put("customerId", customerTraceRecode.getCustomerId());
			//更新潜客(小池子)应跟踪时间
			rcMap.put("willingTraceDate", customerTraceRecode.getNextTraceDate());
			//更新潜客表(小池子)的末次跟踪日期
			rcMap.put("lastTraceDate", new Date());
			//更新潜客表(小池子)的末次跟踪结果
			rcMap.put("lastTraceResult", customerTraceRecode.getTraceContext());
			//更新潜客表(小池子)的客户级别
			rcMap.put("customerLevel", customerTraceRecode.getCustomerLevel());
			//更新潜客表(小池子)的邀约日期
			rcMap.put("inviteDate", customerTraceRecode.getInviteDate());
			if(customerTraceRecode.getPrincipalId()!=null && !"".equals(customerTraceRecode.getPrincipalId())
					&& customerTraceRecode.getPrincipal()!=null && !"".equals(customerTraceRecode.getPrincipal())){
				//更新潜客表(小池子)的负责人Id
				rcMap.put("principalId", customerTraceRecode.getPrincipalId());
				//更新潜客表(小池子)的负责人
				rcMap.put("principal", customerTraceRecode.getPrincipal());
			}
			
			//如果该跟踪记录有接通就统计起来
			Integer sfjt = customerTraceRecode.getSfjt();
			Customer customer = customerMapper.findCustomerById(customerTraceRecode.getCustomerId());
			Integer gotThroughNum = customer.getGotThroughNum();
			if(sfjt == null){
				sfjt = 0;
			}
			gotThroughNum += sfjt;
			rcMap.put("gotThroughNum", gotThroughNum);
			rcMap.put("sfgyx", customerTraceRecode.getSfgyx());
			renewalingCustomerMapper.updateSelectiveByCustomerId(rcMap);
			rcMap2.put("gotThroughNum", gotThroughNum);
			rcMap2.put("customerId", customerTraceRecode.getCustomerId());
			rcMap2.put("sfgyx", customerTraceRecode.getSfgyx());
			customerMapper.updateCustomerInfo(rcMap2);
			//更新自己和上级的跟踪状态
			String currentDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
			String nextTraceDate = new SimpleDateFormat("yyyy-MM-dd").format(customerTraceRecode.getNextTraceDate());
			if(currentDate.equals(nextTraceDate)){
				//跟踪状态为4表示,在跟踪时,录入的下次应跟踪日期为当天
				customerAssignMapper.updateTraceStatu(customerTraceRecode.getCustomerId(), userId,4);
			}else{
				customerAssignMapper.updateTraceStatu(customerTraceRecode.getCustomerId(), userId,2);
			}
			
			//更新潜客(大池子)的客户级别
			customerMapper.updateCustomerLevel(customerTraceRecode.getCustomerId(), customerTraceRecode.getCustomerLevel());
			Map<String,Object> traceMap = new HashMap<>();
			traceMap.put("userId", userId);
			traceMap.put("customerId", customerTraceRecode.getCustomerId());
			traceMap.put("operationFlag", 9);
			//插入一条操作记录表示跟踪过一次
			operationRecordMapper.insert(traceMap);
			
			if(customerTraceRecode.getInviteDate() != null){
				//更新自己的邀约状态
				customerAssignMapper.updateAssignInviteStatu(
						customerTraceRecode.getCustomerId(), userId,
						customerTraceRecode.getCustomerTraceId());
				//更新小池子里面的是否邀约
				renewalingCustomerMapper.updateIsInvite(customerTraceRecode.getCustomerId());
			}
			
			
			if(traceFlag != null && traceFlag == 2){
				CustomerAssign assign = new CustomerAssign();
				assign.setCustomerId(customerTraceRecode.getCustomerId());
				assign.setUserId(userId);
				assign.setReturnStatu(1);
				
				//续保专员的分配信息
				CustomerAssign commissionerAssign = new CustomerAssign();
				commissionerAssign.setCustomerId(customerTraceRecode.getCustomerId());
				//如果负责人有填写则优先分配该负责人,否则就随机分配
				Integer renewalType = customer.getRenewalType();
				Integer id = null;
				User user = null;
				Integer xbzyRoleId = RoleType.XBZY;
				if(customer != null){
					id = customer.getPrincipalId();
					
				}
				if(id != null){
					//检查这个负责人是否正常状态
					boolean isNormal = userService.findCheckUserStatu(id);
					
					if(isNormal == true){
						commissionerAssign.setUserId(id);
					}else{
						user = userService.findAssignCustomerUser(xbzyRoleId, storeId,renewalType);
						commissionerAssign.setUserId(user.getId());
					}
				}else{
					user = userService.findAssignCustomerUser(xbzyRoleId, storeId,renewalType);
					commissionerAssign.setUserId(user.getId());
				}
				commissionerAssign.setAssignDate(new Date());
				commissionerAssign.setAcceptStatu(1);
				commissionerAssign.setReturnStatu(1);
				String operation = "跟踪完成";
				User operatorUser = userService.findUserById(userId);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, operatorUser.getUserName());
				customerService.insertNewAssign(assign,commissionerAssign,storeId,operatorUser.getUserName(),
						lastTraceResult,customer.getPrincipalId(),customer.getPrincipal(),roleId);
			}else if(traceFlag != null && traceFlag == 3){
				Integer customerId = customer.getCustomerId();
				String htyyxz = (String)mapht.get("htyyxz");
				String userName = (String)mapht.get("userName");
				String returnReason = (String)mapht.get("returnReason");
				Integer principalId = customer.getPrincipalId();
				String principal = customer.getPrincipal();
				String operation = "";
				if(applyStatu==null){
					operation = "申请回退";
				}else if(applyStatu==1){
					operation = "申请失销";
				}else if(applyStatu==2){
					operation = "申请睡眠";
				}
				String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateReturnStatu(customerId, userId, null, dealReturnReason, userName, storeId, lastTraceResult, principalId, principal, htyyxz,applyStatu);
			}
		}
		
		
	}

	
	/**
	 * 根据潜客id查询对应潜客的跟踪记录条数
	 * @param customerId 跟踪处理信息 
	 * @return 
	 * @throws Exception
	 */
	public int findTraceCount(Integer customerId) throws Exception {
		return customerTraceRecodeMapper.findTraceCount(customerId);
	}
	
	/**
	 * 根据潜客id查询潜客失销原因
	 * @param customerId 潜客id
	 * @return 
	 * @throws Exception
	 */
	public String findLostReasonByCustomerId(Integer customerId) throws Exception {
		return customerTraceRecodeMapper.findLostReasonByCustomerId(customerId);
	}
	
	/**
	 * 根据潜客ID和用户ID查询当前跟踪次数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findGzCount(Map<String, Object> param) throws Exception{
		List<Map<String, Object>> lists = customerTraceRecodeMapper.findGzCount(param);
		return lists;
	}
	
	public CustomerTraceRecode findByCustomerTraceId(Integer customerTraceId) throws Exception{
		return customerTraceRecodeMapper.selectByPrimaryKey(customerTraceId);
	}
	
	public int findExistInviteDate(Map<String, Object> param) throws Exception{
		return customerTraceRecodeMapper.findRecordByInviteDate(param);
	}
}
