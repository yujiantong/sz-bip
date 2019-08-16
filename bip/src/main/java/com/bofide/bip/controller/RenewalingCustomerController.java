package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.ReturnStatus;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.User;
import com.bofide.bip.service.ApprovalBillService;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.InsuranceService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.bip.vo.CustomerTraceRecodeVo;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 将要续保潜客控制类
 * 
 * @author huliangqing
 */
@Controller
@RequestMapping(value = "/renewalingCustomer")
public class RenewalingCustomerController  extends BaseResponse{
	private static Logger logger = Logger.getLogger(RenewalingCustomerController.class);

	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private UserService userService;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private CommonService commonService;
	@Autowired
	private InsuranceService insuranceService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private ApprovalBillService approvalBillService;
	
	/**
	 * 根据主键潜客ID查询记录,查询潜客信息
	 * @return 
	 */
	@RequestMapping(value="/findByCustomerId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCustomerId(@RequestParam(name="customerId") Integer customerId,@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		RenewalingCustomer renewalingCustomer;
		try {
			renewalingCustomer = renewalingCustomerService.findTraceRecordByCustomerId(customerId);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
               	    List<CustomerTraceRecode> customerTraceRecodes = renewalingCustomer.getCustomerTraceRecodes();
                if(renewalingCustomer.getCustomerTraceRecodes().size()>0)
               	    for (CustomerTraceRecode customerTraceRecode : customerTraceRecodes) {
						String valueGzjl = (String) customerTraceRecode.getLxfs();
	               	    String turnTelFGzjl = StringUtil.turnTelF(valueGzjl);
	               	    customerTraceRecode.setLxfs(turnTelFGzjl);
					}
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", renewalingCustomer);
			return rs; 
		} catch (Exception e) {
			logger.info("潜客查询错误-->",e);
			rs.setSuccess(false);
			return rs;
		}
	}
	

