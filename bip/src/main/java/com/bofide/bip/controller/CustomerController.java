package com.bofide.bip.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.ReturnStatus;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.exception.CustomerAssignException;
import com.bofide.bip.exception.CustomerNotMatchException;
import com.bofide.bip.exception.CustomerReceivedException;
import com.bofide.bip.exception.CustomerTracedException;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.mapper.InsuranceCompMapper;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.CustomerBJRecode;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.po.User;
import com.bofide.bip.service.ApprovalBillService;
import com.bofide.bip.service.AssignCustomerService;
import com.bofide.bip.service.BiHuService;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.CustomerAssignService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.CustomerTraceRecodeService;
import com.bofide.bip.service.GetCarInfoFromBofideService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.SettingService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.TraceDaySetService;
import com.bofide.bip.service.UpdateCustomerFromBHService;
import com.bofide.bip.service.UserService;
import com.bofide.bip.vo.BxFromBHInfoVo;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.DealStringUtil;
import com.bofide.common.util.SplitListUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.JSONUtils;
import net.sf.json.util.JavaIdentifierTransformer;

@Controller
@RequestMapping(value = "/customer")
public class CustomerController {
	private static Logger logger = Logger.getLogger(CustomerController.class);
	private static int CUSTOMER_IMPORT_SIZE = 10;
	private static int CUSTOMER_ASSIGN_SIZE = 10;
	private static int PRINCIPAL_ROLEID = 2;
	
	@Autowired
	private CustomerService customerService;
	@Autowired
	private CustomerTraceRecodeService customerTraceRecodeService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private AssignCustomerService assignCustomerService; 
	@Autowired
	private CommonService commonService;
	@Autowired
	private TraceDaySetService traceDaySetService;
	@Autowired
	private UserService userService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private CustomerAssignService customerAssignService;
	@Autowired
	private UpdateCustomerFromBHService updateCustomerFromBHService;
	@Resource(name="insuranceCompMapper")
	private InsuranceCompMapper insuranceCompMapper;
	@Resource(name="biHuService")
	private BiHuService biHuService;
	@Autowired
	private SettingService settingService;
	@Autowired
	private ApprovalBillService approvalBillService;
	@Resource(name="getCarInfoFromBofideService")
	private GetCarInfoFromBofideService getCarInfoFromBofideService;
	
