package com.bofide.bip.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.User;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.CustomerTraceRecodeService;
import com.bofide.bip.service.InsuranceService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.StatisticService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/mobile")
public class MobileController extends BaseResponse {
	private static Logger logger = Logger.getLogger(MobileController.class);
	
	@Autowired
	private StatisticService statisticService;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private UserService userService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private InsuranceService insuranceService;
	@Autowired
	private CustomerTraceRecodeService customerTraceRecodeService;
	
	/**
	 * 查询待(回退(含失销,睡眠)/延期)员工列表
	 * param: storeId,returnStatu
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findDHTWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDHTWorkCollection(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		String message = null;
		try {
			//将params转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer storeId = (Integer)param.get("storeId");
			Integer returnStatu = Integer.valueOf((String)param.get("returnStatu"));
			String applyStatu = param.get("applyStatu")==null ? "" : param.get("applyStatu").toString();
			Integer roleId = (Integer)param.get("roleId");
			if(returnStatu != null){
				if(returnStatu == 3){
					message = "查询待回退员工列表失败";
					if(!"".equals(applyStatu)){
						if("1".equals(applyStatu)){
							message = "查询待失销员工列表失败";
						}else if("2".equals(applyStatu)){
							message = "查询待睡眠员工列表失败";
						}
					}
				}else if(returnStatu == 7){
					message = "查询待延期员工列表失败";
				}
			}
			if(storeId == null || storeId == 0){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			List<Map<String,Object>> list = new ArrayList<>();
			if(roleId!=null&&roleId==RoleType.XSJL){
				param.put("roleId", RoleType.XSGW);
				list = statisticService.countAllWorkNumByStatus(param);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
				list = statisticService.countAllWorkNumByStatus(param);
			}else{
				Store store = storeService.findStoreById(storeId);
				if(returnStatu != null){
					if(returnStatu == 3 && "".equals(applyStatu)){
						if(store.getCsModuleFlag()!=null && store.getCsModuleFlag()==1){
							//如果开启了客服,查询所有续保专员,服务顾问,销售顾问的待回退审批
							param.put("roleId", null);
							list = statisticService.countAllWorkNumByStatus(param);
						}else{
							//如果关闭了客服,查询销售顾问,服务顾问的回退待审批
							//销售顾问的回退待审批
							param.put("roleId", RoleType.XSGW);
							List<Map<String,Object>> xsgwList = statisticService.countAllWorkNumByStatus(param);
							//服务顾问的回退待审批
							param.put("roleId", RoleType.FWGW);
							List<Map<String,Object>> fwgwList = statisticService.countAllWorkNumByStatus(param);
							//合并销售顾问,服务顾问两个角色的回退待审批
							list.addAll(xsgwList);
							list.addAll(fwgwList);
						}
					}else if(returnStatu == 3 && !"".equals(applyStatu)){
						param.put("roleId", null);
						list = statisticService.countAllWorkNumByStatus(param);
					}else if(returnStatu == 7){
						param.put("roleId", null);
						list = statisticService.countAllWorkNumByStatus(param);
					}
				}
			}
			
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}	
		
	/**
	 * 查询(回退(含失销,睡眠)/延期)待审批对应员工的潜客列表
	 * param: userId,returnStatu,currentPage
	 */
	@RequestMapping(value="/findReturnApprovalCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findReturnApprovalCustomer(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		String message = null;
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			Integer returnStatu = Integer.valueOf((String)param.get("returnStatu"));
			String applyStatu = param.get("applyStatu")==null ? "" : param.get("applyStatu").toString();
			if(returnStatu != null){
				if(returnStatu == 3){
					message = "查询待回退潜客列表失败";
					if(!"".equals(applyStatu)){
						if("1".equals(applyStatu)){
							message = "查询待失销潜客列表失败";
						}else if("2".equals(applyStatu)){
							message = "查询待睡眠潜客列表失败";
						}
					}
				}else if(returnStatu == 7){
					message = "查询待延期潜客列表失败";
				}
			}
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = customerService.findByStatuAndUserId(param);
			Integer customerCount = customerService.findCountByStatuAndUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询潜客跟踪记录
	 * param: customerId
	 */
	@RequestMapping(value="/findTraceRecordByCustomerId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTraceRecordByCustomerId(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			List<CustomerTraceRecode> result = customerService.findTraceRecordByCustomerId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info("查询潜客跟踪记录失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("查询潜客跟踪记录");
			return rs;
		}
	}
	