	/**
	 * 按跟踪状态条件查询潜客跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findByTraceStatuGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByTraceStatuGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		
		try {
			
			//根据角色查询对应的记录
			List<User> users = null;
			if(roleId == RoleType.KFJL || roleId == RoleType.XSJL || roleId == RoleType.FWJL){
				//如果是客服经理、销售经理、服务经理则只能查看自己部门的下属记录
				users = userService.findUnderling(roleId,storeId);
			}else{
				//如果是不是管理层则子查询自己的，如果是管理层则查询找出销售顾问，服务顾问，续保专员的所有工作人员
				Integer[] roleIds = {RoleType.XBZY,RoleType.XSGW,RoleType.FWGW};
				users = userService.findAllPrincipal(storeId,userId,roleIds);
			}
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			
			//查询单个角色的所有人的潜客
			String holder = (String)param.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					Integer[] roleIds = {RoleType.XBZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					Integer[] roleIds = {RoleType.XSGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					Integer[] roleIds = {RoleType.FWGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					Integer[] roleIds = {RoleType.KFZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("users", users);
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			if(users.size() > 0){
				list = commonService.listToCustomerIdList(customerService.findByTraceStatu(param));
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				//查询潜客总数
				customerCount = customerService.countFindByTraceStatu(param);
				customerGzjlCount = customerService.countFindByTraceStatuGzjl(param);
			}
			rs.addContent("listGzjl", listGzjl);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据跟踪状态查询失败!");
			logger.info(" 按跟踪状态条件查询潜客跟踪记录",e);
			return rs;
		}
	}
	
	/**
	 * 按潜客的潜客脱保状态条件查询潜客跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findByCusLostInsurStatuGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCusLostInsurStatuGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			
			//根据角色查询对应的记录
			List<User> users = null;
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			if(roleId == RoleType.XBZY || roleId == RoleType.XSGW || roleId == RoleType.FWGW){
				users = new ArrayList<>();
				User user = userService.findUserByUserId(userId, storeId);
				users.add(user);
				param.put("users", users);
				if(users.size() > 0){
					//该方法是续保专员，服务顾问，销售顾问等工作人员在查询脱保状态的潜客是要接受后才能查询出，与管理人员有区别
					//list = customerService.findByCusLostInsurStatu2(param);
					//policyCount = customerService.countFindByCusLostInsurStatu2(param);
				}
			}else if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL){
				//销售经理/服务经理/客服经理
				/*users = userService.findUnderling(roleId,storeId);
				param.put("users", users);
				if(users.size() > 0){
					list = customerService.findByCusLostInsurStatu(param);
					//查询总数
					policyCount = customerService.countFindByCusLostInsurStatu1(param);
				}*/
			}else{
				//查询单个角色的所有人的潜客
				String holder = (String)param.get("holder");
				if(holder!=null&&holder.length()>0){
					if(holder.equals("全部续保专员")){
						Integer[] roleIds = {RoleType.XBZY};
						users = userService.findAllPrincipal(storeId,userId,roleIds);
						param.put("holder", "");
					}else if(holder.equals("全部销售顾问")){
						Integer[] roleIds = {RoleType.XSGW};
						users = userService.findAllPrincipal(storeId,userId,roleIds);
						param.put("holder", "");
					}else if(holder.equals("全部服务顾问")){
						Integer[] roleIds = {RoleType.FWGW};
						users = userService.findAllPrincipal(storeId,userId,roleIds);
						param.put("holder", "");
					}else if(holder.equals("全部客服专员")){
						Integer[] roleIds = {RoleType.KFZY};
						users = userService.findAllPrincipal(storeId,userId,roleIds);
						param.put("holder", "");
					}else{
						//(续保主管，总经理，保险经理)如果不是管理层则只查询自己的，如果是管理层则查询找出销售顾问，服务顾问，续保专员的所有工作人员
						Integer[] roleIds = {2,6,8};
						users = userService.findAllPrincipal(storeId,userId,roleIds);
					}
				}else{
					//(续保主管，总经理，保险经理)如果不是管理层则只查询自己的，如果是管理层则查询找出销售顾问，服务顾问，续保专员的所有工作人员
					Integer[] roleIds = {2,6,8};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
				}
				param.put("users", users);
				if(users.size() > 0){
					list = commonService.listToCustomerIdList(customerService.findByCusLostInsurStatu(param));
					listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
					//查询总数
					customerCount = customerService.countFindByCusLostInsurStatu1(param);
					customerGzjlCount = customerService.countFindByCusLostInsurStatuGzjl(param);
				}	
			}
		
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据保单日期状态查询失败!");
			logger.info(" 按保单日期状态条件查询潜客 跟踪记录",e);
			return rs;
		}
	}
	
	/**
	 * 按接受状态查询潜客跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findByAcceptStatuGzjl",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findByAcceptStatuGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			List<User> users = null;
			if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL){
				//如果是客服经理、销售经理、服务经理则只能查看自己部门的下属记录
				users = userService.findUnderling(roleId,storeId);
			}else{
				//如果不是管理层则只查询自己的，如果是管理层则查询找出销售顾问，服务顾问，续保专员，客服专员的所有工作人员
				//users = userService.findAllUnacceptUser(storeId,userId);
				Integer[] roleIds = {RoleType.XSGW,RoleType.FWGW,RoleType.XBZY,RoleType.KFZY};
				users = userService.findAllPrincipal(storeId, userId, roleIds);
			}
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			
			//查询单个角色的所有人的潜客
			String holder = (String)param.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					Integer[] roleIds = {RoleType.XBZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					Integer[] roleIds = {RoleType.XSGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					Integer[] roleIds = {RoleType.FWGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					Integer[] roleIds = {RoleType.KFZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("users", users);
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			if(users.size() > 0){
				list = commonService.listToCustomerIdList(customerService.findByAcceptStatu(param));
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				//查询总数
				customerCount = customerService.countFindByAcceptStatu(param);
				customerGzjlCount = customerService.countFindByAcceptStatuGzjl(param);
			}
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接受状态查询失败!");
			logger.info(" 按接受状态查询潜客跟踪记录",e);
			return rs;
		}
		
	}
	/**
	 * 按回退状态查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByReturnStatuGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByReturnStatuGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//分页
			List<User> users = new ArrayList<User>();
			
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer returnStatu = (Integer)param.get("returnStatu");
			if(roleId == RoleType.CDY){
				//出单员的回退查询是查询客服专员的记录
				users = userService.findCSCIsLost(storeId);
			}else if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL || roleId == RoleType.XBZG){
				//如果是续保主管，客服经理、销售经理、服务经理,查看自己部门下属的回退记录
				if(returnStatu == ReturnStatus.BEENWAKE){//如果是查询已激活，实际上客户经理看到的是续保专员的记录
					users = userService.findUnderling(RoleType.XBZG,storeId);
				}else{
					users = userService.findUnderling(roleId,storeId);
				}
			}else{
				//总经理，销售顾问，服务顾问，续保专员的所有工作人员
				Integer[] roleIds = {RoleType.XBZY}; 
				users = userService.findAllPrincipal(storeId,userId,roleIds);
			}
			//查询单个角色的所有人的潜客
			String holder = (String)param.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					Integer[] roleIds = {RoleType.XBZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					Integer[] roleIds = {RoleType.XSGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					Integer[] roleIds = {RoleType.FWGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					Integer[] roleIds = {RoleType.KFZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("users", users);
			
			List<Integer> list = new ArrayList<Integer>();
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			boolean isManager = userService.isManager(roleId,userId);
			//roleId是否管理人员的角色
			if(returnStatu != null && returnStatu == ReturnStatus.BEENLOST && isManager == true){ 
				list = commonService.listToCustomerIdList(customerService.findBeenLostCus(param));
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				 
				//查询总数
				customerCount = customerService.findCountBeenLostCus(param);
				customerGzjlCount = customerService.findCountBeenLostCusGzjl(param);
			
			}else if(returnStatu != null && returnStatu == ReturnStatus.BEENRETURN && isManager == true){ 
				//list = commonService.listToCustomerIdList(customerService.findBeenLostCus(param));
				
				List<RenewalingCustomer> findByYiHuiTui = renewalingCustomerService.findByYiHuiTui(param);
				for (RenewalingCustomer renewalingCustomer : findByYiHuiTui) {
					list.add(renewalingCustomer.getCustomerId()); 
				} 
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				
				//查询总数
				customerCount = renewalingCustomerService.countFindByYiHuiTui(param);
				customerGzjlCount = renewalingCustomerService.findByReturnStatuGzjlCount(param);
				
			}else if(users.size() > 0){
				
				list = commonService.listToCustomerIdList(customerService.findByReturnStatu(param));
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				//查询总数
				customerCount = customerService.countFindByReturnStatu(param);
				customerGzjlCount = customerService.countFindByReturnStatuGzjl(param);
			}
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("回退状态查询失败!");
			logger.info("按回退状态查询潜客跟踪记录",e);
			return rs;
		}
	}
	/**
	 * 按邀约状态查询潜客跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findByInviteStatuGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByInviteStatuGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("userId", userId);
			param.put("roleId", roleId);
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			list = commonService.listToCustomerIdList(customerService.findByInviteStatu(param));
			listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
			//查询总数
			customerCount = customerService.countFindByInviteStatu(param);
			customerGzjlCount = customerService.countFindByInviteStatuGzjl(param);
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("邀约状态查询失败!");
			logger.info("按邀约状态查询潜客跟踪记录",e);
			return rs;
		}
	}
	
	/**
	 * 按待审批查询潜客跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findByApprovalGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByApprovalGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String returnStatus = (String)param.get("approvalStatu");
			String returnStatu3 = param.get("returnStatu3") == null ? "" : param.get("returnStatu3").toString();
			String applyStatu = (String)param.get("applyStatu");
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			String[] split = returnStatus.split(",");
			List<User> users = null;
			if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL){
				//如果是客服经理、销售经理、服务经理则只能查看自己部门的下属记录
				users = userService.findUnderling(roleId,storeId);
			}else{
				//如果不是管理层则子查询自己的，如果是管理层则查询找出销售顾问，服务顾问，续保专员的所有工作人员
				Integer[] roleIds = {2,6,8};
				users = userService.findAllPrincipal(storeId,userId,roleIds);
				if("3".equals(returnStatu3) && "".equals(applyStatu)){
					Store store = storeService.findStoreById(storeId);
					if(store.getCsModuleFlag()!=null && store.getCsModuleFlag()==0){
						//如果关闭了客服模块,那么回退待审批只需要查询出销售顾问和服务顾问的
						Integer[] gwRoleIds = {6,8};
						users = userService.findAllPrincipal(storeId,userId,gwRoleIds);
					}
				}
			}
			//查询单个角色的所有人的潜客
			String holder = (String)param.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					Integer[] roleIds = {RoleType.XBZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					Integer[] roleIds = {RoleType.XSGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					Integer[] roleIds = {RoleType.FWGW};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					Integer[] roleIds = {RoleType.KFZY};
					users = userService.findAllPrincipal(storeId,userId,roleIds);
					param.put("holder", "");
				}
			}
			param.put("returnStatu1", new Integer(split[0]));
			param.put("returnStatu2", new Integer(split[1]));
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("users", users);
			param.put("storeId",storeId);
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			if(users.size() > 0){
				list = commonService.listToCustomerIdList(customerService.findByApproval(param));
				listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
				customerCount = customerService.findByApprovalCount(param);
				customerGzjlCount = customerService.countFindByApprovalGzjl(param);
			}
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.info("待审批查询潜客跟踪记录失败" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("待审批查询失败!");
			return rs;
		}
	}
	
	/**
	 * 多条件查询潜客跟踪记录（基盘是大池子包括未分配的潜客，一般用于续保主管，保险经理，总经理，等需要看到所有潜客的用户）
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCustByConditionGzjl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustByConditionGzjl(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> conditionMap = null;
		try {
			conditionMap = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//查询单个角色的所有人的潜客
			String holder = (String)conditionMap.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					conditionMap.put("roleId", RoleType.XBZY);
					conditionMap.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					conditionMap.put("roleId", RoleType.XSGW);
					conditionMap.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					conditionMap.put("roleId", RoleType.FWGW);
					conditionMap.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					conditionMap.put("roleId", RoleType.KFZY);
					conditionMap.put("holder", "");
				}
			}
			Integer startNum = (Integer)conditionMap.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			conditionMap.put("start", start);
			conditionMap.put("pageSize", ConstantUtil.pageSize);
			List<Integer> list = null;
			List<CustomerTraceRecodeVo> listGzjl = null;
			int customerCount = 0;
			int customerGzjlCount = 0;
			list = commonService.listToCustomerIdList(insuranceService.findCustByCondition(conditionMap));
			listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
			//查询总数
			customerCount = insuranceService.countFindCustByCondition(conditionMap);
			customerGzjlCount = insuranceService.countFindCustByConditionGzjl(conditionMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
		} catch (Exception e) {
			logger.info("查询潜客信息失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询潜客信息失败,程序异常!");
			return rs; 
		}
		return rs; 
	}
	
	
	/**
	 * 查询已经唤醒的潜客跟踪记录
	 * @return
	 */
	@RequestMapping(value="/findActivateCustomerGzjl",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findActivateCustomerGzjl(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer returnStatu = (Integer)param.get("returnStatu");
			if(returnStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				logger.info("查询已经唤醒的潜客跟踪记录失败,原因可能是roleId为："+roleId+"的用户角色没有将returnStatu传递到后台！");
				return rs;
			}
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("userId", userId);
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			
			int customerCount = 0;
			int customerGzjlCount = 0;
			
			List<Integer> list = commonService.listToCustomerIdList(customerService.findActivateCustomer(param));
			List<CustomerTraceRecodeVo> listGzjl = renewalingCustomerService.findTraceRecordByCustomerIdList(list);
			customerCount = customerService.findCountActivateCustomer(param);
			customerGzjlCount = customerService.countFindActivateCustomerGzjl(param);
			
			rs.addContent("listGzjl", listGzjl);
			rs.addContent("customerCount", customerCount);
			rs.addContent("customerGzjlCount", customerGzjlCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			logger.info("查询已经唤醒的潜客跟踪记录失败",e);
			return rs;
		}
	}
	
	/**
	 * 查询已回退潜客记录数
	 * @return 
	 */
	@RequestMapping(value="/findByYiHuiTui",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByYiHuiTui(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			
			param.put("storeId", storeId);
			if(roleId==2||roleId==6||roleId==8){
				param.put("userId", userId);
			}
			if(roleId==7||roleId==9||roleId==19){
				if(roleId==19||roleId==9){
					param.put("roleId", 8);
				}else{
					param.put("roleId", 6);
				}
			}
			//查询单个角色的所有人的潜客
			String holder = (String)param.get("holder");
			if(holder!=null&&holder.length()>0){
				if(holder.equals("全部续保专员")){
					param.put("roleId1", RoleType.XBZY);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					param.put("roleId1", RoleType.XSGW);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					param.put("roleId1", RoleType.FWGW);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					param.put("roleId1", RoleType.KFZY);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			if(startNum!=null){
				Integer start = (startNum - 1) *ConstantUtil.pageSize;
				Integer pageSize = ConstantUtil.pageSize;
				param.put("start", start);
				param.put("pageSize", pageSize);
			}else{
				Integer appPageSize = ConstantUtil.appPageSize;
				Integer currentPage = (Integer)param.get("currentPage");
				Integer start = (currentPage - 1) * appPageSize;
				param.put("start", start);
				param.put("pageSize", appPageSize);
			}
			
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			list = renewalingCustomerService.findByYiHuiTui(param);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (RenewalingCustomer renewalingCustomer : list) {
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
				}
			}
			//查询总数
			policyCount = renewalingCustomerService.countFindByYiHuiTui(param);
			rs.addContent("list", list);
			rs.addContent("policyCount", policyCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("到店未出单潜客查询失败!");
			logger.info("到店未出单潜客查询失败!",e);
			return rs;
		}
	}
}