	/**
	 * 按跟踪状态条件查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByTraceStatu",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByTraceStatu(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer traceStatu = (Integer)param.get("traceStatu");
			if(traceStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将traceStatu传递到后台！");
				return rs;
			}
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
			String[] customerLevels = {"S","F","O"};
			param.put("users", users);
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("customerLevels", customerLevels);
			
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			if(users.size() > 0){
				list = customerService.findByTraceStatu(param);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (RenewalingCustomer renewalingCustomer : list) {
						String value = (String) renewalingCustomer.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    renewalingCustomer.setContactWay(turnTelF);
					}
				}
				//查询总数
				policyCount = customerService.countFindByTraceStatu(param);
				if(traceStatu==1){
					//根据潜客ID和用户ID查询当前跟踪次数
					if(list!=null&&list.size()>0){
						Map<String, Object> map = new HashMap<String, Object>();
						String customers = "";
						for(int i=0;i<list.size();i++){
							if(customers.length()==0){
								customers = "'"+list.get(i).getCustomerId()+"'";
							}else{
								customers = customers+","+"'"+list.get(i).getCustomerId()+"'";
							}
						}
						map.put("customers", customers);
						List<Map<String, Object>> lists = customerTraceRecodeService.findGzCount(map);
						for(int i=0;i<lists.size();i++){
							int id = (int)lists.get(i).get("id");
							long num = (long)lists.get(i).get("gzCount");
							for(int j=0;j<list.size();j++){
								if(id==list.get(j).getCustomerId()){
									list.get(j).setGzCount(Integer.valueOf(num+""));
									break;
								}
							}
						}
					}
				}
			}
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据跟踪状态查询失败!");
			logger.info(" 按跟踪状态条件查询潜客",e);
			return rs;
		}
		
	}
	
	/**
	 * 按潜客的潜客脱保状态条件查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByCusLostInsurStatu",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCusLostInsurStatu(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer cusLostInsurStatu = (Integer)param.get("cusLostInsurStatu");
			if(cusLostInsurStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将cusLostInsurStatu传递到后台！");
				return rs;
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			
			//根据角色查询对应的记录
			List<User> users = null;
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			if(roleId == RoleType.XBZY || roleId == RoleType.XSGW || roleId == RoleType.FWGW){
				users = new ArrayList<>();
				User user = userService.findUserByUserId(userId, storeId);
				users.add(user);
				param.put("users", users);
				if(users.size() > 0){
					//该方法是续保专员，服务顾问，销售顾问等工作人员在查询脱保状态的潜客是要接收后才能查询出，与管理人员有区别
					list = customerService.findByCusLostInsurStatu2(param);
					policyCount = customerService.countFindByCusLostInsurStatu2(param);
				}
			}else if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL){
				//销售经理/服务经理/客服经理
				users = userService.findUnderling(roleId,storeId);
				param.put("users", users);
				if(users.size() > 0){
					list = customerService.findByCusLostInsurStatu(param);
					//查询总数
					policyCount = customerService.countFindByCusLostInsurStatu1(param);
				}
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
					list = customerService.findByCusLostInsurStatu(param);
					//数据分析员视图下加密电话号码
					if(roleId==RoleType.SJGLY){
						for (RenewalingCustomer renewalingCustomer : list) {
							String value = (String) renewalingCustomer.getContactWay();
		               	    String turnTelF = StringUtil.turnTelF(value);
		               	    renewalingCustomer.setContactWay(turnTelF);
						}
					}
					//查询总数
					policyCount = customerService.countFindByCusLostInsurStatu1(param);
				}	
			}
		
			rs.addContent("list", list);
			rs.addContent("policyCount", policyCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据保单日期状态查询失败!");
			logger.info(" 按保单日期状态条件查询潜客",e);
			return rs;
		}
	}
	/**
	 * 按接收状态查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByAcceptStatu",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findByAcceptStatu(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer acceptStatu = (Integer)param.get("acceptStatu");
			if(acceptStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将acceptStatu传递到后台！");
				return rs;
			}
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
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			if(users.size() > 0){
				list = customerService.findByAcceptStatu(param);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (RenewalingCustomer renewalingCustomer : list) {
						String value = (String) renewalingCustomer.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    renewalingCustomer.setContactWay(turnTelF);
					}
				}
				//查询总数
				policyCount = customerService.countFindByAcceptStatu(param);
			}
			rs.addContent("policyCount", policyCount);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收状态查询失败!");
			logger.info(" 按接收状态查询潜客",e);
			return rs;
		}
		
	}
	/**
	 * 按回退状态查询潜客
	 * ()
	 * @return 
	 */
	@RequestMapping(value="/findByReturnStatu",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByReturnStatu(@RequestParam(name="userId") Integer userId,
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
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将returnStatu传递到后台！");
				return rs;
			}
			
			List<User> users = new ArrayList<User>();
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			if(roleId == RoleType.CDY){
				//出单员的回退查询是查询客服专员的记录
				users = userService.findCSCIsLost(storeId);
			}else if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL || roleId == RoleType.XBZG){
				//如果是续保主管，客服经理、销售经理、服务经理,查看自己部门下属的回退记录
				if(returnStatu == ReturnStatus.BEENWAKE){//如果是查询已激活，客服经理查询所有客服专员的记录
					users = userService.findUnderling(RoleType.KFJL,storeId);
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
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("users", users);
			
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			boolean isManager = userService.isManager(roleId,userId);
			if(returnStatu==5){
				param.put("customerLevel", "F");
			}
			//roleId是否管理人员的角色
			if((returnStatu != null && returnStatu == ReturnStatus.BEENLOST && isManager == true)||roleId==1){
				list = customerService.findBeenLostCus(param);
				if(roleId == RoleType.KFJL || roleId == RoleType.XBZG){
					if(list.size()>0){
						for(int i=0;i<list.size();i++){
							RenewalingCustomer customer = list.get(i);
							String sxyy = customerTraceRecodeService.findLostReasonByCustomerId(customer.getCustomerId());
							customer.setSxyy(sxyy);
						}
					}
				}
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (RenewalingCustomer renewalingCustomer : list) {
						String value = (String) renewalingCustomer.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    renewalingCustomer.setContactWay(turnTelF);
					}
				}
				//查询总数
				policyCount = customerService.findCountBeenLostCus(param);
			}else if(users.size() > 0){
				list = customerService.findByReturnStatu(param);
				//查询总数
				policyCount = customerService.countFindByReturnStatu(param);
			}
			rs.addContent("policyCount", policyCount);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("回退状态查询失败!");
			logger.info("按回退状态查询潜客",e);
			return rs;
		}
	}
	
	/**
	 * 按邀约状态查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByInviteStatu",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByInviteStatu(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer inviteStatu = (Integer)param.get("inviteStatu");
			if(inviteStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将inviteStatu传递到后台！");
				return rs;
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			param.put("userId", userId);
			param.put("roleId", roleId);
			List<RenewalingCustomer> list = customerService.findByInviteStatu(param);
			//查询总数
			int policyCount = customerService.countFindByInviteStatu(param);
			rs.addContent("policyCount", policyCount);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("邀约状态查询失败!");
			logger.info("按邀约状态查询潜客",e);
			return rs;
		}
	}
	/**
	 * 按待审批查询潜客(续保主管，保险经理，总经理)
	 * @return 
	 */
	@RequestMapping(value="/findByApproval",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByApproval(@RequestParam(name="userId") Integer userId,
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
			if(returnStatus == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据审批状态查询失败!");
				logger.info("按审批状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将approvalStatu传递到后台！");
				return rs;
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			String[] split = returnStatus.split(",");
			List<RenewalingCustomer> list = null;
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
			int policyCount = 0;
			if(users.size() > 0){
				list = customerService.findByApproval(param);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (RenewalingCustomer renewalingCustomer : list) {
						String value = (String) renewalingCustomer.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    renewalingCustomer.setContactWay(turnTelF);
					}
				}
				policyCount = customerService.findByApprovalCount(param);
			}
			rs.addContent("list", list);
			rs.addContent("policyCount", policyCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.info("待审批查询失败" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("待审批查询失败!");
			return rs;
		}
	}
	/**
	 * 根据查询字段查询潜客信息
	 * @param request
	 * @param response
	 * @return
	 * （基盘是小池子，即只有可以查询到已经分配的潜客，一般用于续保专员，销售顾问，服务顾问等需要查询到已经分配的潜客）
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String searchDatas = request.getParameter("searchDatas");
		Integer userId = new Integer(request.getParameter("userId"));
		Integer roleId = new Integer(request.getParameter("roleId"));
		Integer storeId = new Integer(request.getParameter("storeId"));
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> map = null;
		try {
			map = objectMapper.readValue(searchDatas, Map.class);
			
			Integer startNum = (Integer)map.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			List<User> users = new ArrayList<User>();
			if(roleId == RoleType.KFJL || roleId == RoleType.FWJL || roleId == RoleType.XSJL){
				//如果是客服经理、销售经理、服务经理则只能查看自己部门的下属记录
				users = userService.findUnderling(roleId,storeId);
			}else{
				User user = userService.findUserByUserId(userId,storeId);
				users.add(user);
			}
			map.put("start", start);
			map.put("pageSize", ConstantUtil.pageSize);
			map.put("users", users);
			List<RenewalingCustomer> list = null;
			//查询总数
			int policyCount =0;
			if(users.size() > 0){
				list = customerService.findByCondition(map);
				policyCount = customerService.countFindByCondition(map);
			}
			rs.addContent("policyCount", policyCount);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("多条件潜客查询失败!");
			logger.info("根据查询字段查询潜客信息",e);
			return rs;
		}
	}

	/**
	 * 跟踪处理删除邀约
	 */
	@RequestMapping(value = "/deleteInvite",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse deleteInvite(
			@RequestParam(name="customerTraceId") Integer customerTraceId, 
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="deleteInvietReason") String deleteInvietReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, userId);
			if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu() == 3){
				logger.info("删除邀约失败,不能操作未持有的潜客");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("删除邀约失败,不能操作未持有的潜客");
				return rs;
			}
			CustomerTraceRecode customerTraceRecode = customerTraceRecodeService.findByCustomerTraceId(customerTraceId);
			if(customerTraceRecode != null){
				if(customerTraceRecode.getOperatorID() !=null && !customerTraceRecode.getOperatorID().equals(userId)){
					logger.info("删除邀约失败,不能删除别人的邀约");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("删除邀约失败,不能删除别人的邀约");
					return rs;
				}
			}
			String operation = "删除邀约";
			String dealDeleteInvietReason = DealStringUtil.dealTraceRecordReason(operation, deleteInvietReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation,userName);
			customerService.deleteInviteDay(customerTraceId,userId,dealDeleteInvietReason,userName,customerId,lastTraceResult,principalId,principal);
		} catch (Exception e) {
			logger.info("删除邀约失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除邀约失败,程序异常");
			return rs;
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs; 
	}
	
	/** 
	 * 新增潜客
	 * @return 
	 */
	@RequestMapping(value="/addCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addCustomer(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerInfoJson = request.getParameter("customerInfo");
		String storeIdStr = request.getParameter("storeId");
		String userName = request.getParameter("userName");
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		boolean generateCustomerFlag = "1".equals(request.getParameter("generateCustomerFlag")) ? true : false;
		Integer storeId = new Integer(storeIdStr);
		if(StringUtils.isEmpty(customerInfoJson)){
			
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("客户信息为空,新增潜客失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject customerJsonObj = JSONObject.fromObject(customerInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(new DateMorpher(new String[] {"yyyy-MM-dd"}));
			Customer customer = (Customer)JSONObject
					.toBean(customerJsonObj,Customer.class);
			Integer renewalType = customer.getRenewalType();
			customer.setCreaterId(userId);
			if(roleId == 2){
				//设置负责人
				customer.setPrincipalId(userId);
				customer.setPrincipal(userName);
				
			}
			//如果roleId=RoleType.FWGW，说明是服务顾问新增潜客，将业务员更新为改该服务顾问,分配时就能分给自己
			if(roleId == RoleType.FWGW){
				customer.setClerkId(userId);
				customer.setClerk(userName);
			}
			//判断数据库是否存在相同的车架号，如果相同则不添加并给出提示
			String chassisNumber = customer.getChassisNumber();
			Customer customer2 = customerService.findCustomerByChassisNumber(chassisNumber,storeId);
			if(customer2 == null){
				//如果是新转续或者续转续则说明该潜客上一年已经续保了
				if(renewalType == 2 || renewalType == 3){
					customer.setLastYearIsDeal(1);
				}else{
					customer.setLastYearIsDeal(0);
				}
				customerService.saveCustomer(customer,generateCustomerFlag,userId);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("潜客车架号已存在,不能添加重复的车架号！");
			}
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs; 
		}catch (Exception e) {
			logger.info("新增潜客失败,程序异常",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增潜客失败!");
			return rs; 
		}
		return rs; 
	}
	
	/**
	 * 自动填充下次跟踪日期
	 */
	@RequestMapping(value="/setNextTraceDay",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse setNextTraceDay(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerLevel = request.getParameter("customerLevel");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		//根据潜客的级别设置默认的跟踪日期
		TraceDaySet traceDaySet = null;
		try {
			traceDaySet = traceDaySetService.findTraceTimeByCl(customerLevel,storeId);
			Integer dayNumber = traceDaySet.getDayNumber();
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.DAY_OF_MONTH, dayNumber);
			Date nextTraceDate = calendar.getTime();
			rs.setSuccess(true);
			rs.addContent("results", nextTraceDate);
			rs.addContent("status", "OK");
			return rs;
		} catch (Exception e) {
			logger.info("根据潜客级别查询设置下次跟踪日期间隔失败",e);
			rs.setSuccess(false);
			rs.setMessage("根据潜客级别查询设置下次跟踪日期间隔失败");
			rs.addContent("status", "BAD");
			return rs;
		}
	}
	
	/** 新增跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/addTraceRecord",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addTraceRecord(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerTraceRecode = request.getParameter("customerTraceRecode");
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		Integer traceFlag = Integer.valueOf(request.getParameter("traceFlag"));
		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		String userName = request.getParameter("userName");
		String returnReason = request.getParameter("returnReason");
		String htyyxz = request.getParameter("htyyxz");
		String applyStatu1 = request.getParameter("applyStatu");
		Integer applyStatu = null;
		if(!StringUtils.isEmpty(applyStatu1)){
			applyStatu = Integer.parseInt(applyStatu1);
		}
		Map<String,Object> mapht = new HashMap<>();
		mapht.put("returnReason", returnReason);
		mapht.put("userName", userName);
		mapht.put("htyyxz", htyyxz);
		logger.info("ID为" + userId + "的用户开始新增一条跟踪记录");
		logger.info("跟踪记录信息为:" + customerTraceRecode);
		if(StringUtils.isEmpty(customerTraceRecode)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.addContent("message","跟踪记录信息为空,新增跟踪记录失败");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject customerTraceRecodeJsonObj = JSONObject.fromObject(customerTraceRecode);
			JSONUtils.getMorpherRegistry().registerMorpher(new DateMorpher(new String[] { "yyyy-MM-dd" }));
			CustomerTraceRecode bean = (CustomerTraceRecode)JSONObject
					.toBean(customerTraceRecodeJsonObj,CustomerTraceRecode.class);
			bean.setOperatorID(userId);
			Integer customerId = bean.getCustomerId();
			
			//判断用户输入的下次跟踪记录是否超过保险到期日
			Date nextTraceDate = bean.getNextTraceDate();
			RenewalingCustomer renewalingCustomer = renewalingCustomerService.findRenewalingCustomer(customerId);
			Date insuranceEndDate = renewalingCustomer.getVirtualJqxdqr();
			bean.setVirtualJqxdqr(insuranceEndDate);
			bean.setNewNextTraceDate(bean.getNextTraceDate());
			long insuranceEndTime = insuranceEndDate.getTime();
			long nextTraceTime = nextTraceDate.getTime();
			//如果有邀约日期,则对邀约日期进行校验, 该日期已被使用,则不能再次对改天邀约
			if(bean != null && bean.getInviteDate() != null){
				Map<String, Object> param = new HashMap<>();
				param.put("customerId", bean.getCustomerId());
				param.put("inviteDate", bean.getInviteDate());
				int existCount = customerTraceRecodeService.findExistInviteDate(param);
				if(existCount > 0){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.addContent("message","预计到店日期已被邀约过,不能重复邀约");
					return rs;
				}
			}
			
			//如果该潜客已经申请过延期，则以延期的日期为限制
			CustomerAssign customerAssign = customerService.findAssignRecode(userId,customerId);
			if(customerAssign == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.addContent("message","新增跟踪记录失败,该潜客已经跟踪完成");
				return rs;
			}
			//跟踪完成时,对于处于待审批的不能跟踪完成
			if(traceFlag != null && traceFlag == 2){
				if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == 3){
					logger.info("跟踪完成操作失败,该潜客处于待审批中");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.addContent("message","跟踪完成操作失败,该潜客处于待审批中");
					return rs;
				}
			}
			
			//如果是跟踪并延期或者跟踪并睡眠时,只能存在一种情况
			if(traceFlag != null && traceFlag == 3){
				Integer returnStatu = customerAssign.getReturnStatu();
				if(returnStatu != null && returnStatu == 3){
					Integer apply = customerAssign.getApplyStatu();
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					if(apply==null){
						rs.addContent("message","该潜客已经申请过回退！");
					}else if(apply==1){
						if(applyStatu==2){
							rs.addContent("message","申请睡眠操作失败，失销待审批中的潜客不能操作睡眠申请！");
						}else{
							rs.addContent("message","该潜客已经申请过失销！");
						}
					}else if(apply==2){
						if(applyStatu==1){
							rs.addContent("message","申请失销操作失败，睡眠待审批中的潜客不能操作失销申请！");
						}else{
							rs.addContent("message","该潜客已经申请过睡眠！");
						}
					}
					return rs;
				}
			}
			Date delayDate = customerAssign.getDelayDate();
			
			//如果已经延期了，则下次跟踪日期必须在延期日期之前
			if(delayDate != null){
				long delayTime = delayDate.getTime();
				if(nextTraceTime > delayTime && (renewalingCustomer.getCusLostInsurStatu() == 1 
						|| renewalingCustomer.getCusLostInsurStatu() == 2)){
					rs.setSuccess(false);
					rs.addContent("status", "dataException");
					rs.addContent("message","输入的下次跟踪日期超过延期后的日期，请重新选择！");
					return rs;
				}else{
					//调用service新增跟踪记录
					customerTraceRecodeService.insert(bean,userId,storeId,traceFlag,roleId,mapht,applyStatu);
					rs.setSuccess(true);
					rs.addContent("status", "OK");
					return rs; 
				}
			}else{
				//如果没有没有延期，下次跟踪日期必须在保险到期日之前
				if(nextTraceTime > insuranceEndTime){
					rs.setSuccess(false);
					rs.addContent("status", "dataException");
					rs.addContent("message","输入的下次跟踪日期超过保险到期日，请重新选择！");
					return rs;
				}else{
					//调用service新增跟踪记录
					customerTraceRecodeService.insert(bean,userId,storeId,traceFlag,roleId,mapht,applyStatu);
					rs.setSuccess(true);
					rs.addContent("status", "OK");
					return rs; 
				}
			}
		} catch(NoUserAssignException e){
			logger.info("新增跟踪记录失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.addContent("message","新增跟踪记录失败,"+ e.getMessage());
			return rs; 
		} catch (Exception e) {
			logger.info("新增跟踪记录失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.addContent("message","新增跟踪记录失败,程序异常");
			return rs; 
		}
	}
	
	/**
	 * 续保专员接收处理
	 */
	@RequestMapping(value = "/updateAcceptStatu",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateAcceptStatu(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			String operation = "接收";
			String reason = null;
			String traceRecordReason = DealStringUtil.dealTraceRecordReason(operation, reason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateAcceptStatu(customerId, userId,userName,traceRecordReason,lastTraceResult,principalId,principal);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (CustomerReceivedException cre) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,该潜客已被接收");
			logger.error("续保专员接收失败,该潜客已被接收:", cre);
			return rs; 
		} catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,当前状态不可接收");
			logger.error("续保专员接收失败,该潜客状态为跟踪完成:", cte);
			return rs; 
		} catch (Exception e) {
			logger.error("续保专员接收失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,程序异常");
			return rs;
		}
		
	}
	
	
	/**
	 * 续保专员接收处理(批量)
	 */
	@SuppressWarnings({"static-access", "unchecked" })
	@RequestMapping(value = "/updateAcceptStatuBatch",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateAcceptStatuBatch(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerInfoStr = request.getParameter("customerInfo");
		String userName = request.getParameter("userName");
		if(StringUtils.isEmpty(customerInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("客户信息为空,续保专员处理失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONArray jsonArray = JSONArray.fromObject(customerInfoStr);
			List<Map<String,Object>> custInfoList = (List<Map<String,Object>>)jsonArray.toCollection(jsonArray, Map.class);
			//调用service批量处理
			String operation = "接收";
			String reason = null;
			String traceRecordReason = DealStringUtil.dealTraceRecordReason(operation, reason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateAcceptStatuBatch(custInfoList,traceRecordReason,lastTraceResult);
			
		}catch (CustomerReceivedException cre) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在已经接收过的潜客");
			logger.error("续保专员批量接收失败,程序异常:", cre);
			return rs; 
		}catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在不可接收的潜客");
			logger.error("续保专员批量接收失败,存在状态为跟踪完成的潜客:", cte);
			return rs; 
		}catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,程序异常");
			logger.error("续保专员批量接收失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("续保专员处理信息成功");
		return rs; 
		
		
	}
	
	/**
	 * 客服专员接收处理(批量)
	 */
	@SuppressWarnings({ "static-access", "unchecked" })
	@RequestMapping(value = "/updateCseAcceptStatuBatch",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateCseAcceptStatuBatch(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerInfoStr = request.getParameter("customerInfo");
		String userName = request.getParameter("userName");
		if(StringUtils.isEmpty(customerInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("客户信息为空,客服专员处理失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONArray jsonArray = JSONArray.fromObject(customerInfoStr);
			List<Map<String,Object>> custInfoList = (List<Map<String,Object>>)jsonArray.toCollection(jsonArray, Map.class);
			//调用service批量处理
			String operation = "接收";
			String reason = null;
			String traceRecordReason = DealStringUtil.dealTraceRecordReason(operation, reason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateCseAcceptStatuBatch(custInfoList,traceRecordReason,lastTraceResult);
			
		} catch (CustomerReceivedException cre) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在已经接收过的潜客");
			logger.error("客服专员批量接收失败,程序异常:", cre);
			return rs; 
		} catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在不可接收的潜客");
			logger.error("客服专员批量接收失败,存在状态为跟踪完成的潜客:", cte);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,程序异常");
			logger.error("客服专员批量接收失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("续保专员处理信息成功");
		return rs; 
		
		
	}
	
	/**
	 * 销售,服务等顾问的接收处理(批量)
	 */
	@SuppressWarnings({ "static-access", "unchecked" })
	@RequestMapping(value = "/updateConsultantAcceptStatuBatch",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateConsultantAcceptStatuBatch(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerInfoStr = request.getParameter("customerInfo");
		String userName = request.getParameter("userName");
		if(StringUtils.isEmpty(customerInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("客户信息为空,销售,服务等顾问处理失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONArray jsonArray = JSONArray.fromObject(customerInfoStr);
			List<Map<String,Object>> custInfoList = (List<Map<String,Object>>)jsonArray.toCollection(jsonArray, Map.class);
			//调用service批量处理
			String operation = "接收";
			String reason = null;
			String traceRecordReason = DealStringUtil.dealTraceRecordReason(operation, reason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateConsultantAcceptStatuBatch(custInfoList,traceRecordReason,lastTraceResult);
			
		}catch (CustomerReceivedException cre) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在已经接收过的潜客");
			logger.error("顾问批量接收失败,程序异常:", cre);
			return rs; 
		} catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,存在不可接收的潜客");
			logger.error("顾问批量接收失败,存在状态为跟踪完成的潜客:", cte);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("接收失败,程序异常");
			logger.error("销售,服务等顾问批量接收失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("续保专员处理信息成功");
		return rs; 
		
		
	}
	
	
	/**
	 * 更换负责人
	 * @param customerId 潜客id
	 * @param principalId 更换后负责人id
	 * @param principal 更换后负责人
	 * @param prePrincipalId 更换前负责人id
	 * @param prePrincipal 更换前负责人
	 * @param userId 操作人id
	 * @param userName 操作人姓名
	 */
	@RequestMapping(value = "/changePrincipal",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse changePrincipal(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="principalId")Integer principalId,
			@RequestParam(name="principal")String principal,
			@RequestParam(name="prePrincipalId")Integer prePrincipalId,
			@RequestParam(name="prePrincipal")String prePrincipal,
			@RequestParam(name="userId")Integer userId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId")Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, prePrincipalId);
			if(customerAssign == null){
				logger.info("更换负责人失败,非续保专员跟踪，不能更换负责人");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("更换负责人失败,非续保专员跟踪，不能更换负责人");
				return rs;
			}/*else{
				if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu() == 3){
					logger.info("更换负责人失败,此潜客已经更换过负责人");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("更换负责人失败,此潜客已经更换过负责人");
					return rs;
				}
			}*/
			
			String operation = "更换负责人";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updatePrincipal(customerId, principalId,principal,prePrincipalId,prePrincipal,dealReturnReason,userName,lastTraceResult,userId);
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "你车架号为" + chassisNumber + "的潜客被更换负责人。------" + userName;
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.info("更换负责人失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更换负责人失败,程序异常");
			return rs;
		}
		
	}
	
	/**
	 * 销售,服务等经理更换持有人
	 * @param customerId 潜客id
	 * @param principalId 更换后负责人id
	 * @param principal 更换后负责人
	 * @param userId 更换前负责人id
	 * @param superiorId 更换前负责人上级id,即更换接收人的操作者
	 */
	@RequestMapping(value = "/managerChangePrincipal",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse managerChangePrincipal(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="principalId")Integer principalId,
			@RequestParam(name="principal")String principal,
			@RequestParam(name="prePrincipalId")Integer prePrincipalId,
			@RequestParam(name="prePrincipal")String prePrincipal,
			@RequestParam(name="userId")Integer userId,
			@RequestParam(name="superiorId")Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId")Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, prePrincipalId);
			if(customerAssign.getTraceStatu() != null && customerAssign.getTraceStatu() == 3){
				logger.info("更换持有人失败,此潜客已经更换过持有人");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("更换持有人失败,此潜客已经更换过持有人");
				return rs;
			}
			String operation = "更换持有人";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateManagerChangePrincipal(customerId, principalId,principal,prePrincipalId,
					prePrincipal,dealReturnReason,userName,lastTraceResult,userId);
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "你车架号为" + chassisNumber + "的潜客被更换持有人。------" + userName;
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.info("更换持有人失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更换持有人失败,程序异常");
			return rs;
		}
		
	}
	
	/**
	 * 跟踪完成操作
	 */
	@RequestMapping(value = "/traceFinishHandle",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse traceFinishHandle(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="userId")Integer userId,
			@RequestParam(name="userName")String userName,
			@RequestParam(name="storeId")Integer storeId,
			@RequestParam(name="principalId")Integer principalId,
			@RequestParam(name="principal")String principal,
			@RequestParam(name="roleId")Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
//			int traceCount = customerTraceRecodeService.findTraceCount(customerId);
//			if(traceCount <= 0){
//				logger.info("跟踪完成操作失败,每个潜客必须跟踪一次");
//				rs.setSuccess(false);
//				rs.addContent("status", "BAD");
//				rs.setMessage("跟踪完成操作失败,每个潜客必须跟踪一次");
//				return rs;
//			}
			
			CustomerAssign customerAssign = customerService.findAssignRecode(userId,customerId);
			if(customerAssign !=null){
				if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == 3){
					logger.info("跟踪完成操作失败,该潜客处于待审批中");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("跟踪完成操作失败,该潜客处于待审批中");
					return rs;
				}
			}
			CustomerAssign assign = new CustomerAssign();
			assign.setCustomerId(customerId);
			assign.setUserId(userId);
			assign.setAssignDate(new Date());
			assign.setAcceptStatu(1);
			assign.setReturnStatu(1);
			
			//续保专员的分配信息
			CustomerAssign commissionerAssign = new CustomerAssign();
			commissionerAssign.setCustomerId(customerId);
			//如果负责人有填写则优先分配该负责人,否则就随机分配
			Customer customer = customerService.findCustomer(customerId);
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
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.insertNewAssign(assign,commissionerAssign,storeId,userName,lastTraceResult,
					principalId,principal,roleId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("跟踪完成操作成功");
			return rs; 			
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			logger.info(e.getMessage());
			return rs;
		}catch (DuplicateKeyException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("跟踪完成失败，该潜客已跟踪完成！");
			return rs;
		}catch (Exception e) {
			logger.info("跟踪完成操作失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("跟踪完成操作失败");
			return rs;
		}
		
	}
	/**
	 * 续保主管同意回退处理
	 */
	@RequestMapping(value = "/traceReturnXbzg",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse traceReturnXbzg(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName){
		BaseResponse rs = new BaseResponse();
		
		try {
			String operation = "";
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,principalId);
			if(customerAssign != null){
				Integer returnStatu = customerAssign.getReturnStatu();
				Integer traceStatu = customerAssign.getTraceStatu();
				Integer applyStatu = customerAssign.getApplyStatu();
				if(traceStatu != null && traceStatu == 3){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该潜客已经跟踪完成了！");
					return rs;
				}else{
					if(returnStatu != null && returnStatu == 2){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("该潜客已经回退过！");
						return rs;
					}else{
						if(returnStatu!=null&&returnStatu==1){
							if(applyStatu==null){
								rs.setMessage("该潜客已不处于待回退状态！");
							}else if(applyStatu==1){
								rs.setMessage("该潜客已不处于待失销状态！");
							}else if(applyStatu==2){
								rs.setMessage("该潜客已不处于待睡眠状态！");
							}
							rs.setSuccess(false);
							rs.addContent("status", "BAD");
							return rs;
						}
						if(applyStatu==null){
							operation = "同意回退";
							String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
							customerService.updateReturnStatuXbzg(customerId, userId,principalId,principal,dealReturnReason,userName,storeId,dealReturnReason);
						}else if(applyStatu==1){
							operation = "同意失销";
							String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
							customerService.updateRSByLostSaleXBZG(customerId,userId,storeId,dealReturnReason,userName,principalId,principal,dealReturnReason,customerAssign.getApplyLossReason());
						}else if(applyStatu==2){
							operation = "同意睡眠";
							customerService.saveCustomerSleepXBZG(customerId,userId,userName,principalId,principal,returnReason);
						}
					}
				}
			}else {
				logger.info("操作失败,非续保专员跟踪,不能执行此操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("操作失败,非续保专员跟踪,不能执行此操作");
				return rs;
			}
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "同意回退,潜客车架号为" + chassisNumber + "。";
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("message", "回退成功！");
			return rs; 
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs;
		}catch (Exception e) {
			logger.info("跟踪回退失败,程序异常:" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("同意回退失败！");
			return rs;
		}
	}
	/**
	 * 续保主管不同意回退
	 */
	@RequestMapping(value = "/unAgreeTraceReturnXbzg",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse unAgreeTraceReturnXbzg(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,principalId);
			String operation = "";
			if (customerAssign != null) {
				Integer returnStatu = customerAssign.getReturnStatu();
				Integer traceStatu = customerAssign.getTraceStatu();
				Integer applyStatu = customerAssign.getApplyStatu();
				if (traceStatu != null && traceStatu == 3) {
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该潜客已经跟踪完成了！");
					return rs;
				} else {
					if (returnStatu != null && returnStatu == 1) {
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						if(applyStatu==null){
							rs.setMessage("该潜客已不处于待回退状态！");
						}else if(applyStatu==1){
							rs.setMessage("该潜客已不处于待失销状态！");
						}else if(applyStatu==2){
							rs.setMessage("该潜客已不处于待睡眠状态！");
						}
						return rs;
					} else {
						if(applyStatu==null){
							operation = "不同意回退";
						}else if(applyStatu==1){
							operation = "不同意失销";
						}else if(applyStatu==2){
							operation = "不同意睡眠";
						}
						String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
						String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
						customerService.updateReturnStatuUnAgree(customerId,
								principalId, principalId, principal,dealReturnReason,
								userName, storeId,lastTraceResult);
					}
				}
			} else {
				logger.info("操作失败,非续保专员跟踪，不能执行此操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("操作失败,非续保专员跟踪，不能执行此操作");
				return rs;
			}
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + operation+",潜客车架号为" + chassisNumber + "。";
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage(operation+"成功！");
			return rs; 
		} catch (Exception e) {
			logger.info("操作失败,程序异常:" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("操作失败！");
			return rs;
		}
	}
	
	/**
	 * 续保专员申请回退
	 */
	@RequestMapping(value = "/traceReturn",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse traceReturn(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="htyyxz") String htyyxz,
			@RequestParam(name="applyStatu") Integer applyStatu){
		BaseResponse rs = new BaseResponse();
		try {
			String operation = "";
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			if(returnStatu != null && returnStatu == 3){
				Integer apply = customerAssign.getApplyStatu();
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				if(apply==null){
					rs.setMessage("该记录已经申请过回退！");
				}else if(apply==1){
					if(applyStatu==2){
						rs.setMessage("申请睡眠操作失败，失销待审批中的潜客不能操作睡眠申请！");
					}else{
						rs.setMessage("该记录已经申请过失销！");
					}
				}else if(apply==2){
					if(applyStatu==1){
						rs.setMessage("申请失销操作失败，睡眠待审批中的潜客不能操作失销申请！");
					}else{
						rs.setMessage("该记录已经申请过睡眠！");
					}
				}
				return rs;
			}else if(returnStatu != null && returnStatu == 2){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经被回退过，不能申请回退！");
				return rs;
			}else if(returnStatu != null && returnStatu == 7){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录处于待延期状态，请处理完该记录才能继续操作！");
				return rs;
			}else{
				if(applyStatu==null){
					operation = "申请回退";
				}else if(applyStatu==1){
					operation = "申请失销";
				}else if(applyStatu==2){
					operation = "申请睡眠";
				}
				String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateReturnStatu(customerId,userId,superiorId,dealReturnReason,userName,storeId,lastTraceResult,principalId,principal,htyyxz,applyStatu);
			}
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName+ operation+"，潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", superiorId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage(operation+"成功！");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("操作失败！");
			logger.info("跟踪处理同意回退",e);
			return rs;
		}
	}
	/**
	 * 销售顾问回退
	 */
	@RequestMapping(value = "/returnBySC",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse returnBySC(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了，不能申请回退！");
				return rs;
			}else if(returnStatu != null && returnStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经被申请过回退！");
				return rs;
			}else if(returnStatu != null && returnStatu == 7){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录处于待延期状态，请处理完该记录才能继续操作！");
				return rs;
			}else{
				String operation = "申请回退";
				String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateReturnByPrincipal(customerId,userId,superiorId,dealReturnReason,userName,storeId,lastTraceResult,principalId,principal);
			}
					
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName+ "申请回退，潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", superiorId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("申请回退成功！");
			return rs; 		
		} catch (Exception e) {
			logger.info("回退操作失败,程序异常!" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("申请回退操作失败！");
			return rs;
		}
			
		
		
	}
	
	/**
	 * 销售经理回退
	 */
	@RequestMapping(value = "/returnBySCM",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse returnBySCM(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,clerkId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了！");
				return rs;
			}else{
				if(returnStatu != null && returnStatu == 2){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经回退过了！");
					return rs;
				}else{
					String operation = "同意回退";
					String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					customerService.updateReturnBySuperior(customerId, userId, clerkId,storeId,dealReturnReason,userName,lastTraceResult,principalId,principal);
				}
			}
			
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "同意回退,潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", clerkId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("同意回退成功！");
			return rs; 			
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs;
		}catch (Exception e) {
			logger.info("回退操作失败,程序异常!" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("同意回退操作失败！");
			return rs;
		}
	}
	/**
	 * 销售经理不同意回退
	 */
	@RequestMapping(value = "/unAgreeReturnBySCM",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse unAgreeReturnBySCM(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,clerkId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了！");
				return rs;
			}else{
				if(returnStatu != null && returnStatu == 1){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经拒绝回退过了！");
					return rs;
				}else{
					String operation = "不同意回退";
					String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					customerService.updateReturnStatuUnAgree(customerId, clerkId, principalId,principal,dealReturnReason,userName,storeId,lastTraceResult);
				}
			}
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "拒绝回退,潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", clerkId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.setMessage("拒绝回退成功！");
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.info("回退操作失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("拒绝回退操作失败！");
			return rs;
		}
	}
	/**
	 * 服务顾问回退
	 */
	@RequestMapping(value = "/returnByFwgw",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse returnByFwgw(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了，不能申请回退！");
				return rs;
			}else if(returnStatu != null && returnStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经被申请过回退！");
				return rs;
			}else if(returnStatu != null && returnStatu == 7){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录处于待延期状态，请处理完该记录才能继续操作！");
				return rs;
			}else{
				String operation = "申请回退";
				String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateReturnByPrincipal(customerId, userId, superiorId,dealReturnReason,userName,storeId,lastTraceResult,principalId,principal);
			}
			
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName+ "申请回退，潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", superiorId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("申请回退成功！");
			return rs; 			
		} catch (Exception e) {
			logger.info("回退操作失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("申请回退操作失败！");
			return rs;
		}
	}
	
	
	/**
	 * 服务经理回退
	 */
	@RequestMapping(value = "/returnByFwgwM",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse returnByFwgwM(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,clerkId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了！");
				return rs;
			}else{
				if(returnStatu != null && returnStatu == 2){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经回退过了！");
					return rs;
				}else{
					String operation = "同意回退";
					String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					customerService.updateReturnBySuperior(customerId, userId, clerkId,storeId,dealReturnReason,userName,lastTraceResult,principalId,principal);
				}
			}
			
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "同意回退,潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", clerkId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("同意回退成功！");
			return rs; 			
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs;
		}catch (Exception e) {
			logger.info("回退操作失败,程序异常:" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("同意回退操作失败！");
			return rs;
		}
	}
	/**
	 * 服务经理不同意回退
	 */
	@RequestMapping(value = "/unAgreeReturnByFwgwM",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse unAgreeReturnByFwgwM(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,clerkId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了！");
				return rs;
			}else{
				if(returnStatu != null && returnStatu == 1){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经拒绝回退过了！");
					return rs;
				}else{
					String operation = "不同意回退";
					String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					customerService.updateReturnStatuUnAgree(customerId, clerkId,principalId,principal ,dealReturnReason,userName,storeId,lastTraceResult);
				}
			}
			
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "拒绝回退,潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", clerkId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("拒绝回退成功！");
			return rs; 			
		} catch (Exception e) {
			logger.info("回退操作失败,程序异常!" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("拒绝回退操作失败！");
			return rs;
		}
	}
	/**
	 * 客服专员失销
	 */
	@RequestMapping(value = "/lostSale",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse lostSale(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="lostReason") String lostReason,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="sxyyxz") String sxyyxz){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			if(returnStatu != null && returnStatu == ReturnStatus.BEENLOST){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经失销了！");
				return rs;
			}
			if(returnStatu == ReturnStatus.CHECKLOST){
				String operation = "失销";
				String dealLostReason = DealStringUtil.dealTraceRecordReason(operation, lostReason, userName);
				//String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateRSByLostSale(customerId,userId,superiorId,storeId,dealLostReason,userName,principalId,principal,dealLostReason,sxyyxz);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("失销成功！");
				return rs; 			
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录不处于待失销，失销失败！");
				return rs;
			}
			
		} catch (Exception e) {
			logger.info("失销操作失败,程序异常!",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("失销操作失败,程序异常!");
			return rs;
		}
	}
	
	/**
	 * 激活
	 */
	@RequestMapping(value = "/wakeUpCustomer",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse wakeUpCustomer(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="wakeReason") String wakeReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="loginRoleId") Integer loginRoleId){
		BaseResponse rs = new BaseResponse();
		try {
			
			Customer customer = customerService.findCustomer(customerId);
			String customerLevel = customer.getCustomerLevel();
			if(customerLevel.equals("F")){
				String operation = "激活";
				String dealWakeReason = DealStringUtil.dealTraceRecordReason(operation, wakeReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.updateWakeUpCustomer(customerId,userId,principalId,principal,dealWakeReason,userName,storeId,lastTraceResult,loginRoleId);
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经激活了！");
				return rs;
			}
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("激活成功！");
			return rs; 			
		} catch (NoUserAssignException e) {
			logger.info("激活操作失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("激活操作失败,请确保潜客当前负责人不被暂停禁用");
			return rs;
		} catch (Exception e) {
			logger.info("激活操作失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("激活操作失败,程序异常!");
			return rs;
		}
	}
	
	/**
	 * 延期申请操作,更新回退状态为待延期状态(续保专员申请延期)
	 */
	@RequestMapping(value = "/updateReturnStatuToDyq",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateReturnStatuToDyq(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="applyDelayDay") String applyDelayDayStr){
		BaseResponse rs = new BaseResponse();
		try {
			Customer customer = customerService.findCustomer(customerId);
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, userId);
			if(customer.getCusLostInsurStatu() == 2){
				if(customerAssign.getDelayDate() != null && customerAssign.getDelayDate().getTime() < new Date().getTime()){
					logger.info("延期失败,不能操作");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("延期失败,不能操作");
					return rs;
				}
			}
			if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == ReturnStatus.CHECKDELAY){
				logger.info("延期申请操作失败,已对此潜客做出延期操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("延期申请操作失败,已对此潜客做出延期操作");
				return rs;
			} else if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == ReturnStatus.BEENRETURN){
				logger.info("延期申请操作失败,已回退潜客不能做出延期操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("延期申请操作失败,已回退潜客不能做出延期操作");
				return rs;
			} else if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == ReturnStatus.CHECKRETURN){
				logger.info("延期申请操作失败,待回退潜客不能做出延期操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				Integer applyStatu = customerAssign.getApplyStatu();
				if(applyStatu==null){
					rs.setMessage("延期申请操作失败,待回退潜客不能做出延期操作");
				}else if(applyStatu==1){
					rs.setMessage("延期申请操作失败,申请失销的潜客不能做出延期操作");
				}else if(applyStatu==2){
					rs.setMessage("延期申请操作失败,申请睡眠的潜客不能做出延期操作");
				}
				return rs;
			}
			String operation = "申请延期到"+ applyDelayDayStr;
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			//String lastTraceResult = dealLastTraceResult +"到"+ applyDelayDayStr;
			customerService.updateReturnStatuToDyq(customerId,userId,dealReturnReason,userName,lastTraceResult,principalId,principal,applyDelayDayStr);
			//获取车架号拼装消息内容
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "申请车架号为" + chassisNumber + "的潜客延期到"+applyDelayDayStr+"。------" + userName;
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", superiorId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.error("延期申请操作失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("延期申请操作失败,程序异常");
			return rs;
		}
	}
	
	/**
	 * 延期审批同意时,更新回退状态为已延期状态,更新延期到期日为当前时间加 7天
	 * (续保主管同意延期)
	 */
	@RequestMapping(value = "/updateReturnStatuToYyq",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateReturnStatuToYyq(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, principalId);
			if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == 8){
				logger.info("延期同意审批失败,已对此潜客做出同意延期操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("同意延期操作失败,已对此潜客做过这个操作");
				return rs;
			}
			String operation = "同意延期";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateReturnStatuToYyq(customerId,principalId,principal,dealReturnReason,lastTraceResult,userId);
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "同意延期车架号为" + chassisNumber + "的潜客。------" + userName;
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.error("同意延期操作失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("同意延期操作失败,程序异常");
			return rs;
		}
	}
	
	/**
	 * 续保主管直接点击延期,更新回退状态为已延期状态,更新延期到期日为当前时间加 7天
	 */
	@RequestMapping(value = "/updateReturnStatuByRD",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateReturnStatuByRD(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			Customer customer = customerService.findCustomer(customerId);
			if(customer.getCusLostInsurStatu() == 2){
				CustomerAssign customerAssign = customerService.findAssignRecode(principalId,customerId);
				if(customerAssign == null){
					logger.info("非续保专员跟踪此潜客，不能操作");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("非续保专员跟踪此潜客，不能操作");
					return rs;
				}else{
					if(customerAssign.getDelayDate() != null && customerAssign.getDelayDate().getTime() > new Date().getTime()){
						logger.info("延期失败,此潜客已被延期");
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("延期失败,此潜客已被延期");
						return rs;
					}
				}
				
			}else{
				logger.info("延期失败,此潜客不是已脱保");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("此潜客非已脱保,不能延期");
				return rs;
			}
			
			String operation = "延期";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateReturnStatuZjyq(customerId,principalId,principal,dealReturnReason,lastTraceResult,userId);
			//获取车架号拼装消息内容
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "车架号为" + chassisNumber + "的潜客已延期。------" + userName;
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.error("延期操作失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("延期操作失败,程序异常");
			return rs;
		}
	}
	
	/**
	 * 延期审批拒绝时,更新回退状态为最初始的状态: 1
	 * (续保主管拒绝延期)
	 */
	@RequestMapping(value = "/updateReturnStatuToCszt",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateReturnStatuToCszt(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId, principalId);
			if(customerAssign.getReturnStatu() != null && customerAssign.getReturnStatu() == 1){
				logger.info("拒绝延期失败,已对此潜客做过此操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("拒绝延期失败,已对此潜客做过此操作");
				return rs;
			}
			String operation = "拒绝延期";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateReturnStatuToCszt(customerId,principalId,principal,dealReturnReason,userName,lastTraceResult,userId);
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = "不同意延期车架号为" + chassisNumber + "的潜客。------" + userName;
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
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.error("拒绝延期操作失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("拒绝延期操作失败,程序异常");
			return rs;
		}
	}
	
	
	
	/**
	 * 更新潜客信息
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/updateCustomerInfo",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateCustomerInfo(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customer = request.getParameter("customer");
		String userName = request.getParameter("userName");
		int userId = Integer.valueOf(request.getParameter("userId"));
		int storeId = Integer.valueOf(request.getParameter("storeId"));
		int superiorId = Integer.valueOf(request.getParameter("superiorId"));
		int principalId = Integer.valueOf(request.getParameter("principalId"));
		int roleId = Integer.valueOf(request.getParameter("roleId"));
		int holderId = Integer.valueOf(request.getParameter("holderId"));
		String principal = request.getParameter("principal");
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> map = objectMapper.readValue(customer, Map.class);
			String newJqxrqEndStr = (String)map.get("jqxrqEnd");
			Integer customerId = (Integer)map.get("customerId");
			String chassisNumber = (String)map.get("chassisNumber");
			Customer customer2 = customerService.findCustomer(customerId);
			Date virtualJqxdqr = customer2.getVirtualJqxdqr();
			//修改车架号的校验
			boolean chassisNumberIsExist = false;
			if(!chassisNumber.equals(customer2.getChassisNumber())){
				//判断修改后的车架号是否与已经存在
				chassisNumberIsExist = customerService.chassisNumberIsExist(chassisNumber,storeId);
				if(chassisNumberIsExist == true){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("更新失败，车架号已存在，请重试!");
					return rs;
				}
			}
			//获取原本的保险到期日
			Date oldJqxdqrEnd = customer2.getJqxrqEnd();
			String oldJqxdqrEndStr = DateUtil.toString(oldJqxdqrEnd);
			Date newVirtualJqxdqr = null;
			boolean isModifyInsurEndDay = false;//如果为false表示没有修改保险到期日，否则则修改了保险到期日
			if(!oldJqxdqrEndStr.equals(newJqxrqEndStr)){
			
				isModifyInsurEndDay = true;
				CustomerAssign customerAssign = null;
				//如果该潜客修改了保险到期日并且是处于审批延期日状态时，则不允许修改保险到期日
				if(roleId == RoleType.XBZG || roleId == RoleType.CDY){//如果是续保主管则需要先处理待延期潜客
					customerAssign = customerAssignService.findCustomerAssign(customerId,holderId);
					if(customerAssign != null){
						Integer returnStatu = customerAssign.getReturnStatu();
						if(returnStatu != null && returnStatu == ReturnStatus.CHECKDELAY){
							rs.setSuccess(false);
							rs.addContent("status", "BAD");
							rs.setMessage("该潜客处于申请延期状态，保险到期日不能修改，请先处理延期!");
							return rs;
						}
					}
				}else{
					customerAssign = customerAssignService.findCustomerAssign(customerId,userId);
					if(customerAssign != null){
						Integer returnStatu = customerAssign.getReturnStatu();
						if(returnStatu != null && returnStatu == ReturnStatus.CHECKDELAY){
							rs.setSuccess(false);
							rs.addContent("status", "BAD");
							rs.setMessage("该潜客处于申请延期状态，保险到期日不能修改!");
							return rs;
						}
					}
				}
				
				//根据新的保险到期日生成新的虚拟保险到期日
				//如果修改的保险到期日后的保险到期日是在当前日期之前则按如下规则生成保险到期日
				Calendar curCal = Calendar.getInstance();
				Date curDate = DateUtil.formatDate(curCal);
				Date newJqxrqEnd = DateUtil.toDate(newJqxrqEndStr);
				if(newJqxrqEnd.getTime() < curDate.getTime()){
					Calendar cal = Calendar.getInstance();
					cal.setTime(newJqxrqEnd);
					Integer month = cal.get(Calendar.MONTH)+1;
					Integer day = cal.get(Calendar.DAY_OF_MONTH);
					Calendar cal2 = Calendar.getInstance();
					cal2.setTime(virtualJqxdqr);
					Integer year = cal2.get(Calendar.YEAR);
					newVirtualJqxdqr = DateUtil.formatDate(year, month, day);
				}else{
					newVirtualJqxdqr = newJqxrqEnd;
				}
			
			}
			
			map.put("newVirtualJqxdqr", newVirtualJqxdqr);
			map.put("userId", userId);
			map.put("userName", userName);
			customerService.updateCustomerInfo(map,customer2,isModifyInsurEndDay,principalId,principal);
			if(!oldJqxdqrEndStr.equals(newJqxrqEndStr)){
				String content = userName + "修改潜客的保险到期日，潜客车架号为" +chassisNumber;
				Map<String,Object> param = new HashMap<String,Object>();
				User xbzg = userService.findXBZGByStoreId(storeId);
				param.put("storeId", storeId);
				param.put("operatorId", userId);
				param.put("operatorName",userName);
				param.put("content", content);
				param.put("customerId", customerId);
				param.put("chassisNumber", chassisNumber);
				if(superiorId>0){
					param.put("userId", superiorId);
					commonService.insertMessage(param);
					if(roleId!=RoleType.XBZY){
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}else{
					param.put("userId", holderId);
					if(holderId>0){
						commonService.insertMessage(param);
					}
					if(roleId==RoleType.CDY){
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("更新潜客信息成功");
		} catch (Exception e) {
			logger.info("更新潜客信息失败" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新潜客信息失败,程序异常");
		}
		return rs;
	}
	
	/**
	 * 潜客数据导入
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/importCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importCustomer(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer fourSStoreId = Integer.valueOf(request.getParameter("fourSStoreId"));
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		Integer isFugai = Integer.valueOf(request.getParameter("isFugai"));
		List<Map<String,Object>> dataList = null;
		List<Customer> customerList = null;//经过初始化校验筛选后的数据,包含重复跳过导入的数据和提示异常的数据
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		List<Map<String,Object>> duplicateMessage = new ArrayList<>();
		Store store = null;
		int dataCount = 0;//总记录数
		int duplicateCount = 0;//重复记录数
		try {
			store = storeService.findStoreById(fourSStoreId);
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			//检测该店是否有续保专员可以分配
			boolean flag = userService.checkStoreHaveWorker(fourSStoreId);
			if(flag == false){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("导入失败,没有续保专员可分配,请确保续保专员存在或者状态正常");
				return rs;
			}
			ObjectMapper mapper = new ObjectMapper();
			dataList = mapper.readValue(data, List.class);
			dataCount = dataList.size();
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();
				String principal = map.get("principal")==null ? "" : map.get("principal").toString();
				if(!"".equals(principal) && principal != null){
					List<User> principalList = userService.findUserIdByUserName(fourSStoreId, principal, PRINCIPAL_ROLEID);
					if(principalList.size()<=0){
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "负责人不匹配");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String clerk = map.get("clerk")==null ? "" : map.get("clerk").toString();
				if(!"".equals(clerk) && clerk != null){
					List<User> clerkList = userService.findClerkIdByUserName(fourSStoreId, clerk);
					if(clerkList.size()<=0){
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "业务员或者销售员不匹配");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				
				if(map.get("chassisNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车架号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("registrationDate") != null) {
					String registrationDate = ((String) map.get("registrationDate")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(registrationDate);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "上牌日期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if(map.get("carBrand") != null){
					String carBrand = map.get("carBrand").toString();
					if(carBrand.length()>20){
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "品牌长度过长");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if(map.get("contact") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "联系人不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("contactWay") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "联系人手机不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if ((Integer)map.get("renewalType") == 0) {
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "投保类型不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if ((Integer)map.get("renewalType") == 1) {
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "投保类型不能为新保");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String insurNumber = map.get("insurNumber")==null ? "0" : map.get("insurNumber").toString();
				if(!StringUtil.isNumeric(insurNumber)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "投保次数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("jqxrqEnd")== null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "交强险到期日不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				
				if (map.get("jqxrqEnd") != null) {
					String jqxrqEnd = ((String) map.get("jqxrqEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(jqxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "交强险到期日格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("syxrqEnd") != null) {
					String syxrqEnd = ((String) map.get("syxrqEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(syxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "商业险到期日格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("insurDateLY") != null) {
					String insurDateLY = ((String) map.get("insurDateLY")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(insurDateLY);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "去年投保日期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String maintainNumberLY = map.get("maintainNumberLY")==null ? "0" : map.get("maintainNumberLY").toString();
				if(!StringUtil.isNumeric(maintainNumberLY)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "本店维修次数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String accidentNumberLY = map.get("accidentNumberLY")==null ? "0" : map.get("accidentNumberLY").toString();
				if(!StringUtil.isNumeric(accidentNumberLY)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "出险次数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			customerList = mapper.readValue(jsonStr,new TypeReference<List<Customer>>() { });
			List<Customer> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			//int errorRow = 0;
			for (int i = 0; i < customerList.size(); i++) {
				Customer customer = customerList.get(i);
				tempList.add(customer);
				if ((i + 1) % CUSTOMER_IMPORT_SIZE == 0 || i == customerList.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					//errorRow = i / CUSTOMER_IMPORT_SIZE * CUSTOMER_IMPORT_SIZE;
					errorRows = customerService.saveCustomerFromImport(tempList,isFugai,userId);
					if(errorRows.size()>0){
						for(int j = 0;j<errorRows.size();j++){
							Map<String, Object> tempMap = errorRows.get(j);
							String errorType = (String) tempMap.get("errorType");
							if("duplicate".equals(errorType)){
								duplicateMessage.add(tempMap);//将重复的提示信息保存下来
								duplicateCount++;
							}else if("error".equals(errorType)){
								errorMessage.add(tempMap);//将错误的提示信息保存下来
							}
						}
					}
					tempList.clear();
				}
			}
			try {
				if (customerList.size() > 0) {
					//检测该店是否有用户可以分配
					if(flag == true){
						// 执行定时分配任务
						assignForImport(customerList, fourSStoreId);
					}
				}
			} catch (CustomerAssignException ae) {
				logger.error("导入成功,但是分配失败", ae);
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				if(errorMessage.size()<=0&&duplicateMessage.size()<=0){
					rs.setMessage("导入成功"+dataCount+"条数据,但是分配失败.");
				}else{
					if(errorMessage.size()<=0){
						rs.addContent("errorMessage", duplicateMessage);
						rs.setMessage("导入成功"+(dataCount-duplicateCount)+"条数据,有"+duplicateCount+"条数据已经存在,同时分配失败.");
					}else{
						errorMessage.addAll(duplicateMessage);
						rs.addContent("errorMessage", errorMessage);
						rs.setMessage("导入成功"+(dataCount-errorMessage.size())+"条数据,有"+errorMessage.size()+"条数据导入失败,同时分配失败.");
					}
				}
				return rs;
			}
		}catch(Exception e){
			logger.error("导入失败,程序异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("导入失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(fourSStoreId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		if(errorMessage.size()<=0&&duplicateMessage.size()<=0){
			rs.setMessage("导入成功"+dataCount+"条数据.");
		}else{
			if(errorMessage.size()<=0){
				rs.addContent("errorMessage", duplicateMessage);
				rs.setMessage("导入成功"+(dataCount-duplicateCount)+"条数据,有"+duplicateCount+"条数据已经存在.");
			}else{
				errorMessage.addAll(duplicateMessage);
				rs.addContent("errorMessage", errorMessage);
				rs.setMessage("导入成功"+(dataCount-errorMessage.size())+"条数据,有"+errorMessage.size()+"条数据导入失败.");
			}
		}
		return rs;
	}
	
	/**
	 * 导入潜客时分配接口(不需要事务)
	 * @param customerList
	 * @param fourSStoreId
	 * @throws CustomerAssignException 
	 * @throws Exception
	 */
	public void assignForImport(List<Customer> customerList,Integer fourSStoreId) throws CustomerAssignException{
		try {
			Map<String, Integer> map = traceDaySetService.findStoreSetTraceDay(fourSStoreId);
			Map<String,Object> reSetParam = new HashMap<String,Object>();
			reSetParam.put("fourSStoreId", fourSStoreId);
			reSetParam.put("nextGetCusDayNum", map.get("nextGetCusDayNum"));
			Map<String,Object> assignParam = new HashMap<String,Object>();
			assignParam.put("fourSStoreId",fourSStoreId);
			assignParam.put("dayNumber", (0-map.get("dayNumber")));
			assignParam.put("status", 1);
			assignParam.put("customerLevel", "S");
			//根据每家店设置的捞取天数，查询出分配前要重置的潜客
			List<Customer> reSetList = customerService.findRenewalCustomer(reSetParam);
			 
			//对于重置潜客信息的事务是：10个潜客处理完就一个commit
			List<List<Customer>> reSetListAll = new ArrayList<List<Customer>>();
			logger.info("----------潜客导入分配潜客开始---------");
			if(reSetList.size() > 0){
				reSetListAll = SplitListUtil.splitList(reSetList,CUSTOMER_ASSIGN_SIZE);
				for (int i = 0; i < reSetListAll.size(); i++) {
					assignCustomerService.updateReSetCustomer(reSetListAll.get(i));
				}
			}
			//根据每家店设置的捞取天数，查询出将要分配的潜客
			List<Customer> assignList = customerService.findRenewalCustomer2(assignParam);
			//对于分配的事务是：10个潜客被分配完成就一个commit
			List<List<Customer>> assignListAll = new ArrayList<List<Customer>>();
			if(assignList.size() > 0){
				int assignNum = 0;
				assignListAll = SplitListUtil.splitList(assignList,CUSTOMER_ASSIGN_SIZE);
				for (int i = 0; i < assignListAll.size(); i++) {
					 assignCustomerService.systemAssignRenewalCustomer(assignListAll.get(i));
					 assignNum = assignNum + assignListAll.get(i).size();
					 logger.info("分配了"+assignNum+"个潜客！");
				}
			}
			logger.info("----------潜客导入分配潜客结束---------");
			
			//对于更新潜客脱保状态的事务是：10个潜客被分配完成就一个commit
			logger.info("-------------潜客导入更新保单日期状态开始------------");
			if(assignList.size() > 0){
				List<RenewalingCustomer> updateLostInsurList = renewalingCustomerService.findAssignCustomer(assignList);
				List<List<RenewalingCustomer>> updateLostInsurListAll = new ArrayList<List<RenewalingCustomer>>();
				if(updateLostInsurList.size() > 0){
					updateLostInsurListAll = SplitListUtil.splitList(updateLostInsurList,CUSTOMER_ASSIGN_SIZE);
					for(int i = 0; i < updateLostInsurListAll.size(); i++) {
						assignCustomerService.updateInsuranceDateStatuOnTime(updateLostInsurListAll.get(i));
					}
				}
			}
			logger.info("-------------潜客导入更新保单日期状态结束------------");
		}catch (NoUserAssignException e) {
			logger.info("没有工作人员可以分配！检查该店是否与有建用户！");
		}catch (CustomerAssignException e) {
			logger.info("分配出现异常，插入分配表的map为空！");
		}catch (Exception e) {
			logger.error("分配失败,程序异常",e);
			throw new CustomerAssignException("分配失败,程序异常");
		}
	}
	
	/**
	 * 按潜客ID查询该潜客所有的报价信息
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/findListCustomerBJRecode",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findListCustomerBJRecode(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		Integer customerId = new Integer(request.getParameter("customerId"));
		try {
		
			List<CustomerBJRecode> customerBJRecodeList = new ArrayList<CustomerBJRecode>();
			customerBJRecodeList = customerService.findListCustomerBJRecode(customerId);
			rs.addContent("customerBJRecodeList", customerBJRecodeList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询报价信息失败");
			logger.info("查询"+customerId+"报价信息失败,程序异常:",e);
			return rs;
		}
	}
	
	/** 
	 * 新增报价记录
	 * @return 
	 */
	@RequestMapping(value="/addCustomerBJRecode",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addCustomerBJRecode(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String customerBJRecode = String.valueOf(request.getParameter("customerBJRecode"));
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		String userName = String.valueOf(request.getParameter("userName"));
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		if(StringUtils.isEmpty(customerBJRecode)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("报价信息为空,新增报价失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject customerBJRecodeJsonObj = JSONObject.fromObject(customerBJRecode);
			CustomerBJRecode bean = (CustomerBJRecode)JSONObject
					.toBean(customerBJRecodeJsonObj,CustomerBJRecode.class);
			bean.setDcbjrq(new Date());
			bean.setStoreId(storeId);
			bean.setBjr(userName);
			bean.setBjrId(userId);
			//调用service新增报价记录
			customerService.insertCustomerBJRecode(bean);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("新增报价成功!");
			rs.addContent("message","新增报价成功");
			return rs; 
		} catch (Exception e) {
			logger.info("新增报价失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增报价失败!");
			rs.addContent("message","新增报价失败,程序异常");
			return rs; 
		}
	}
	/**
	 * 客户专员唤醒潜客
	 */
	@RequestMapping(value = "/activateCustomer",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse activateCustomer(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="activateReason") String activateReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			//如果查询出returnStatu是10，则说明该潜客已经唤醒过了
			if(returnStatu == ReturnStatus.BEENACTIVE){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经唤醒过，不可重复唤醒！");
				return rs;
			}
			//如果查询出returnStatu是处于待失销的状态才可以操作唤醒
			if(returnStatu == ReturnStatus.CHECKLOST){
				String operation = "唤醒";
				String dealActivateReason = DealStringUtil.dealTraceRecordReason(operation, activateReason, userName);
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				//customerService.updateWakeUpCustomer(customerId,userId,principalId,dealWakeReason,userName,storeId,lastTraceResult);
				customerService.updateActivateCustomer(customerId,userId,principalId,principal,dealActivateReason,userName,storeId,lastTraceResult);
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录不处于待失销，唤醒失败！");
				return rs;
			}
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("唤醒成功！");
			return rs; 			
		} catch (Exception e) {
			logger.info("唤醒操作失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("唤醒操作失败,程序异常!");
			return rs;
		}
	}
	/**
	 * 查询已经唤醒的潜客
	 * @param returnStatu
	 * @param userId
	 * @param showAll
	 * @param storeId
	 * @param roleId
	 * @param startTime
	 * @param endTime
	 * @param startNum
	 * @return
	 */
	@RequestMapping(value="/findActivateCustomer",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findActivateCustomer(@RequestParam(name="userId") Integer userId,
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
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将returnStatu传递到后台！");
				return rs;
			}
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			String web = (String)param.get("web");
			if(web!=null&&web.equals("app")){
				pageSize = ConstantUtil.appPageSize;
			}
			param.put("userId", userId);
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			/*if(users.size() > 0){
				list = customerService.findByReturnStatu(param);
				//查询总数
				policyCount = customerService.countFindByReturnStatu(param);
			}*/
			list = customerService.findActivateCustomer(param);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (RenewalingCustomer renewalingCustomer : list) {
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
				}
			}
			/*policyCount = customerService.countFindActivateCustomer(param);*/
			policyCount = customerService.findCountActivateCustomer(param);
			rs.addContent("policyCount", policyCount);
			rs.addContent("result", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询已经唤醒的潜客失败!");
			logger.info("查询已经唤醒的潜客",e);
			return rs;
		}
	}
	
	/**
	 * 指定负责人
	 * @param customerId 潜客id
	 * @param principalId 更换后负责人id
	 * @param principal 更换后负责人
	 * @param userId 更换前负责人id
	 * @param superiorId 更换前负责人上级id,即更换接收人的操作者
	 */
	@RequestMapping(value = "/assignPrincipal",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse assignPrincipal(@RequestParam(name="customerId") Integer customerId, 
			@RequestParam(name="principalId")Integer principalId,//要更换的负责人id
			@RequestParam(name="principal")String principal,
			@RequestParam(name="prePrincipalId")Integer prePrincipalId,
			@RequestParam(name="userId")Integer userId,
			@RequestParam(name="superiorId")Integer superiorId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId")Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//校验该负责人是否已经在跟踪该潜客
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,principalId);
			if(customerAssign != null){
				Integer traceStatu = customerAssign.getTraceStatu();
				if(traceStatu != 3){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该负责人已经负责该潜客，不能重复指定！");
					return rs;
				}
			}
			String operation = "指定负责人";
			String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
			customerService.updateAssignPrincipal(customerId, principalId,principal,prePrincipalId,dealReturnReason,userName,lastTraceResult,userId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 			
		} catch (Exception e) {
			logger.info("指定负责人失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("指定负责人失败,程序异常");
			return rs;
		}
		
	}
	
	/** 客服专员潜客睡眠
	 * @return 
	 */
	@RequestMapping(value="/saveCustomerSleep",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveCustomerSleep(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="sleepReason") String sleepReason){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			if(customerAssign.getReturnStatu() !=null && customerAssign.getReturnStatu() ==9){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("潜客睡眠失败,该潜客已被睡眠");
				return rs; 
			}
			if(customerAssign.getReturnStatu() !=null && customerAssign.getReturnStatu() !=4 && customerAssign.getReturnStatu() !=5){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("潜客睡眠失败,客户专员只能睡眠待失销和已失销的潜客");
				return rs; 
			}
			customerService.saveCustomerSleep(customerId,userId,userName,principalId,principal,sleepReason);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.info("客服专员潜客睡眠失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("潜客睡眠失败,程序异常");
			return rs; 
		}
	}
	
	/** 续保主管潜客睡眠
	 * @return 
	 */
	@RequestMapping(value="/saveCustomerSleepByRD",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveCustomerSleepByRD(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="sleepReason") String sleepReason){
		BaseResponse rs = new BaseResponse();
		try {
			Customer customer = customerService.findCustomer(customerId);
			if("S".equals(customer.getCustomerLevel())){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("潜客睡眠失败,该潜客已被睡眠");
				return rs; 
			}else if(!"F".equals(customer.getCustomerLevel())){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("潜客睡眠失败,续保主管只能睡眠已失销的潜客");
				return rs; 
			}
			
			customerService.saveCustomerSleepByRD(customerId,userId,userName,principalId,principal,sleepReason);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.info("续保主管潜客睡眠失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("潜客睡眠失败,程序异常");
			return rs; 
		}
	}
	
	
	/**
	 * 销售战败潜客导入
	 * @return 
	 */
	@RequestMapping(value="/importDefeat",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importDefeat(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer fourSStoreId = Integer.valueOf(request.getParameter("fourSStoreId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(fourSStoreId);
			if(store.getCsModuleFlag()!=null && store.getCsModuleFlag()==1){
				//如果开启了客服模块,校验是否存在客服人员可以分配
				boolean flag = userService.findExistUserByRole(fourSStoreId, 5);
				if(flag == false){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("导入失败,没有客服专员可分配,请确保客服专员存在或者状态正常");
					return rs;
				}
			} else {
				//否则关闭了客服模块,校验是否存在续保专员可以分配
				boolean flag = userService.findExistUserByRole(fourSStoreId, 2);
				if(flag == false){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("导入失败,没有续保专员可分配,请确保续保专员存在或者状态正常");
					return rs;
				}
			} 
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			ObjectMapper mapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			List<Map<String,Object>> dataList = mapper.readValue(data, List.class);
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();
				if(map.get("contactWay") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "潜客电话不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("contactWay") != null){
					if(map.get("contactWay").toString().length() > 15){
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "潜客电话长度过长");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			List<Map<String,Object>> customerList = mapper.readValue(jsonStr,new TypeReference<List<Map<String,Object>>>() { });
			logger.info(customerList);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			for (int i = 0; i < customerList.size(); i++) {
				Map<String, Object> customer = customerList.get(i);
				tempList.add(customer);
				if ((i + 1) % CUSTOMER_IMPORT_SIZE == 0 || i == customerList.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					errorRows = customerService.saveDefeatCustomer(tempList);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功导入" + (i+1) +"条战败线索数据");
				}
			}
			
			Integer csModuleFlag = store.getCsModuleFlag();
			Integer roleId = 0;
			if(csModuleFlag==0){
				roleId = 2;
			}else{
				roleId = 5;
			}
			while (true) {
				try{
					Map<String, Object> paramMap = new HashMap<>();
					Integer storeId = null;
					if(store.getBangStatu()!=null&&store.getBangStatu()==1){
						storeId = store.getBspStoreId();
						paramMap.put("bsp_storeId", storeId);
					} else {
						storeId = fourSStoreId;
						paramMap.put("bip_storeId", storeId);
					}
					paramMap.put("roleId", roleId);
					List<Map<String,Object>> list = customerService.findNeedMaintenance(paramMap);
					if(list.size() <= 0){
						break;
					} else {
						for(int k=0; k<list.size(); k++){
							Map<String, Object> map = list.get(k);
							String contactWay = map.get("contactWay")==null ? "" : map.get("contactWay").toString();
							
							if(!"".equals(contactWay)){
								customerService.saveDefeatCustomerRelate(storeId,store.getBangStatu(),contactWay,fourSStoreId,roleId);
							}
						}
					}
				}catch(Exception e){
					logger.error("分配线索时出现异常: ", e);
					break;
				}
			}
		}catch(Exception e){
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("导入战败线索失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(fourSStoreId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		if(errorMessage.size()>0){
			rs.addContent("errorMessage", errorMessage);
			rs.setMessage("导入完成,有部分战败线索导入失败.");
		}else{
			rs.setMessage("导入成功.");
		}
		return rs;
	}
	
	/**
	 * 查询bsp战败从而转到bip的潜客
	 * @return 
	 */
	@RequestMapping(value="/findDefeatCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDefeatCustomer(@RequestParam(name="showAll") boolean showAll,
			@RequestParam(name="shortZbqk") Integer shortZbqk,
			@RequestParam(name="shortmain") Integer shortmain,
			@RequestParam(name="bspStoreId") Integer bspStoreId,
			@RequestParam(name="startTime") String startTime, 
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="sxyy") String sxyy,
			@RequestParam(name="bangStatu") Integer bangStatu,
			@RequestParam(name="bipStoreId") Integer bipStoreId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", ConstantUtil.pageSize);
			if(bangStatu == 1){
				param.put("bsp_storeId",bspStoreId);
			}else{
				param.put("bip_storeId",bipStoreId);
			}
			
			if(roleId==2||roleId==5){
				param.put("userId", userId);
			}
			if(roleId==4){
				param.put("roleId", 5);
			}
			
			param.put("sxyy", sxyy);
			param.put("shortZbqk", shortZbqk);
			param.put("shortmain", shortmain);
			if(showAll == true){
				param.put("startTime", null);
				param.put("endTime", null);
			}else{
				param.put("startTime", startTime);
				param.put("endTime", endTime);
			}
			List<Map<String, Object>> list = null;
			int policyCount = 0;
			
			list = customerService.findDefeatCustomer(param);
			//查询总数
			policyCount = customerService.countFindDefeatCustomer(param);

			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败,程序异常");
			logger.info(" 查询bsp战败从而转到bip的潜客失败", e);
			return rs;
		}
		
	}
	
	/**
	 * 战败潜客
	 * @return 
	 */
	@RequestMapping(value="/saveDefeatCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveDefeatCustomer(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="contactWay") String contactWay){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("contactWay", contactWay);
			param.put("defeated", 1);
			
			customerService.saveDefeatCustomer(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("战败失败,程序异常");
			logger.info("战败失败,程序异常", e);
			return rs;
		}
	}
	
	/**
	 * 续保主管主动回退处理
	 * param holderId 持有人id
	 */
	@RequestMapping(value = "/activeReturn",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse activeReturn(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="activeReturnReason") String activeReturnReason,
			@RequestParam(name="userName") String userName){
		BaseResponse rs = new BaseResponse();
		
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,principalId);
			if(customerAssign != null){
				Integer returnStatu = customerAssign.getReturnStatu();
				Integer traceStatu = customerAssign.getTraceStatu();
				if(traceStatu != null && traceStatu == 3){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经跟踪完成了！");
					return rs;
				}else{
					if(returnStatu != null && returnStatu == 2){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("该记录已经回退过！");
						return rs;
					}else{
						String operation = "主动回退";
						String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, activeReturnReason, userName);
						//String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
						//自动回退 = （同意回退接口 + 插入通知接口）
						//获取车架号拼装消息内容
						Customer customer = customerService.findCustomer(customerId);
						String chassisNumber = "";
						if(!ObjectUtils.isEmpty(customer)){
							chassisNumber = customer.getChassisNumber();
						}
						String content = userName + "主动回退,潜客车架号为" + chassisNumber + "。";
						customerService.updateActiveReturn(customerId, userId,principalId,principal,dealReturnReason,userName,storeId,dealReturnReason,content,chassisNumber);
					}
				}
			}else {
				logger.info("主动回退失败,非续保专员跟踪，不能执行此操作");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("主动回退失败,非续保专员跟踪，不能执行此操作");
				return rs;
			}
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("message", "主动回退！");
			return rs; 
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs;
		}catch (Exception e) {
			logger.info("主动回退失败,程序异常:" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("主动回退失败！");
			return rs;
		}
	}
	
	
	/**
	 * 批量睡眠潜客
	 * @return 
	 */
	@RequestMapping(value="/sleepBatch",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse sleepBatch(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer fourSStoreId = Integer.valueOf(request.getParameter("fourSStoreId"));
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(fourSStoreId);
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> customerList = mapper.readValue(data,new TypeReference<List<Map<String,Object>>>() { });
			logger.info(customerList);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			int i = 0;
			for (i = 0; i < customerList.size(); i++) {
				Map<String, Object> customer = customerList.get(i);
				tempList.add(customer);
				if ((i + 1) % CUSTOMER_IMPORT_SIZE == 0 || i == customerList.size() - 1) {
					System.out.println(tempList+"-====-===-====-=====");
					List<Map<String, Object>> errorRows = new ArrayList<>();
					//errorRow = i / CUSTOMER_IMPORT_SIZE * CUSTOMER_IMPORT_SIZE;
					errorRows = customerService.saveSleepBatch(tempList,userId);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功睡眠" + (i) +"条潜客数据");
				}
			}
			if(errorMessage.size()>0){
				rs.addContent("errorMessage", errorMessage);
				rs.setMessage("睡眠完成,有部分潜客睡眠失败.");
			}else{
				rs.setMessage("成功睡眠" + (i) +"条潜客数据");
			}
		}catch(Exception e){
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量睡眠失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(fourSStoreId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs;
	}
	
	/**
	 * 批量睡眠潜客(没有客服模块的店，通过多选来操作)
	 * @return 
	 */
	@RequestMapping(value="/sleepBatchXBZG",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse sleepBatchXBZG(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		Integer fourSStoreId = Integer.valueOf(request.getParameter("fourSStoreId"));
		String condition = request.getParameter("condition");
		
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(fourSStoreId);
		} catch (Exception e) {
			logger.error("请求店状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("请求失败,程序异常");
			return rs;
		}
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> customerList = mapper.readValue(condition,new TypeReference<List<Map<String,Object>>>() { });
			logger.info(customerList);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			for (int i = 0; i < customerList.size(); i++) {
				Map<String, Object> customer = customerList.get(i);
				customer.put("fourSStoreId", fourSStoreId);
				tempList.add(customer);
				if ((i + 1) % CUSTOMER_IMPORT_SIZE == 0 || i == customerList.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					errorRows = customerService.saveSleepBatch(tempList,userId);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功睡眠" + (i+1) +"条潜客数据");
				}
			}
		}catch(Exception e){
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量睡眠失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(fourSStoreId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("更改店状态失败:", e);
			}
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs;
	}
	
	/**
	 * 手动请求壁虎刷新潜客信息,修改
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/manual",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse manual(HttpServletRequest request,HttpServletResponse response){
		String searchDatas = request.getParameter("condition");
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> map =null;
		try {
			map = objectMapper.readValue(searchDatas, Map.class);
			Integer fourSStoreId = (Integer)map.get("fourSStoreId");
			Integer userId = (Integer)map.get("userId");
			Integer customerId = (Integer)map.get("customerId");
			String carLicenseNumber = (String)map.get("carLicenseNumber");
			String chassisNumber = (String)map.get("chassisNumber");
			String engineNumber = (String)map.get("engineNumber");
			Integer flag = (Integer)map.get("flag");
			String certificateNumber = (String)map.get("certificateNumber");
			
			Customer customer = new Customer();
			customer.setFourSStoreId(fourSStoreId);
			customer.setCustomerId(customerId);
			customer.setCarLicenseNumber(carLicenseNumber);
			customer.setChassisNumber(chassisNumber);
			customer.setEngineNumber(engineNumber);
			customer.setCertificateNumber(certificateNumber);
			if(flag!=null&&flag==1){
				return disBiHu(customer,userId);
			}else{
				return disBofide(customer,userId);
			}
		} catch (Exception e) {
			BaseResponse rs = new BaseResponse();
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手动查询信息失败");
			logger.info("手动查询信息失败,程序异常", e);
			return rs;
		}
	}
	
	/**
	 * 手动请求壁虎刷新潜客信息,新增
	 * @return 
	 */
	@RequestMapping(value="/newCover",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse bhCover(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="carLicenseNumber") String carLicenseNumber,
			@RequestParam(name="chassisNumber") String chassisNumber,
			@RequestParam(name="engineNumber") String engineNumber,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="flag") Integer flag,
			@RequestParam(name="certificateNumber") String certificateNumber){
		BaseResponse rs = new BaseResponse();
		try {
			if(storeId!=null){
				Customer customer = new Customer();
				customer.setFourSStoreId(storeId);
				customer.setCarLicenseNumber(carLicenseNumber);
				customer.setChassisNumber(chassisNumber);
				customer.setEngineNumber(engineNumber);
				customer.setCertificateNumber(certificateNumber);
				if(flag!=null&&flag==1){
					return disBiHu(customer,userId);
				}else{
					return disBofide(customer,userId);
				}
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("店ID为空，取值失败！");
			}
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手动查询信息失败");
			logger.info("手动查询信息失败,程序异常", e);
			return rs;
		}
	}
	
	/**
	 * 获取壁虎续险信息
	 * @param customer
	 * @param userId
	 * @return
	 */
	public BaseResponse disBiHu(Customer customer,Integer userId){
		BaseResponse rs = new BaseResponse();
		try{
			List<String> list = updateCustomerFromBHService.requestBH(customer,userId,false);
			String json = list.get(0);
			if(!StringUtils.isEmpty(json)){
				List<InsuranceComp> insuranceComps = insuranceCompMapper.selectAll();
				Map<String,Object> map1 = updateCustomerFromBHService.disposeJson(json, customer,insuranceComps);
				if(!map1.isEmpty()){
					rs.addContent("map", map1);
					rs.setSuccess(true);
					rs.addContent("status", "OK");
				}else{
					JSONObject jsonObject = JSONObject.fromObject(json);
					String statusMessage = jsonObject.getString("StatusMessage");
					if(StringUtils.isEmpty(statusMessage)){
						statusMessage = "获取续险信息失败！";
					}
					//用本店的agent没有查询到续险信息，用66650再查询一次
					List<String> list1 = updateCustomerFromBHService.requestBH(customer,userId,true);
					String json1 = list1.get(0);
					if(!StringUtils.isEmpty(json1)){
						Map<String,Object> map2 = updateCustomerFromBHService.disposeJson(json1, customer,insuranceComps);
						if(!map2.isEmpty()){
							rs.addContent("map", map2);
							rs.setSuccess(true);
							rs.addContent("status", "OK");
							return rs;
						}
					}
					rs.setMessage(statusMessage);
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
				}
			}else{
				rs.setMessage("获取续险信息失败，请确认车牌号正确或者车架号和发动机号正确！");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
			}
		}catch(Exception e){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手动查询信息失败");
			logger.info("手动查询信息失败,程序异常", e);
			return rs;
		}
		return rs;
	}
	
	/**
	 * 查询邀约记录
	 * @return 
	 */
	@RequestMapping(value="/findInviteRecord",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInviteRecord(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer inviteStatu = (Integer)param.get("inviteStatu");
			if(inviteStatu == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据跟踪状态查询失败!");
				logger.info("按跟踪状态条件查询潜客,原因可能是roleId为："+roleId+"的用户角色没有将inviteStatu传递到后台！");
				return rs;
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			if(roleId!=2){
				param.put("userId", userId);
			}else{
				param.put("operatorID", userId);//续保专员想要看到自己的邀约记录，只要是邀约过的就显示出来，成OFS级客户后，不可再操作
			}
			param.put("roleId", roleId);
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
			List<Map<String, Object>> list = customerService.findInviteRecord(param);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (Map<String, Object> map : list) {
					   for (Map.Entry<String, Object> m : map.entrySet()) {
			                if(m.getKey().equals("contactWay")){
			                	String value = (String) m.getValue();
			                	String turnTelF = StringUtil.turnTelF(value);
			                	m.setValue(turnTelF);
			                }
			            }
				    }
			}
			    
			//查询总数
			int policyCount = customerService.findInviteRecordCount(param);
			rs.addContent("policyCount", policyCount);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("邀约状态查询失败!");
			logger.info("按邀约状态查询潜客失败",e);
			return rs;
		}
	}

	/**
	 * 批量更换负责人或持有人
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/updateChangePrincipalBatch",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateChangePrincipalBatch(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		String userName = request.getParameter("userName");
		String changePrincipalFlag = request.getParameter("changePrincipalFlag");
		
		try {
			//json字符串转成List
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> infoList = mapper.readValue(data, List.class);
			//调用service批量处理
			customerService.updateChangePrincipalBatch(infoList,storeId,userId,userName,changePrincipalFlag);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("批量换人成功");
			return rs; 
		}catch (CustomerNotMatchException cnme) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量换人失败,存在非续保专员跟踪的潜客");
			logger.info("批量换人失败,存在非续保专员跟踪的潜客");
			return rs; 
		}catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量换人失败,存在跟踪完成的潜客");
			logger.info("批量换人失败,存在跟踪完成的潜客");
			return rs; 
		}catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量换人失败,程序异常");
			logger.error("批量换人失败,程序异常:", e);
			return rs; 
		}
	}

	/**
	 * 查询建档人的新增潜客
	 * @param storeId
	 * @param renewalType
	 * @param chassisNumber
	 * @param carLicenseNumber
	 * @param contact
	 * @param contactWay
	 * @param userId
	 * @param startNum
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/findCustomerByCreater",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustomerByCreater(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="renewalType") Integer renewalType,
			@RequestParam(name="chassisNumber") String chassisNumber,
			@RequestParam(name="carLicenseNumber") String carLicenseNumber,
			@RequestParam(name="contact") String contact,
			@RequestParam(name="contactWay") String contactWay,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="startDate") String startDate,
			@RequestParam(name="endDate") String endDate,
			@RequestParam(name="defeatFlag") String defeatFlag, 
			@RequestParam(name="shortJdr") Integer shortJdr,
			@RequestParam(name="shortmain") Integer shortmain)throws Exception{
		BaseResponse rs = new BaseResponse();
		Map<String,Object> param = new HashMap<String,Object>(); 
		
		//分页
		Integer start = (startNum - 1) *ConstantUtil.pageSize;
		Integer pageSize = ConstantUtil.pageSize;
		param.put("start", start);
		param.put("pageSize", pageSize);
		
		param.put("storeId", storeId);
		param.put("renewalType", renewalType);
		param.put("chassisNumber", chassisNumber);
		param.put("carLicenseNumber", carLicenseNumber);
		param.put("contact", contact);
		param.put("contactWay", contactWay);
		param.put("createrId", userId);
		param.put("startDate", startDate);
		param.put("endDate", endDate);
		param.put("defeatFlag", defeatFlag);
		param.put("shortJdr", shortJdr);
		param.put("shortmain", shortmain);
		
		List<RenewalingCustomer> list = customerService.findCustomerByCreater(param);
		
		//查询总数
		int policyCount = customerService.findCustomerByCreaterCount(param);
		rs.addContent("policyCount", policyCount);
		rs.addContent("results", list);
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs; 
	}
	
	/** 
	 * 验证车架号是否重复
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/yzChaNum", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse yzCarNum(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		// 获取级别跟踪天数设置信息
		String condition = request.getParameter("condition");
		if (StringUtils.isEmpty(condition)) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("车架号为空!");
			return rs;
		}
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String,Object> map = null;
		try {
			map = objectMapper.readValue(condition, Map.class);
			Integer storeId = (Integer)map.get("storeId");
			String chassisNumber = (String)map.get("chassisNumber");
			Customer customer = customerService.findCustomerByChassisNumber(chassisNumber,storeId);
			if(customer!=null){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("车架号重复！");
				return rs;
			}
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("车架号不重复！");
			return rs;
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("车架号验证失败,程序异常:" + e.getMessage());
			return rs;
		}
	}
	
	
	/** 
	 * 给出提示分配日期
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getMessage", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse getMessage(@RequestParam("customerId") Integer customerId,
			@RequestParam("storeId") Integer storeId) {
		BaseResponse rs = new BaseResponse();
		try {
			//获取该潜客的虚拟保险到期日和分配状态并给出提醒合适会被分配
			Customer customer = customerService.findCustomer(customerId);
			Date virtualJqxdqr = customer.getVirtualJqxdqr();
			Date jqxrqEnd = customer.getJqxrqEnd();
			//获取该店的首次提醒天数
			List<TraceDaySet> traceDaySetList = settingService.findTraceDaySet(storeId);
			Integer sctxts = 0;
			for(TraceDaySet traceDaySet : traceDaySetList){
				String level = traceDaySet.getCustomerLevel();
				if(level.equals("Z")){
					sctxts = traceDaySet.getDayNumber();
				}
			}
			//判断此时潜客将要做的失销是真失销还是假失销
			boolean trueToLost = customerService.isTrueToLost(jqxrqEnd,sctxts);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			//如果是假失销则到了虚拟保险到期日-首次提醒天数就要被分配
			if(trueToLost == false){
				//下次捞取日期是虚拟保险到期日-首次提醒日期
				Calendar virCalendar = Calendar.getInstance();
				virCalendar.setTime(virtualJqxdqr);
				virCalendar.add(Calendar.DAY_OF_MONTH, -(sctxts));
				Date nextAssignDate = virCalendar.getTime();
				String nextAssignDateStr = null;
				//如果得出的下次分配日期小于等于当前天则去当前日
				Date curDate = new Date();
				if(nextAssignDate.getTime() <= curDate.getTime()){
					nextAssignDateStr = DateUtil.toString(curDate);
					rs.setMessage("确定失销后，系统将会在"+nextAssignDateStr+"再次分配该潜客！");
				}else{
					nextAssignDateStr = DateUtil.toString(nextAssignDate);
					rs.setMessage("确定失销后，系统将会在"+nextAssignDateStr+"再次分配该潜客！");
				}
			}else{
				//下次捞取日期是虚拟保险到期日+一年-首次提醒日期
				Calendar virCalendar = Calendar.getInstance();
				virCalendar.setTime(virtualJqxdqr);
				virCalendar.add(Calendar.YEAR, 1);
				virCalendar.add(Calendar.DAY_OF_MONTH, -sctxts);
				Date nextAssignDate = virCalendar.getTime();
				String nextAssignDateStr = DateUtil.toString(nextAssignDate);
				rs.setMessage("确定失销后，系统将会在"+nextAssignDateStr+"再次分配该潜客！");
			}
			
			return rs;
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("获取提示信息失败！");
			return rs;
		}
	}
	
	/**
	 * 获取用户的壁虎保险信息
	 */
	@RequestMapping(value = "/findBxInfoForBH",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findBxInfoForBH(@RequestParam("customerId") Integer customerId){
		BaseResponse rs = new BaseResponse();
		try {
			if(customerId!=null){
				Customer customer = customerService.selectByPrimaryKey(customerId);
				if(customer!=null){
					String saveQuote = customer.getBxInfo();
					if(!StringUtils.isEmpty(saveQuote)){
						JSONObject jsonObj = JSONObject.fromObject(saveQuote);
						JsonConfig config = new JsonConfig();
				        config.setJavaIdentifierTransformer(new JavaIdentifierTransformer() {

				            @Override
				            public String transformToJavaIdentifier(String str) {
				                char[] chars = str.toCharArray();
				                chars[0] = Character.toLowerCase(chars[0]);
				                return new String(chars);
				            }

				        });
				        config.setRootClass(BxFromBHInfoVo.class);
						BxFromBHInfoVo bxInfo = (BxFromBHInfoVo)JSONObject.toBean(jsonObj,config);
						rs.setSuccess(true);
						rs.addContent("status", "OK");
						rs.addContent("results", bxInfo);
						rs.setMessage("获取保险信息成功！");
						return rs;
					}
				}
			}
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("获取保险信息失败！");
			return rs; 
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("获取保险信息失败！");
			return rs;
		}
	}
	
	/**
	 * 已激活查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByJiHuo",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByJiHuo(@RequestParam(name="userId") Integer userId,
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
					param.put("roleId", RoleType.XBZY);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					param.put("roleId", RoleType.XSGW);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					param.put("roleId", RoleType.FWGW);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					param.put("roleId", RoleType.KFZY);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			list = renewalingCustomerService.findByJiHuo(param);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (RenewalingCustomer renewalingCustomer : list) {
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
				}
			}
			//查询总数
			policyCount = renewalingCustomerService.countFindByJiHuo(param);
			rs.addContent("list", list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("已激活潜客查询失败!");
			logger.info("已激活潜客查询失败!",e);
			return rs;
		}
		
	}
	
	/**
	 * 查询到店未出单潜客
	 * @return 
	 */
	@RequestMapping(value="/findDdwcdCus",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDdwcdCus(@RequestParam(name="userId") Integer userId,
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
					param.put("roleId", RoleType.XBZY);
					param.put("holder", "");
				}
				if(holder.equals("全部销售顾问")){
					param.put("roleId", RoleType.XSGW);
					param.put("holder", "");
				}
				if(holder.equals("全部服务顾问")){
					param.put("roleId", RoleType.FWGW);
					param.put("holder", "");
				}
				if(holder.equals("全部客服专员")){
					param.put("roleId", RoleType.KFZY);
					param.put("holder", "");
				}
			}
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			
			List<RenewalingCustomer> list = null;
			int policyCount = 0;
			list = renewalingCustomerService.findDdwcdCus(param);
			//数据分析员视图下加密电话号码
			if(roleId==RoleType.SJGLY){
				for (RenewalingCustomer renewalingCustomer : list) {
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
				}
			}
			//查询总数
			policyCount = renewalingCustomerService.countDdwcdCus(param);
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
		
	/**
	 * 前台主管按不同状态查询潜客
	 * @return 
	 */
	@RequestMapping(value="/findByStatusQtzg",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByStatusQtzg(@RequestParam(name="storeId") Integer storeId,
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
			
			List<RenewalingCustomer> list = customerService.findByStatusQtzg(param);
			//查询总数
			int policyCount = customerService.findByStatusQtzgCount(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("list", list);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败!");
			logger.info("前台主管按不同状态查询潜客失败",e);
			return rs;
		}
	}
	
	/**
	 * 前台主管的潜客查询
	 * @return 
	 */
	@RequestMapping(value="/findByConditionQtzg",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByConditionQtzg(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="searchDatas") String searchDatas){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(searchDatas, Map.class);
			//分页
			Integer startNum = (Integer)param.get("startNum");
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Integer pageSize = ConstantUtil.pageSize;
			param.put("start", start);
			param.put("pageSize", pageSize);
			param.put("storeId", storeId);
			
			List<RenewalingCustomer> list = customerService.findByConditionQtzg(param);
			//查询总数
			int policyCount = customerService.findByConditionQtzgCount(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("list", list);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败!");
			logger.info("前台主管的潜客查询失败",e);
			return rs;
		}
	}
	
	/**
	 * 前台主管的潜客查询
	 * @return 
	 */
	@RequestMapping(value="/ceshi",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse ceshi(@RequestParam(name="parm") String parm){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(parm, Map.class);
			SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd");
			String date1 = (String)param.get("date1");
			String date2 = (String)param.get("date2");
			Integer num = Integer.parseInt((String)param.get("num"));
			Date dd = updateCustomerFromBHService.getDate(sdf3.parse(date1), sdf3.parse(date2), num, -1, -1);
			String aa = "null";
			if(dd!=null){
				aa = sdf3.format(dd);
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("aa", aa);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败!");
			logger.info("前台主管的潜客查询失败",e);
			return rs;
		}
	}
	
	/**
	 * 销售经理/服务经理主动回退
	 */
	@RequestMapping(value = "/returnByXSJLZD",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse returnByXSJLZD(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="returnReason") String returnReason,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal){
		BaseResponse rs = new BaseResponse();
		try {
			
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,clerkId);
			Integer returnStatu = customerAssign.getReturnStatu();
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu == 3){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("该记录已经跟踪完成了！");
				return rs;
			}else{
				if(returnStatu != null && returnStatu == 2){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该记录已经回退过了！");
					return rs;
				}else{
					String operation = "主动回退";
					String dealReturnReason = DealStringUtil.dealTraceRecordReason(operation, returnReason, userName);
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
					customerService.updateReturnBySuperior(customerId, userId, clerkId,storeId,dealReturnReason,userName,lastTraceResult,principalId,principal);
				}
			}
			
			//获取车架号拼装消息内容
			Customer customer = customerService.findCustomer(customerId);
			String chassisNumber = "";
			if(!ObjectUtils.isEmpty(customer)){
				chassisNumber = customer.getChassisNumber();
			}
			String content = userName + "主动回退,潜客车架号为" + chassisNumber + "。";
			//新增未读消息
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("userId", clerkId);
			param.put("operatorId", userId);
			param.put("operatorName",userName);
			param.put("content", content);
			param.put("customerId", customerId);
			param.put("chassisNumber", chassisNumber);
			commonService.insertMessage(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("主动回退成功！");
			return rs; 			
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs;
		}catch (Exception e) {
			logger.info("主动回退操作失败,程序异常!" , e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("主动同意回退操作失败！");
			return rs;
		}
	}
	
	/** 取消睡眠
	 * @return 
	 */
	@RequestMapping(value="/saveCancelSleep",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveCancelSleep(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="fourSStoreId") Integer fourSStoreId,
			@RequestParam(name="jqxrqEnd") String jqxrqEnd){
		BaseResponse rs = new BaseResponse();
		try {
			customerService.saveCancelSleep(customerId, userId, userName, principalId, principal, fourSStoreId,jqxrqEnd);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("取消睡眠成功");
			return rs; 
		} catch (Exception e) {
			logger.info("取消睡眠失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("潜客睡眠失败,程序异常");
			return rs; 
		}
	}

	/**
	 * 根据customerId和dcbjrq查询报价信息
	 * @param parm
	 * @return
	 */
	@RequestMapping(value="/findBJListByCustomerId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findBJListByCustomerId(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			param.put("time", DateUtil.dateJS90());
			List<CustomerBJRecode> lists = customerService.findBJListByCustomerId(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("lists", lists);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败!");
			logger.info("前台主管的潜客查询失败",e);
			return rs;
		}
	}
	
	/**
	 * 根据customerId查询潜客跟踪次数
	 * @param customerId
	 * @return
	 */
	@RequestMapping(value="/findGzCount",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findGzCount(@RequestParam(name="customerId") Integer customerId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> resMap = new HashMap<>();
			resMap.put("gzCount", 0);
			Map<String, Object> gzCountMap = new HashMap<String, Object>();
			gzCountMap.put("customers", customerId.toString());
			List<Map<String, Object>> lists = customerTraceRecodeService.findGzCount(gzCountMap);
			if(lists!=null&&lists.size()>0){
				resMap = lists.get(0);
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resMap);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败!");
			logger.info("根据customerId查询潜客跟踪次数失败",e);
			return rs;
		}
	}
	
	/** 
	 * 修改F级别的潜客时给出提示分配日期
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getMessageByUC", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse getMessageByUC(@RequestParam("storeId") Integer storeId,
			@RequestParam("jqxrqEnd") String jqxrqEndStr) {
		BaseResponse rs = new BaseResponse();
		try {
			//获取该潜客的虚拟保险到期日和分配状态并给出提醒合适会被分配
			Date jqxrqEnd = DateUtil.toDate(jqxrqEndStr);
			//获取该店的首次提醒天数
			List<TraceDaySet> traceDaySetList = settingService.findTraceDaySet(storeId);
			Integer sctxts = 0;
			for(TraceDaySet traceDaySet : traceDaySetList){
				String level = traceDaySet.getCustomerLevel();
				if(level.equals("Z")){
					sctxts = traceDaySet.getDayNumber();
				}
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			//下次捞取日期是虚拟保险到期日-首次提醒日期
			Calendar virCalendar = Calendar.getInstance();
			virCalendar.setTime(jqxrqEnd);
			virCalendar.add(Calendar.DAY_OF_MONTH, -(sctxts));
			Date nextAssignDate = virCalendar.getTime();
			String nextAssignDateStr = null;
			//如果得出的下次分配日期小于等于当前天则去当前日
			Date curDate = new Date();
			if(nextAssignDate.getTime() <= curDate.getTime()){
				nextAssignDateStr = DateUtil.toString(DateUtil.ziding(curDate, 1));
				rs.setMessage("确定修改后，系统将会在"+nextAssignDateStr+"再次分配该潜客！");
			}else{
				nextAssignDateStr = DateUtil.toString(nextAssignDate);
				rs.setMessage("确定修改后，系统将会在"+nextAssignDateStr+"再次分配该潜客！");
			}
			return rs;
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("获取提示信息失败！");
			return rs;
		}
	}
	
	/**
	 * 获取bofide续险信息
	 * @param customer
	 * @param userId
	 * @return
	 */
	public BaseResponse disBofide(Customer customer,Integer userId){
		BaseResponse rs = new BaseResponse();
		try{
			Map<String, Object> map = getCarInfoFromBofideService.requestBofide(customer,userId,false);
			if(!map.isEmpty()){
				boolean success = (boolean)map.get("success");
				if(success){
					List<InsuranceComp> insuranceComps = insuranceCompMapper.selectAll();
					Map<String,Object> map1 = getCarInfoFromBofideService.disposeMap(map, customer,insuranceComps);
					if(!map1.isEmpty()){
						rs.addContent("map", map1);
						rs.setSuccess(true);
						rs.addContent("status", "OK");
					}else{
						rs.setMessage("获取续险信息失败，请确认车牌号正确或者车架号和发动机号正确！");
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
					}
				}else{
					rs.setMessage(map.get("message").toString());
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
				}
			}else{
				rs.setMessage("获取续险信息失败，请确认车牌号正确或者车架号和发动机号正确！");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
			}
		}catch(Exception e){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手动查询信息失败");
			logger.info("手动查询信息失败,程序异常", e);
			return rs;
		}
		return rs;
	}
	
	/**
	 * 批量失销
	 * @param userId
	 * @param storeId
	 * @param superiorId
	 * @param userName
	 * @param condition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/batchLostSale",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse batchLostSale(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="superiorId") Integer superiorId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		List<Map<String, Object>> maps = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			if(condition!=null&&condition.length()>0){
				maps =  mapper.readValue(condition, List.class);
				customerService.updateBatchLostSale(maps, userId, storeId, superiorId, userName);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("批量失销成功！");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("没有选择潜客！");
			}
			return rs;
		}catch (CustomerReceivedException cre) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量失销操作失败,存在已经失销过的潜客");
			logger.error("批量失销操作失败,存在已经失销过的潜客:", cre);
			return rs; 
		}catch (CustomerTracedException cte) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量失销操作失败,存在不处于待失销状态的潜客");
			logger.error("批量失销操作失败,存在不处于待失销状态的潜客:", cte);
			return rs; 
		} catch (Exception e) {
			logger.info("批量失销操作失败,程序异常!",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("批量失销操作失败,程序异常!");
			return rs;
		}
	}
	
	/**
	 * 定时维护bf_bip_defeat_customer表数据
	 */
	@RequestMapping(value = "/maintenanceBSP")
	@ResponseBody
	public void maintenanceBSP(){
		try{
			long start = new Date().getTime();
			long chixuTime = Long.parseLong(ResourceBundle.getBundle("system").getString("chixuTime"))*1000;
			logger.info("定时分配战败线索开始！");
			List<Store> stores = storeService.findAllStore();
			if(stores!=null&&stores.size()>0){
				boolean jieshou = false;
				for(int i=0;i<stores.size();i++){
					if(jieshou){
						logger.info("定时分配战败线索已到指定持续时间！");
						break;
					}
					Integer bangStatu = stores.get(i).getBangStatu();
					Integer bipStoreId = stores.get(i).getStoreId();
					Integer bspStoreId = stores.get(i).getBspStoreId();
					logger.info("店ID为"+bipStoreId+"的定时分配战败线索开始！");
					Map<String,Object> param = new HashMap<String,Object>();
					if(bangStatu==0){
						param.put("bip_storeId", bipStoreId);
					}else{
						param.put("bsp_storeId", bspStoreId);
					}
					
					Integer csModuleFlag = stores.get(i).getCsModuleFlag();
					Integer roleId = 0;
					if(csModuleFlag==0){
						roleId = 2;
					}else{
						roleId = 5;
					}
					param.put("roleId", roleId);
					List<User> listMap = userService.findUsersByStoreIdAndRoleId(bipStoreId,roleId);
					if(listMap==null||listMap.size()==0){
						logger.info("店ID为"+bipStoreId+"的定时分配战败线索没有可分配人，跳过这个店！");
						continue;
					}
					boolean boo = false;
					while(true){
						try{
							long now = new Date().getTime();
							if((now-start)>chixuTime){
								jieshou = true;
								break;
							}
							List<Map<String,Object>> maps = customerService.findNeedMaintenance(param);
							if(maps!=null&&maps.size()>0){
								for(int j=0;j<maps.size();j++){
									String contactWay = (String)maps.get(j).get("contactWay");
									if(StringUtils.isEmpty(contactWay)){
										continue;
									}else{
										if(bangStatu==0){
											if(!customerService.saveDefeatCustomerRelate(bipStoreId, bangStatu, contactWay, bipStoreId,roleId)){
												boo = true;
												break;
											}
										}else{
											if(!customerService.saveDefeatCustomerRelate(bspStoreId, bangStatu, contactWay, bipStoreId,roleId)){
												boo = true;
												break;
											}
										}
									}
								}
								if(boo){
									logger.info("店ID为"+bipStoreId+"的定时分配战败线索没有可分配人！");
									break;
								}
							}else{
								break;
							}
						}catch(Exception e){
							logger.info("id为"+stores.get(i)+"的店分配战败线索出错！",e);
							break;
						}
					}
					logger.info("店ID为"+bipStoreId+"的定时分配战败线索结束！");
				}
			}
			logger.info("定时分配战败线索结束！");
		}catch(Exception e){
			logger.info("定时维护bf_bip_defeat_customer表出错！",e);
		}
	}
	
	/**
	 * 根据线索id查询线索
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/findDefeatedSourceById",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findDefeatedSourceById(@RequestParam(name="id") Integer id){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("id", id);
		
			Map<String,Object> resultMap = customerService.findDefeatedSourceById(param);
				
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", resultMap);
			return rs;
		} catch (Exception e) {
			logger.info("查询线索详情失败,程序异常!",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询线索详情失败");
			return rs;
		}
	}
	
	/**
	 * 续保主管主动失销
	 */
	@RequestMapping(value = "/lostByXbzg",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse lostByXbzg(@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="sxyy") String sxyy,
			@RequestParam(name="sxyyxz") String sxyyxz,
			@RequestParam(name="userName") String userName){
		BaseResponse rs = new BaseResponse();
		try {
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,principalId);
			if(customerAssign != null){
				Integer returnStatu = customerAssign.getReturnStatu();
				if(returnStatu != null && returnStatu == 5){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该潜客已经失销了");
					return rs;
				}
			}
			String operation = "失销";
			String dealLostReason = DealStringUtil.dealTraceRecordReason(operation, sxyy, userName);
			
			customerService.updateRSByLostSaleXBZG(customerId, userId, storeId, dealLostReason,
					userName, principalId, principal, dealLostReason, sxyyxz);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("message", "失销成功！");
			return rs; 
		}catch (Exception e) {
			logger.info("主管主动失销失败,程序异常:" ,e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("失销失败！");
			return rs;
		}
	}
	
	/**
	 * 续保专员撤销回退，失销，睡眠
	 * @param customerId
	 * @param userId
	 * @param userName
	 * @param storeId
	 * @param principalId
	 * @param principal
	 * @param applyStatu
	 * @return
	 */
	@RequestMapping(value = "/cancelReturn",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse cancelReturn(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer customerId = (Integer)param.get("customerId");
			Integer principalId = (Integer)param.get("principalId");
			String principal = (String)param.get("principal");
			Integer applyStatu = (Integer)param.get("applyStatu");
			CustomerAssign customerAssign = customerService.findLastStatu(customerId,userId);
			Integer returnStatu = customerAssign.getReturnStatu();
			if(returnStatu != null && returnStatu == 3){
				String operation = "";
				if(applyStatu==null){
					operation = "撤销回退";
				}else if(applyStatu==1){
					operation = "撤销失销";
				}else if(applyStatu==2){
					operation = "撤销睡眠";
				}
				String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, userName);
				customerService.cancelUpdateReturnStatu(customerId,userId,lastTraceResult,lastTraceResult,principalId,principal);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage(operation+"成功！");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				if(applyStatu==null){
					rs.setMessage("该潜客已不处于待回退状态！");
				}else if(applyStatu==1){
					rs.setMessage("该潜客已不处于待失销状态！");
				}else if(applyStatu==2){
					rs.setMessage("该潜客已不处于待睡眠状态！");
				}
			}
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("操作失败！");
			logger.info("跟踪处理同意回退",e);
			return rs;
		}
	}
	/**
	 * 根据主键潜客ID查询记录,查询潜客信息
	 * @return 
	 */
	@SuppressWarnings("deprecation")
	@RequestMapping(value="/findApprovalBillRecordList",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findApprovalBillRecordList(
			@RequestParam(name="chassisNumber") String chassisNumber,
			@RequestParam(name="fourSStoreId") Integer fourSStoreId){
		BaseResponse rs = new BaseResponse();
		try {
			List<ApprovalBill> approvalList = new ArrayList<>();
			//查询该潜客审批单记录(无保单)
			List<ApprovalBill> approvalList_NoInsurance = approvalBillService.
					findApprovalRecordList_NoInsurance(chassisNumber, fourSStoreId);
			//查询该潜客审批单记录(有保单)
			List<ApprovalBill> approvalList_Insurance = approvalBillService.
					findApprovalRecordList_Insurance(chassisNumber, fourSStoreId);
			approvalList.addAll(approvalList_NoInsurance);
			approvalList.addAll(approvalList_Insurance);
//			for(int  i  =   0 ; i  <  approvalList.size()- 1 ; i ++){
//				for  ( int  j  =  approvalList.size()  -   1 ; j  >  i; j -- )  { 
//					   int jString = approvalList.get(j).getInsurDate().getYear();
//			    	   int iString = approvalList.get(i).getInsurDate().getYear();
//			           if  (jString == iString)  {       
//			        	   approvalList.remove(i);       
//			        }        
//				}
//			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", approvalList);
			return rs; 
		} catch (Exception e) {
			logger.info("审批单查询错误-->",e);
			rs.setSuccess(false);
			return rs;
		}
	}
}
