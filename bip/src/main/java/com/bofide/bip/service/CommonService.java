package com.bofide.bip.service;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.CoverType;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.CommonMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.DefeatCustomerMapper;
import com.bofide.bip.mapper.InsuranceBillMapper;
import com.bofide.bip.mapper.MessageMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.StatisticMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.SystemMessageMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.InsuranceBill;
import com.bofide.bip.po.Message;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.SystemMessage;
import com.bofide.bip.po.User;

/**
 *公共服务类
 * 
 * @author huliangqing
 *
 */
@Service(value = "commonService")
public class CommonService {

	@Resource(name = "commonMapper")
	private CommonMapper commonMapper;
	@Resource(name = "insuranceBillMapper")
	private InsuranceBillMapper insuranceBillMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "messageMapper")
	private MessageMapper messageMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "systemMessageMapper")
	private SystemMessageMapper systemMessageMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	@Autowired
	private UserService userService;
	@Resource(name = "defeatCustomerMapper")
	private DefeatCustomerMapper defeatCustomerMapper;
	@Resource(name = "statisticMapper")
	private StatisticMapper statisticMapper;
	
	/** 
	 * 查询所有承保类型
	 * @return 
	 */
	public List<CoverType> findAllCoverType() {
		return commonMapper.findAllCoverType();
	}
	
	/** 
	 * 根据投保类型查询投保类型id
	 * @return 
	 */
	public int findCoverTypeByName(String coverTypeName) {
		return commonMapper.findCoverTypeByName(coverTypeName);
	}
	
	/** 
	 * 校验保单是否已入库,校验规则有两种,一是根据商业险结束日期,标志是"SyxrqEnd";二是根据交强险结束日期,标志是"JqxrqEnd"
	 * @param endTime 交强险到期日
	 * @param chassisNumber 车架号
	 * @return 
	 * @throws Exception 
	 */
	public boolean verifyInsuranceBill(Date endTime, String chassisNumber,Integer storeId,String dateFlag) throws Exception {
		//false:未入库 true 已入库
		boolean result = false;
		//获取年份
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(endTime);
		int year = calendar.get(Calendar.YEAR);
		List<InsuranceBill> insuranceBills = insuranceBillMapper.verifyInsuranceBill(chassisNumber,year,storeId,dateFlag);
		if(insuranceBills.size()>0){
			result = true;
		}
		return result;
	}
	/**
	 * 校验保单是否已入库
	 * @param jqxrqStart交强险日期
	 * @param chassisNumber
	 * @param storeId
	 * @param dateFlag
	 * @return
	 * @throws Exception
	 */
	public boolean verifyInsuranceBill_jqxrq(Date jqxrqStarts,Date jqxrqEnds, String chassisNumber,Integer storeId) throws Exception {
		//false:未入库 true 已入库
		boolean result = false;
		SimpleDateFormat sdf =   new SimpleDateFormat( " yyyy-MM-dd HH:mm:ss " );
		String jqxrqStart=sdf.format(jqxrqStarts);
	    String jqxrqEnd=sdf.format(jqxrqEnds);
		List<InsuranceBill> insuranceBills = insuranceBillMapper.verifyInsuranceBill_jqxrq(chassisNumber,jqxrqStart,jqxrqEnd,storeId);
		if(insuranceBills.size()>0){
			result = true;
		}
		return result;
	}
	/**
	 * 校验保单是否已入库(商业险日期)
	 * @param syxrqStart商业险日期
	 * @param chassisNumber车架号
	 * @param storeId
	 * @param dateFlag
	 * @return
	 * @throws Exception
	 */
	public boolean verifyInsuranceBill_syxrq(Date syxrqStarts,Date syxrqEnds, String chassisNumber,Integer storeId) throws Exception {
		//false:未入库 true 已入库
		boolean result = false;
		SimpleDateFormat sdf =   new SimpleDateFormat( " yyyy-MM-dd HH:mm:ss " );
		String syxrqStart=sdf.format(syxrqStarts);
	    String syxrqEnd=sdf.format(syxrqEnds);
		List<InsuranceBill> insuranceBills = insuranceBillMapper.verifyInsuranceBill_syxrq(chassisNumber,syxrqStart,syxrqEnd,storeId);
		if(insuranceBills.size()>0){
			result = true;
		}
		return result;
	}
	
	/**
	 * 根据用户查询数量(应跟踪/未接收/待审批/将脱保/已脱保)
	 * 
	 * @param userId 用户id
	 * @param storeId
	 * @return resultMap 查询结果
	 */
	public Map<String, Integer> findCountByUserId(Integer userId, Integer storeId, Integer roleId, Integer bspStoreId,
			Integer bangStatu) throws Exception {
		Map<String, Integer> resultMap = new HashMap<String, Integer>();
		List<User> users = null;
		// 查询入参
		Map<String, Object> param = null;
		// 查询该店所有客服专员(有些统计不涉及客服专员)
		List<User> kfUsers = userService.findUsersByStoreIdAndRoleId2(storeId, 5);
		// 应跟踪数量
		Integer shouldTraceNum = 0;
		// 已跟踪数量
		Integer tracedNum = 0;
		// 未接收数量
		Integer accpetNum = 0;
		// 待审批数量
		Integer approveNum = 0;
		// 将脱保数量
		Integer willOutNum = 0;
		// 已脱保数量
		Integer outedNum = 0;
		// 待失销数量
		Integer willRunOutNum = 0;
		// 已失销数量
		Integer runOutedNum = 0;
		// 已激活数量
		Integer wakeUpNum = 0;
		// 已唤醒数量
		Integer activeNum = 0;
		// bsp销售战败潜客数量
		Integer defeatNum = 0;
		Integer[] roleIds = {2,6,8};//续保主管，保险经理，总经理要查询出下属角色
		Store store = storeMapper.selectByPrimaryKey(storeId);
		if(roleId == 22){//把总经理助理当成总经理
			roleId = 11;
		}
		if(roleId == 41 || roleId == 42 || roleId == 43 || roleId == 44 || roleId == 45 || roleId == 46
                || roleId == 47 || roleId == 48 || roleId == 49 || roleId == 50 || roleId == 51 || roleId == 52 || roleId == 53
                || roleId == 54 || roleId == 55 || roleId == 56 || roleId == 57 || roleId == 58 || roleId == 59 || roleId == 23){
			roleId = 16;
		}
		switch (roleId) {
		case 3:// 续保主管=所有销售顾问，服务顾问，续保专员，客服专员的统计
			
			users = userService.findAllPrincipal(storeId, userId,roleIds);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("users", users);
			param.put("storeId", storeId);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			//以唤醒数量
			param.put("returnStatu", 10);
			activeNum = renewalingCustomerMapper.findCountActivateCustomer(param);
			// 查询该店所有客服专员
			// List<User> kfUsers =
			// userService.findUsersByStoreIdAndRoleId(storeId, roleId);
			users.addAll(kfUsers);
			param.put("users", users);// 包含客服专员
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			
			// 查询bsp战败潜客数量
			Map<String, Object> mapxbzg = new HashMap<String, Object>();
			if(bangStatu == 1){
				//绑定了bsp店id,则用bsp店id查询
				mapxbzg.put("bsp_storeId",bspStoreId);//绑定的bsp店ID
			}else{
				//没有绑定bsp店id,则用本店id查询
				mapxbzg.put("bip_storeId",storeId);
			}
			if(store.getCsModuleFlag()!=null&&store.getCsModuleFlag()==1){
				mapxbzg.put("roleId",5);
			}else{
				mapxbzg.put("roleId",2);
			}
			defeatNum = defeatCustomerMapper.countFindDefeatCustomer(mapxbzg);
			
			break;
		case 4:// 客服经理=所有客服专员的统计
			users = kfUsers;
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);// 包含客服专员
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			// 待失销数量
			param.put("returnStatu", 4);// 待失销returnStatu为4
			willRunOutNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			// 已失销数量
			param.put("returnStatu", 5);// 已失销returnStatu为5
			//runOutedNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			runOutedNum = renewalingCustomerMapper.findCountBeenLostCus(param);
			// 查询bsp战败潜客数量
			Map<String, Object> mapkfjl = new HashMap<String, Object>();
			if(bangStatu == 1){
				//绑定了bsp店id,则用bsp店id查询
				mapkfjl.put("bsp_storeId",bspStoreId);//绑定的bsp店ID
			}else{
				//没有绑定bsp店id,则用本店id查询
				mapkfjl.put("bip_storeId",storeId);
			}
			
			mapkfjl.put("roleId", 5);
			defeatNum = defeatCustomerMapper.countFindDefeatCustomer(mapkfjl);
			
			// 查询已激活数量
			users =  userService.findUnderling(RoleType.KFJL,storeId);
			param.put("users", users);
			param.put("returnStatu", 6);// 已激活returnStatu为6
			wakeUpNum = renewalingCustomerMapper.countFindByReturnStatu(param);

			break;
		case 7:// 销售经理=所有销售顾问的统计
			users = userService.findUnderling(RoleType.XSJL, storeId);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询已跟踪
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批;由于销售经理只有审批待回退没有待延期的，所以就直接调用根据回退状态查询的方法即可
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			//approveNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);

			break;

		case 9:// 服务经理=所有服务顾问的统计
			users = userService.findUnderling(RoleType.FWJL,storeId);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询已跟踪
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批：由于服务经理只有审批待回退没有待延期的，所以就直接调用根据回退状态查询的方法即可
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			//approveNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			break;
		case 10:// 保险经理=所有销售顾问，服务顾问，续保专员，客服专员的统计
			users = userService.findAllPrincipal(storeId, userId,roleIds);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("storeId", storeId);
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			//以唤醒数量
			param.put("returnStatu", 10);
			activeNum = renewalingCustomerMapper.findCountActivateCustomer(param);
			// 查询该店所有客服专员
			// List<User> kfUsers =
			// userService.findUsersByStoreIdAndRoleId(storeId, roleId);
			users.addAll(kfUsers);
			param.put("users", users);// 包含客服专员
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			break;
		case 11:// 总经理=所有销售顾问，服务顾问，续保专员，客服专员的统计
			users = userService.findAllPrincipal(storeId, userId,roleIds);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("storeId", storeId);
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			//以唤醒数量
			param.put("returnStatu", 10);
			activeNum = renewalingCustomerMapper.findCountActivateCustomer(param);
			// 查询该店所有客服专员
			// List<User> kfUsers =
			// userService.findUsersByStoreIdAndRoleId(storeId, roleId);
			users.addAll(kfUsers);
			param.put("users", users);// 包含客服专员
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			break;
		case 16:// 数据分析员=所有销售顾问，服务顾问，续保专员，客服专员的统计
			users = userService.findAllPrincipal(storeId, userId,roleIds);
			if(users==null||users.size()<=0){
				break;
			}
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("storeId", storeId);
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			//以唤醒数量
			param.put("returnStatu", 10);
			activeNum = renewalingCustomerMapper.findCountActivateCustomer(param);
			// 查询该店所有客服专员
			// List<User> kfUsers =
			// userService.findUsersByStoreIdAndRoleId(storeId, roleId);
			users.addAll(kfUsers);
			param.put("users", users);// 包含客服专员
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			break;
		case 19:// 前台主管=所有服务顾问的统计
			param = new HashMap<String, Object>();
			param.put("storeId", storeId);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪
			shouldTraceNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			// 查询已跟踪
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			tracedNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			// 查询待审批(回退的)
			param.put("traceStatu", null);
			param.put("returnStatu", 3);
			approveNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			// 将脱保数量
			param.put("returnStatu", null);
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			// 查询未接收数量
			param.put("cusLostInsurStatu", null);
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.findByStatusQtzgCount(param);
			break;
		default:// 其他角色=查询自己的统计
			users = userService.findAllPrincipal(storeId, userId, roleIds);
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询已跟踪
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			param.put("acceptStatu", 1);//续保专员查需要校验接收状态
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			// 待失销数量
			param.put("returnStatu", 4);// 待失销returnStatu为4
			willRunOutNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			// 已失销数量
			param.put("returnStatu", 5);// 已失销returnStatu为5
			//runOutedNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			runOutedNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			// 查询已唤醒数量
			param.put("returnStatu", 6);// 已唤醒returnStatu为6
			wakeUpNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			
			if(bangStatu == 1){
				//绑定了bsp店id,则用bsp店id查询
				param.put("bsp_storeId",bspStoreId);//绑定的bsp店ID
			}else{
				//没有绑定bsp店id,则用本店id查询
				param.put("bip_storeId",storeId);
			}
			defeatNum = defeatCustomerMapper.countFindDefeatCustomer(param);// 查询bsp战败潜客数量
			break;
		}

		// 查询未读个人消息数量
		Integer messageNum = messageMapper.selectMessageCount(userId);
		//查询未读系统消息数量
		Integer sysMessageNum = findSystemMessageCount(userId,storeId,roleId);
		resultMap.put("shouldTraceNum", shouldTraceNum);
		resultMap.put("tracedNum", tracedNum);
		resultMap.put("accpetNum", accpetNum);
		resultMap.put("returnNum", approveNum);
		resultMap.put("willOutNum", willOutNum);
		resultMap.put("outedNum", outedNum);
		resultMap.put("willRunOutNum", willRunOutNum);
		resultMap.put("runOutedNum", runOutedNum);
		resultMap.put("wakeUpNum", wakeUpNum);
		resultMap.put("messageNum", messageNum);
		resultMap.put("sysMessageNum", sysMessageNum);
		resultMap.put("activeNum", activeNum);
		resultMap.put("defeatNum", defeatNum);
		return resultMap;
	}
	
	/** 
	 * 根据用户id查询未读消息
	 * @param userId 用户id
	 * @return resultMap 查询结果
	 */
	public List<Message> findMessageByUserId(Integer userId,Integer roleId) throws Exception{
		//查询未读消息
		List<Message> messageList = messageMapper.selectByUserId(userId);
		for(int i=0;i<messageList.size();i++){
			Message message = messageList.get(i);
			Map<String, Object> param = new HashMap<>();
			if(roleId == 2 || roleId == 6 || roleId == 8){
				param.put("customerId", message.getCustomerId());
				param.put("userId", userId);
				CustomerAssign customerAssign = customerAssignMapper.findAssignRecode3(param);
				if(customerAssign!=null){
					if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu()!=3){
						message.setClickFlag(1);
					}
				}
				
			}else if(roleId == 3){
				message.setClickFlag(1);
			}else if(roleId == 7 || roleId == 9){
				param.put("customerId", message.getCustomerId());
				param.put("userId", message.getOperatorId());
				CustomerAssign customerAssign = customerAssignMapper.findAssignRecode3(param);
				if(customerAssign!=null){
					if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu()!=3){
						message.setClickFlag(1);
					}
				}
			}
			param.put("fourSStoreId", message.getStoreId());
			param.put("chassisNumber", message.getChassisNumber());
			List<RenewalingCustomer> customer = renewalingCustomerMapper.findCustomerByStoreIdAndChassisNumber(param);
			if(customer.size() >0){
				message.setCustomer(customer.get(0));
			}else{
				//修改表结构导致customer长度有可能为0,属于历史遗留问题,这里特殊处理
				message.setClickFlag(-1);
			}
		}
		return messageList;
	}
	
	/** 
	 * 根据用户id更新消息阅读状态
	 * @param userId 用户id
	 */
	public void updateReadStatus(Integer userId) throws Exception{
		
		messageMapper.updateReadStatus(userId);
	}
	

	/** 
	 * 新增消息
	 * @param userId 用户id
	 */
	public void insertMessage(Map<String,Object> param) throws Exception{
		//封装数据
		Integer storeId = (Integer)param.get("storeId");
		Integer userId = (Integer)param.get("userId");
		Integer operatorId = (Integer)param.get("operatorId");
		String operatorName = (String)param.get("operatorName");
		String content = (String)param.get("content");
		Integer customerId = (Integer)param.get("customerId");
		String chassisNumber = (String)param.get("chassisNumber");
		Message message = new Message();
		message.setStoreId(storeId);
		message.setUserId(userId);
		message.setOperatorId(operatorId);
		message.setOperatorName(operatorName);
		message.setContent(content);
		message.setMessageDate(new Date());
		message.setCustomerId(customerId);
		if(chassisNumber==null){
			message.setChassisNumber(chassisNumber);
		}else{
			message.setChassisNumber(chassisNumber.toUpperCase());
		}
		
		//保存消息
		messageMapper.insert(message);
	}
	
	/** 
	 * 新增系统消息
	 * @param content 消息内容
	 */
	public Map<String,Object> insertSystemMessage(String content) throws Exception{
		//封装数据
		SystemMessage message = new SystemMessage();
		message.setContent(content);
		message.setMessageDate(new Date());
		//保存消息

		systemMessageMapper.insert(message);
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("sysMessageId", message.getSysMessageId());
		param.put("messageDate", message.getMessageDate());
		return param;

	}
	/** 
	 * 新增系统消息,关于营销短信的
	 * @param content 消息内容
	 */
	public void insertSystemMessageMarket(String content,Integer storeId) throws Exception{
		//封装数据
		SystemMessage message = new SystemMessage();
		message.setContent(content);
		message.setMessageDate(new Date());
		message.setFourStoreId(storeId);
		//保存消息
		systemMessageMapper.insert(message);
	}
	/** 
	 * 删除系统消息
	 * @param sysMessageId 消息id
	 */
	public void deleteSystemMessage(Integer sysMessageId)throws Exception{
		//删除消息
		systemMessageMapper.deleteMessage(sysMessageId);
	}
	
	/** 
	 * 查询系统消息
	 * @param content 消息内容
	 */
	public List<SystemMessage> findSystemMessage(Integer storeId,Integer roleId) throws Exception{
		
		return systemMessageMapper.selectMessage(storeId,roleId);
	}
	
	/** 
	 * 查询系统消息未读数量
	 * @param  userId
	 */
	public int findSystemMessageCount(Integer userId,Integer storeId,Integer roleId)throws Exception{
		User user = userMapper.findRoleByUserId2(userId);
		int count = 0;
		if(user != null){
			Integer sysMessageId = user.getSysMessageId();
			count = systemMessageMapper.selectMessageCount(sysMessageId,storeId,roleId);
		}
		return count;
	}
	/** 
	 * 更新用户表系统消息id
	 * @param  userId
	 */
	public void updateUserSysMessageId(Integer userId,Integer sysMessageId)throws Exception{
		userMapper.updateSysMessageId(sysMessageId, userId);
	}
	
	/**
	 * 由查出的潜客数组转成只有customerId的List
	 * @param renewalingCustomers 潜客List
	 * @return List<Integer> customerId的List
	 */
	public List<Integer> listToCustomerIdList(List<RenewalingCustomer> renewalingCustomers){
		List<Integer> list = new ArrayList<Integer>();
		
		for (RenewalingCustomer renewalingCustomer : renewalingCustomers) {
			list.add(renewalingCustomer.getCustomerId());
		}
		
		return list;
	}
	
	/**
	 * APP首页查询各业务的数量(今日到店/今日出单/回退待审批/延期待审批/未接收/应跟踪/发起邀约/到店未出单/将脱保/已脱保)
	 * @param userId 用户id
	 * @param storeId 4s店id
	 * @return resultMap 查询结果
	 */
	public Map<String, Integer> findHomePageCount(Integer userId, Integer storeId,Integer roleId) throws Exception {
		Map<String, Integer> resultMap = new HashMap<String, Integer>();
		List<User> users = null;
		// 查询入参
		Map<String, Object> param = null;
		//查询该店所有客服专员(有些统计不涉及客服专员)
		List<User> kfUsers = userService.findUsersByStoreIdAndRoleId2(storeId, 5);
		//查询实际到店数(今日)
		Integer comeStoreTodayNum = 0;
		//查询出单数(今日)
		Integer billTodayNum = 0;
		//待审批
		Integer approveNum = 0;
		//回退待审批数量
		Integer returnApproveNum = 0;
		//延期待审批数量
		Integer delayApproveNum = 0;
		//失销待审批数量
		Integer lostApproveNum = 0;
		//睡眠待审批数量
		Integer sleepApproveNum = 0;
		//未接收数量
		Integer accpetNum = 0;
		//应跟踪数量
		Integer shouldTraceNum = 0;
		//已跟踪数量(续保专员是指今日的)
		Integer tracedNum = 0;
		//发起邀约数
		Integer inviteNum = 0;
		//到店未出单数
		Integer comeStoreNoBillNum = 0;
		//将脱保数量
		Integer willOutNum = 0;
		//已脱保数量
		Integer outedNum = 0;
		//今日创建保单数
		Integer billCreatedTodayNum = 0;
		//激活数
		Integer jiHuoNum = 0;
		//已回退
		Integer yiHuiTuiNum = 0;
		//跟踪完成数
		Integer tracedFinishedNum = 0;
		// 已唤醒数量
		Integer activeNum = 0;
		// 战败线索数
		Integer defeatNum = 0;
		//续保主管，保险经理，总经理要查询出下属角色
		Integer[] roleIds = {2,6,8};
		if(roleId == 22){
			roleId = 11;
		}
		if(roleId == 23){
			roleId = 16;
		}
		Store store = storeMapper.selectByPrimaryKey(storeId);
		if(roleId == 3 || roleId == 10 || roleId == 11 || roleId == 16){
			//续保主管,保险经理,总经理,数据分析员=所有销售顾问，服务顾问，续保专员，客服专员的统计
			users = userService.findAllPrincipal(storeId, userId,roleIds);
			
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("users", users);
			param.put("storeId", storeId);
			//查询实际到店数(今日)
			comeStoreTodayNum = renewalingCustomerMapper.findComeStoreCountToday(param);
			//查询出单数(今日)
			billTodayNum = insuranceBillMapper.findBillCountToday(param);
			//查询到店未出单数
			comeStoreNoBillNum = renewalingCustomerMapper.findComeStoreNoBillCountToday(param);
			
			//查询今日发起邀约潜客数
			inviteNum = renewalingCustomerMapper.findInviteToday(param);
			//查询应跟踪(以下4个统计不涉及客服专员)
			param.put("traceStatu", 1);
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			//查询回退待审批
			param.put("returnStatu", 3);
			returnApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
			if(store !=null){
				if(store.getCsModuleFlag()!=null && store.getCsModuleFlag()==1){
					//开启客服模块回退待审批不做处理
				}else{
					//失销待审批
					param.put("applyStatu", 1);
					lostApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
					//睡眠待审批
					param.put("applyStatu", 2);
					sleepApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
					//如果关闭了客服模块,回退待审批只需要查询出服务顾问和销售顾问的
					param.put("roleId", 2);
					param.put("applyStatu", null);
					//续保专员的
					int xbzyReturnApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
					//总的减去续保专员的就是服务顾问与续保专员的总和
					returnApproveNum = returnApproveNum - xbzyReturnApproveNum;
				}
			}
			
			//置空roleId,防止影响后面的查询
			param.put("roleId", null);
			//查询延期待审批
			param.put("returnStatu", 7);
			delayApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
			//将脱保数量
			param.put("cusLostInsurStatu", 1);
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			//已脱保数量
			param.put("cusLostInsurStatu", 2);
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 查询未接收数量
			users.addAll(kfUsers);// 包含客服专员
			param.put("users", users);
			param.put("acceptStatu", 1);
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			//以唤醒数量
			param.put("returnStatu", 10);
			activeNum = renewalingCustomerMapper.findCountActivateCustomer(param);
			//战败线索数
			Map<String, Object> zbxsMap = new HashMap<>();
			if(store !=null){
				if(store.getBangStatu()!=null&&store.getBangStatu()==1){
					zbxsMap.put("bsp_storeId",store.getBspStoreId());
				}else{
					zbxsMap.put("bip_storeId",storeId);
				}
				if(store.getCsModuleFlag()!=null&&store.getCsModuleFlag()==1){
					zbxsMap.put("roleId",5);
				}else{
					zbxsMap.put("roleId",2);
				}
				defeatNum = defeatCustomerMapper.countFindDefeatCustomer(zbxsMap);
			}
			
		}else if (roleId == 2){
			users = userService.findAllPrincipal(storeId, userId, roleIds);
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			
			// 查询待审批
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			//续保专员查看将脱保和已脱保需要把未接收的过滤掉
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			
			// 查询已跟踪,APP查询当日已跟踪的
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			param.put("startTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			param.put("endTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			
			//查询今日创建保单数
			param.put("principalId", userId);
			param.put("foundDate", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			billCreatedTodayNum = insuranceBillMapper.findBillTodayCreateCount(param);
			
			//查询今日邀约
			inviteNum = renewalingCustomerMapper.findJRYYCustomerListCountByUserId(param);
			
			//查询到店未出单
			comeStoreNoBillNum = statisticMapper.findDDWCDCustomerCount(param);
			
			//查询已激活
			param.put("startTime", null);
			param.put("endTime", null);
			jiHuoNum = renewalingCustomerMapper.countFindByJiHuo(param);
			
			//战败线索数
			Map<String, Object> zbxsMap = new HashMap<>();
			if(store.getBangStatu()!=null&&store.getBangStatu()==1){
				zbxsMap.put("bsp_storeId",store.getBspStoreId());
			}else{
				zbxsMap.put("bip_storeId",storeId);
			}
			zbxsMap.put("userId", userId);
			defeatNum = defeatCustomerMapper.countFindDefeatCustomer(zbxsMap);
		}else if (roleId == 6 || roleId == 8){
			users = userService.findAllPrincipal(storeId, userId, roleIds);
			param = new HashMap<String, Object>();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			
			// 查询待审批
			param.put("returnStatu3", 3);
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			//续保专员查看将脱保和已脱保需要把未接收的过滤掉
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			
			//查询到店未出单
			comeStoreNoBillNum = statisticMapper.findDDWCDCustomerCount(param);
			
			//查询已回退
			yiHuiTuiNum = renewalingCustomerMapper.countFindByYiHuiTui(param);
			
			// 查询跟踪完成
			param.put("returnStatu", 11);// 跟踪完成returnStatu为11
			tracedFinishedNum = renewalingCustomerMapper.findGZFinishedCustomerCount(param);
			
			// 查询已跟踪,APP查询当日的
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			param.put("startTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			param.put("endTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
		}else if(roleId == 7){
			users = userService.findUnderling(RoleType.XSJL, storeId);
			param = new HashMap<String, Object>();
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			// 查询待审批;由于销售经理只有审批待回退没有待延期的，所以就直接调用根据回退状态查询的方法即可
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			
			//查询已回退
			param.put("roleId", 6);// 查询的都是销售顾问的已回退
			yiHuiTuiNum = renewalingCustomerMapper.countFindByYiHuiTui(param);
			
			//查询到店未出单
			comeStoreNoBillNum = statisticMapper.findDDWCDCustomerCount(param);
			
			// 查询跟踪完成
			param.put("returnStatu", 11);// 跟踪完成returnStatu为11
			tracedFinishedNum = renewalingCustomerMapper.findGZFinishedCustomerCount(param);
			
			// 查询已跟踪,APP查询当日的
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			param.put("startTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			param.put("endTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
		}else if(roleId == 9){
			users = userService.findUnderling(RoleType.FWJL,storeId);
			param = new HashMap<String, Object>();
			param.put("storeId", storeId);
			param.put("users", users);
			param.put("traceStatu", 1);// 应跟踪traceStatu为1
			// 查询应跟踪(以下4个统计不涉及客服专员)
			shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
			
			// 查询待审批：由于服务经理只有审批待回退没有待延期的，所以就直接调用根据回退状态查询的方法即可
			param.put("returnStatu1", 3);
			param.put("returnStatu2", 7);// 待审批returnStatu为3或者7
			approveNum = renewalingCustomerMapper.findByApprovalCount(param);
			// 将脱保数量
			param.put("cusLostInsurStatu", 1);// 将脱保traceStatu为1
			willOutNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 已脱保数量
			param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
			outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu1(param);
			// 查询未接收数量
			param.put("acceptStatu", 1);// 未接收acceptStatu为1
			accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
			
			//查询已回退
			param.put("roleId", 8);// 查询的都是服务顾问的已回退
			yiHuiTuiNum = renewalingCustomerMapper.countFindByYiHuiTui(param);
			
			//查询到店未出单
			comeStoreNoBillNum = statisticMapper.findDDWCDCustomerCount(param);
			
			// 查询跟踪完成
			param.put("returnStatu", 11);// 跟踪完成returnStatu为11
			tracedFinishedNum = renewalingCustomerMapper.findGZFinishedCustomerCount(param);
			
			// 查询已跟踪,APP查询当日的
			param.put("traceStatu", 2);// 已跟踪traceStatu为2
			param.put("startTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			param.put("endTime", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			tracedNum = renewalingCustomerMapper.countFindByTraceStatu(param);
		}
		
		resultMap.put("comeStoreTodayNum", comeStoreTodayNum);
		resultMap.put("billTodayNum", billTodayNum);
		resultMap.put("comeStoreNoBillNum", comeStoreNoBillNum);
		resultMap.put("inviteNum", inviteNum);
		resultMap.put("approveNum", approveNum);
		resultMap.put("returnApproveNum", returnApproveNum);
		resultMap.put("delayApproveNum", delayApproveNum);
		resultMap.put("shouldTraceNum", shouldTraceNum);
		resultMap.put("accpetNum", accpetNum);
		resultMap.put("willOutNum", willOutNum);
		resultMap.put("outedNum", outedNum);
		resultMap.put("billCreatedTodayNum", billCreatedTodayNum);
		resultMap.put("jiHuoNum", jiHuoNum);
		resultMap.put("tracedNum", tracedNum);
		resultMap.put("yiHuiTuiNum", yiHuiTuiNum);
		resultMap.put("tracedFinishedNum", tracedFinishedNum);
		resultMap.put("activeNum", activeNum);
		resultMap.put("defeatNum", defeatNum);
		resultMap.put("lostApproveNum", lostApproveNum);
		resultMap.put("sleepApproveNum", sleepApproveNum);
		
		return resultMap;
	}
	/**
	 * 查询时间段内的系统通知
	 * @param storeId
	 * @param content
	 * @param date
	 * @return
	 * @throws Exception 
	 */
	public int findSystemMessageTime(Integer storeId, String content) throws Exception {
		return systemMessageMapper.findSystemMessageTime(storeId,content);
	}

	public int findSystemMessageTimeFifty(Integer storeId, String content) throws Exception {
		return systemMessageMapper.findSystemMessageTimeFifty(storeId,content);
	}
}