	/**
	 * 查询未接受员工列表
	 */
	@RequestMapping(value="/findWJSWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findWJSWorkCollection(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		String message = "查询未接受员工列表失败";
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("acceptStatu", 1);
			if(roleId!=null&&roleId==RoleType.XSJL){
				param.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}
			List<Map<String,Object>> list = statisticService.countAllWorkNumByStatus(param);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	
	/**
	 * 查询今日邀约员工列表
	 * JRYY:今日邀约
	 */
	@RequestMapping(value="/findJRYYWorkerCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findJRYYWorkerCollection(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		String message = "查询今日邀约员工列表失败";
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			
			List<Map<String,Object>> list = statisticService.countJRYYWorkerCollection(param);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询未接受对应员工的潜客列表
	 * param: userId,currentPage
	 */
	@RequestMapping(value="/findWJSCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findWJSCustomer(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		String message = "查询未接受潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			param.put("acceptStatu", 1);
			List<Map<String, Object>> result = customerService.findByStatuAndUserId(param);
			Integer customerCount = customerService.findCountByStatuAndUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询应跟踪员工列表
	 */
	@RequestMapping(value="/findYGZWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findYGZWorkCollection(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="traceStatu") Integer traceStatu){
		BaseResponse rs = new BaseResponse();
		String message = "查询应跟踪员工列表失败";
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("traceStatu", traceStatu);
			if(traceStatu!=null&&traceStatu==2){
				SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
				param.put("nowDate", sdfDay.format(new Date()));
			}
			if(roleId!=null&&roleId==RoleType.XSJL){
				param.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}
			List<Map<String,Object>> list = statisticService.countAllWorkNumByStatus(param);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询应跟踪对应员工的潜客列表
	 * param: userId,currentPage
	 */
	@RequestMapping(value="/findYGZCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findYGZCustomer(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		String message = "查询应跟踪潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			
			List<Map<String, Object>> result = getGzCount(customerService.findByStatuAndUserId(param));
			Integer customerCount = customerService.findCountByStatuAndUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询今日邀约潜客列表
	 * JRYY:今日邀约
	 * params : userId ;currentPage
	 */
	@RequestMapping(value="/findJRYYCustomerCollectionByUserId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findJRYYCustomerCollectionByUserId(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		String message = "查询今日邀约潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = renewalingCustomerService.findJRYYCustomerListByUserId(param);
			Integer customerCount = renewalingCustomerService.findJRYYCustomerListCountByUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询到店未出单员工列表
	 */
	@RequestMapping(value="/findDDWCDWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDDWCDWorkCollection(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		String message = "查询应跟踪员工列表失败";
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("storeId", storeId);
			param.put("traceStatu", 1);
			if(roleId!=null&&roleId==RoleType.XSJL){
				param.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}
			Map<String,Object> listMap = statisticService.findDDWCDWorkCollection(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", listMap);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	/**
	 * 查询将脱保(或已脱保)员工列表
	 * param: storeId,
	 *        cusLostInsurStatu 潜客脱保状态
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findTBWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTBWorkCollection(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		String message = null;
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer storeId = (Integer)param.get("storeId");
			Integer cusLostInsurStatu = Integer.valueOf((String)param.get("cusLostInsurStatu"));
			Integer roleId = (Integer)param.get("roleId");
			if(cusLostInsurStatu != null){
				if(cusLostInsurStatu == 1){
					message = "查询将脱保员工列表失败";
				}else if(cusLostInsurStatu == 2){
					message = "查询已脱保员工列表失败";
				}
			}
			param.put("storeId", storeId);
			param.put("cusLostInsurStatu", cusLostInsurStatu);
			if(roleId!=null&&roleId==RoleType.XSJL){
				param.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}else{
				param.put("roleId", null);
			}
			List<Map<String,Object>> list = statisticService.countAllWorkNumByStatus(param);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询到店未出单潜客列表
	 */
	@RequestMapping(value="/findDDWCDCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDDWCDCustomer(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		String message = "查询到店未出单潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) *ConstantUtil.appPageSize;
			Integer pageSize = ConstantUtil.appPageSize;
			param.put("userId", userId);
			param.put("start", start);
			param.put("pageSize", pageSize);
			List<Map<String,Object>> result = getGzCount(statisticService.findDDWCDCustomer(param));
			Integer customerCount = statisticService.findDDWCDCustomerCount(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	/**
	 * 查询将脱保(或已脱保)对应员工的潜客列表
	 * param: userId 用户id
	 *        cusLostInsurStatu 潜客脱保状态
	 *        currentPage 当前页数
	 */
	@RequestMapping(value="/findTBCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTBCustomer(@RequestParam(name="params") String params,
			@RequestParam(name="roleId") Integer roleId) {
		BaseResponse rs = new BaseResponse();
		String message = null;
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			Integer cusLostInsurStatu = (Integer)param.get("cusLostInsurStatu");
			if(cusLostInsurStatu != null){
				if(cusLostInsurStatu == 1){
					message = "查询将脱保潜客列表失败";
				}else if(cusLostInsurStatu == 2){
					message = "查询已脱保潜客列表失败";
				}
			}
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			if(roleId != null && (roleId == 2 || roleId == 6 || roleId == 8)){
				//如果是续保专员,销售顾问,服务顾问,查询将脱保和已脱保需要把未接收的过滤掉
				param.put("acceptStatu", 2);
			}
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = customerService.findByStatuAndUserId(param);
			if(cusLostInsurStatu != null && cusLostInsurStatu == 1){
				//将脱保需要查询已经跟踪过几次
				result = getGzCount(result);
			}
			Integer customerCount = customerService.findCountByStatuAndUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 根据4s店id查询所有用户
	 * @return 
	 */
	@RequestMapping(value="/findUsersByStoreId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUsersByStoreId(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
			//查询用户
			if(storeId!=null){
				List<User> users = new ArrayList<User>();
				//所有续保专员
				List<User> user1 = null;
				//所有客服专员
				List<User> user2 = null;
				//所有销售顾问
				List<User> user3 = null;
				//所有服务顾问
				List<User> user4 = null;
				if(roleId==3||roleId==10||roleId==11||roleId==16||roleId==22||roleId==23){
					user1 = userService.selectByStoreIdAndRoleId(storeId,2);
					user2 = userService.selectByStoreIdAndRoleId(storeId,5);
					user3 = userService.selectByStoreIdAndRoleId(storeId,6);
					user4 = userService.selectByStoreIdAndRoleId(storeId,8);
					if(user1!=null&&user1.size()>0){
						users.addAll(user1);
					}
					if(user3!=null&&user3.size()>0){
						users.addAll(user3);
					}
					if(user4!=null&&user4.size()>0){
						users.addAll(user4);
					}
					if(user2!=null&&user2.size()>0){
						users.addAll(user2);
					}
				}else if(roleId==7){
					user3 = userService.selectByStoreIdAndRoleId(storeId,6);
					if(user3!=null&&user3.size()>0){
						users.addAll(user3);
					}
				}else if(roleId==9){
					user4 = userService.selectByStoreIdAndRoleId(storeId,8);
					if(user4!=null&&user4.size()>0){
						users.addAll(user4);
					}
				}
				
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("result", users);	
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("根据店id查询用户失败！");	
			}
			return rs;
		} catch (Exception e) {
			logger.error("根据店id查询用户失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据店id查询用户失败,程序异常");
			return rs; 
		}
	}
	
	/**
	 * 查询今日创建保单列表
	 * @param params: storeId 4s店id; currentPage 当前页; foundDate 创建日期
	 * @param userId 用户id
	 * 
	 */
	@RequestMapping(value="/findBillTodayCreate",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findBillTodayCreate(@RequestParam(name="params") String params,
			@RequestParam(name="userId") Integer userId){
		BaseResponse rs = new BaseResponse();
		String message = "查询今日创建保单列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) *ConstantUtil.appPageSize;
			Integer pageSize = ConstantUtil.appPageSize;
			param.put("principalId", userId);
			param.put("start", start);
			param.put("pageSize", pageSize);
			List<Map<String,Object>> result = insuranceService.findBillTodayCreate(param);
			Integer billCount = insuranceService.findBillTodayCreateCount(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("billCount", billCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	//根据潜客ID查询当前跟踪次数
	public List<Map<String, Object>> getGzCount(List<Map<String, Object>> list) throws Exception{
		if(list!=null&&list.size()>0){
			Map<String, Object> map = new HashMap<String, Object>();
			String customers = "";
			for(int i=0;i<list.size();i++){
				Map<String, Object> customerMap = list.get(i);
				Integer customerId = (Integer) customerMap.get("customerId");
				if(customers.length()==0){
					customers = "'" + customerId + "'";
				}else{
					customers = customers + ","+"'" + customerId + "'";
				}
			}
			map.put("customers", customers);
			List<Map<String, Object>> lists = customerTraceRecodeService.findGzCount(map);
			for(int i=0;i<lists.size();i++){
				int id = (int)lists.get(i).get("id");
				long num = (long)lists.get(i).get("gzCount");
				for(int j=0;j<list.size();j++){
					int customerId = (int) list.get(j).get("customerId");
					if(id == customerId){
						list.get(j).put("gzCount", Integer.valueOf(num+""));
						break;
					}
				}
			}
		}
		return list;
	}
	
	/**
	 * 查询已激活潜客列表
	 */
	@RequestMapping(value="/findByJiHuo",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByJiHuo(@RequestParam(name="params") String params){
		BaseResponse rs = new BaseResponse();
		String message = "查询已激活潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) *ConstantUtil.appPageSize;
			Integer pageSize = ConstantUtil.appPageSize;
			param.put("userId", userId);
			param.put("start", start);
			param.put("pageSize", pageSize);
			List<Map<String,Object>> result = getGzCount(statisticService.findByJiHuoMap(param));
			Integer customerCount = statisticService.findByJiHuocount(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询待审批的潜客列表
	 * param: userId,roleId,returnStatu,currentPage
	 */
	@RequestMapping(value="/findReturnDSPCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findReturnDSPCustomer(@RequestParam(name="params") String params,
			@RequestParam(name="returnStatus") String returnStatus,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId) {
		BaseResponse rs = new BaseResponse();
		String message = "查询待审批的潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			if(returnStatus != null){
				String[] split = returnStatus.split(",");
				param.put("returnStatu1", new Integer(split[0]));
				param.put("returnStatu2", new Integer(split[1]));
			}
			if(roleId==RoleType.XSJL) {
				param.put("roleId", RoleType.XSGW);
			}else if(roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}else if(roleId==RoleType.XBZY || roleId==RoleType.XSGW || roleId==RoleType.FWGW){
				param.put("userId", userId);
			}
			param.put("storeId", storeId);
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = getGzCount(customerService.findByStatuAndUserId(param));
			Integer customerCount = customerService.findCountByStatuAndUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	
	/* 
	 * 可删除邀约
	 * param: userId,returnStatu,currentPage
	 */
	@RequestMapping(value="/selectKSCYY",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectKSCYY(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="currentPage") Integer currentPage
			) {
		BaseResponse rs = new BaseResponse();
		String message = "查询可删除邀约失败";
		try {
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Map<String, Object> map = new HashMap<String, Object>();
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer start = (currentPage - 1) * appPageSize;
			map.put("start", start);
			map.put("pageSize", appPageSize);
			
			map.put("userId", userId);
			map.put("customerId", customerId);
			List<Map<String, Object>> result = statisticService.selectKSCYY(map);
			rs.setSuccess(true);
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * APP潜客查询
	 */
	@RequestMapping(value="/findCustomerByConditionApp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustomerByConditionApp(@RequestParam(name="params") String params,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId) {
		BaseResponse rs = new BaseResponse();
		String message = "潜客查询失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			if(roleId==RoleType.XSJL) {
				param.put("roleId", RoleType.XSGW);
			}else if(roleId==RoleType.FWJL){
				param.put("roleId", RoleType.FWGW);
			}else if(roleId==RoleType.XBZY || roleId==RoleType.XSGW || roleId==RoleType.FWGW){
				param.put("userId", userId);
			}
			param.put("storeId", storeId);
			
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			
			List<Map<String, Object>> result = null;
			Integer customerCount = 0;
			String statusId = (String)param.get("statusId");
			
			if(statusId == null || "".equals(statusId)){
				result = customerService.findByConditionAPP(param);
				customerCount = customerService.findByConditionCountAPP(param);
			}else if("1".equals(statusId)){
				//应跟踪状态潜客
				param.put("traceStatu", 1);
				result = getGzCount(customerService.findByStatuAndUserId(param));
				customerCount = customerService.findCountByStatuAndUserId(param);
			}else if("2".equals(statusId)){
				//已跟踪状态潜客
				param.put("traceStatu", 2);
				result = getGzCount(customerService.findByStatuAndUserId(param));
				customerCount = customerService.findCountByStatuAndUserId(param);
			}else if("3".equals(statusId)){
				//将脱保状态潜客
				param.put("cusLostInsurStatu", 1);
				if(roleId==RoleType.XBZY || roleId==RoleType.XSGW || roleId==RoleType.FWGW){
					param.put("acceptStatu", 2);
				}
				result = customerService.findByStatuAndUserId(param);
				customerCount = customerService.findCountByStatuAndUserId(param);
			}else if("4".equals(statusId)){
				//已脱保状态潜客
				param.put("cusLostInsurStatu", 2);
				if(roleId==RoleType.XBZY || roleId==RoleType.XSGW || roleId==RoleType.FWGW){
					param.put("acceptStatu", 2);
				}
				result = customerService.findByStatuAndUserId(param);
				customerCount = customerService.findCountByStatuAndUserId(param);
			}else if("5".equals(statusId)){
				//邀约状态潜客
				result = renewalingCustomerService.findJRYYCustomerListByUserId(param);
				customerCount = renewalingCustomerService.findJRYYCustomerListCountByUserId(param);
			}
			//已回退暂时不查,因为已回退查询的是记录
//			else if("6".equals(statusId)){
//				//已回退状态潜客
//				param.put("returnStatu", 2);
//				result = customerService.findYHTCustomerAPP(param);
//				customerCount = customerService.findYHTCustomerCountAPP(param);
//			}
			else if("7".equals(statusId)){
				//已失销状态潜客
				param.put("returnStatu", 5);
				result = customerService.findYSXCustomerAPP(param);
				customerCount = customerService.findYSXCustomerCountAPP(param);
			}else if("8".equals(statusId)){
				//待审批状态潜客
				param.put("returnStatu1", 3);
				param.put("returnStatu2", 7);
				result = customerService.findByStatuAndUserId(param);
				customerCount = customerService.findCountByStatuAndUserId(param);
			}else if("9".equals(statusId)){
				//未接收状态潜客
				param.put("acceptStatu", 1);
				result = customerService.findByStatuAndUserId(param);
				customerCount = customerService.findCountByStatuAndUserId(param);
			}
			//已激活暂时不查,因为已激活查询的是记录
//			else if("10".equals(statusId)){
//				//已激活状态潜客
//				result = getGzCount(statisticService.findByJiHuoMap(param));
//				customerCount = statisticService.findByJiHuocount(param);
//			}
			else if("11".equals(statusId)){
				//到店未出单状态潜客
				result = getGzCount(statisticService.findDDWCDCustomer(param));
				customerCount = statisticService.findDDWCDCustomerCount(param);
			}else if("12".equals(statusId)){
				//跟踪完成状态潜客
				param.put("returnStatu", 11);
				result = customerService.findGZFinishedCustomer(param);
				customerCount = customerService.findGZFinishedCustomerCount(param);
			}
			 
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/* 
	 * 可删除邀约详情
	 * 
	 */
	@RequestMapping(value="/selectKSCYYXQ",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectKSCYYXQ(@RequestParam(name="customerTraceId") Integer customerTraceId) {
		BaseResponse rs = new BaseResponse();
		String message = "查询可删除邀约详情失败";
		try {
			if(customerTraceId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			CustomerTraceRecode result = customerTraceRecodeService.findByCustomerTraceId(customerTraceId);
			rs.setSuccess(true);
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/** 
	 * 顾问跟踪完成潜客列表查询
	 * params: userId,returnStatu,currentPage
	 */
	@RequestMapping(value="/findGZFinishedCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findGZFinishedCustomer(@RequestParam(name="params") String params) {
		BaseResponse rs = new BaseResponse();
		String message = "查询跟踪完成潜客列表失败";
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(params, Map.class);
			Integer userId = Integer.valueOf((String)param.get("userId"));
			if(userId == null){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer currentPage = (Integer)param.get("currentPage");
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = customerService.findGZFinishedCustomer(param);
			Integer customerCount = customerService.findGZFinishedCustomerCount(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询跟踪完成员工列表
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/findGZWCWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findGZWCWorkCollection(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		String message = "查询跟踪完成员工列表失败";
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			if(storeId == null || storeId == 0){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			if(roleId!=null&&roleId==RoleType.XSJL){
				map.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				map.put("roleId", RoleType.FWGW);
			}
			map.put("storeId", storeId);
			List<Map<String,Object>> list = statisticService.findGZWCWorkCollection(map);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询已回退员工列表
	 * @param params
	 * @return
	 */
	@RequestMapping(value="/findYHTWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findYHTWorkCollection(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		String message = "查询已回退员工列表失败";
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			if(storeId == null || storeId == 0){
				rs.setSuccess(false);
				rs.setMessage(message);
				return rs;
			}
			if(roleId!=null&&roleId==RoleType.XSJL){
				map.put("roleId", RoleType.XSGW);
			}else if(roleId!=null&&roleId==RoleType.FWJL){
				map.put("roleId", RoleType.FWGW);
			}
			map.put("storeId", storeId);
			List<Map<String,Object>> list = statisticService.findYHTWorkCollection(map);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			return rs;
		}
	}
	
	/**
	 * 查询战败线索员工列表
	 */
	@RequestMapping(value="/findZBXSWorkCollection",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findZBXSWorkCollection(@RequestParam(name="bspStoreId") Integer bspStoreId,
			@RequestParam(name="bangStatu") Integer bangStatu,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="csModuleFlag") Integer csModuleFlag){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<>();
			if(bangStatu==1){
				param.put("bsp_storeId",bspStoreId);
			}else{
				param.put("bip_storeId",storeId);
			}
			if(csModuleFlag==1){
				param.put("roleId",5);
			}else{
				param.put("roleId",2);
			}
			param.put("storeId",storeId);
			List<Map<String,Object>> list = statisticService.findZBXSWorkCollection(param);
			Map<String,Object> result = statisticService.formatDataForMap(list);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", result);
			return rs;
		} catch (Exception e) {
			logger.info("APP查询战败线索员工列表失败,程序异常: ", e);
			rs.setSuccess(false);
			rs.setMessage("查询战败线索员工列表失败");
			return rs;
		}
	}	
	
	/** 
	 * 按用户id查询线索列表信息
	 */
	@RequestMapping(value="/findDefeatedSourceByUserId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDefeatedSourceByUserId(@RequestParam(name="bspStoreId") Integer bspStoreId,
			@RequestParam(name="bangStatu") Integer bangStatu,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="currentPage") Integer currentPage) {
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<>();
			if(bangStatu==1){
				param.put("bsp_storeId",bspStoreId);
			}else{
				param.put("bip_storeId",storeId);
			}
			param.put("userId",userId);
			param.put("storeId",storeId);
			Integer appPageSize = ConstantUtil.appPageSize;
			Integer start = (currentPage - 1) * appPageSize;
			param.put("start", start);
			param.put("pageSize", appPageSize);
			List<Map<String, Object>> result = customerService.findDefeatedSourceByUserId(param);
			Integer customerCount = customerService.findCountDefeatedSourceByUserId(param);
			rs.setSuccess(true);
			rs.addContent("results", result);
			rs.addContent("customerCount", customerCount);
			return rs;
		} catch (Exception e) {
			logger.info("按用户id查询线索列表信息失败,程序异常: ", e);
			rs.setSuccess(false);
			rs.setMessage("按用户id查询线索列表信息失败");
			return rs;
		}
	}
	
}
