package com.bofide.bip.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.CustTraceRecodeVO;
import com.bofide.bip.po.GivingInformation;
import com.bofide.bip.po.InsuType;
import com.bofide.bip.po.InsuranceBill;
import com.bofide.bip.po.InsuranceBillExpand;
import com.bofide.bip.po.InsuranceTrace;
import com.bofide.bip.po.InsuranceTraceRecode;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.ApprovalBillService;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.InsuTypeService;
import com.bofide.bip.service.InsuranceService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONUtils;

/**
 * 出单控制类
 * 
 * @author lingzhenqing
 */
@Controller
@RequestMapping(value = "/insurance")
public class InsuranceController  extends BaseResponse{
	private static Logger logger = Logger.getLogger(InsuranceController.class);
	private static int INSURANCE_IMPORT_SIZE = 10;

	@Autowired
	private InsuranceService insuranceService;
	@Autowired
	private CommonService commonService;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private UserService userService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private ApprovalBillService approvalBillService;
	@Autowired
	private InsuTypeService insuTypeService;
	/**
	 * 新增保单
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/addInsurance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addInsurance(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		logger.info("---------------新增保单Controller开始-------------");
		String insureInfoJson = request.getParameter("insureInfo");
		String traceRecord = request.getParameter("traceRecord");
		//String storeId = request.getParameter("storeId");
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		String userName = request.getParameter("userName");
		String approvalBillAll = request.getParameter("approvalBillAll");
		String insuTypesStr = request.getParameter("insuTypes");

		if(StringUtils.isEmpty(insureInfoJson) && StringUtils.isEmpty(traceRecord)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单信息为空,新增保单失败!");
			return rs; 
		}
		try {
			ObjectMapper object = new ObjectMapper();
			//保单JSON字符串转java对象
			InsuranceBill insuranceBill = object.readValue(insureInfoJson,InsuranceBill.class);
			//审批单JSON字符串转java对象
			
			ApprovalBill approvalBill = object.readValue(approvalBillAll, ApprovalBill.class);
			//logger.info("insuTypesStr : " + insuTypesStr);
			List<InsuType> insuTypeList = object.readValue(insuTypesStr,new TypeReference<List<InsuType>>() { });
			String insuranceType = insuranceBill.getInsuranceType();
			String[] insuranceTypeSplit = insuranceType.split(",");
			//logger.info(insuranceType);
			for (int i = 0; i < insuTypeList.size(); i++) {
				for (int k = 0; k < insuranceTypeSplit.length; k++) {
					if( insuranceTypeSplit[k].indexOf(insuTypeList.get(i).getTypeName())>-1){
						insuTypeList.get(i).setTypeName(insuranceTypeSplit[k]);
					}
				}
			} 
			//logger.info("insuTypeList : " + insuTypeList);
			//跟踪记录JSON字符串转java对象
			List<CustTraceRecodeVO> recordList = null;
			logger.info("跟踪记录："+traceRecord+"yyyy");
			logger.info("保单信息："+insuranceBill);
			if(StringUtils.isNotBlank(traceRecord)){
				JSONArray recordArray = JSONArray.fromObject(traceRecord);
				recordList = (List<CustTraceRecodeVO>)JSONArray
						.toCollection(recordArray, CustTraceRecodeVO.class);
			}
			boolean existJqxTnBill = false;
			boolean existSyxTnBill = false;
			if(insuranceBill.getJqxrqEnd() != null){
				existJqxTnBill = commonService.verifyInsuranceBill_jqxrq(insuranceBill.getJqxrqStart(),insuranceBill.getJqxrqEnd(), insuranceBill.getChassisNumber(),
						insuranceBill.getFourSStoreId());
				if(existJqxTnBill){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增保单失败,同期交强险保单已存在");
					return rs; 
				}
			} 
			if(insuranceBill.getSyxrqEnd() != null) {
				existSyxTnBill = commonService.verifyInsuranceBill_syxrq(insuranceBill.getSyxrqStart(),insuranceBill.getSyxrqEnd(), insuranceBill.getChassisNumber(),
						insuranceBill.getFourSStoreId());
				if(existSyxTnBill){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增保单失败,同期商业险保单已存在");
					return rs; 
				}
			}
			
			//调用service新增保单
				insuranceService.saveInsuranceBill(insuranceBill, recordList, userId, userName, approvalBill,insuTypeList);
				logger.info("---------------新增保单Controller结束-------------");
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("保存保单信息成功");
				return rs; 
			
		} catch (Exception e) {
			logger.error("保存保单信息失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存保单信息失败,程序异常");
			return rs; 
		}
	}
	
	/**
	 * 初始化出单员保单页面(查当天所有)
	 * @return 
	 */
	@RequestMapping(value="/findAll",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAll(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs; 
	}
	
	
	/**
	 * 查询保单明细
	 * @return 
	 */
	@RequestMapping(value="/findDetail",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findDetail(@RequestParam(name="id") String id){
		BaseResponse rs = new BaseResponse();
		Integer insuranceBillId = new Integer(id);
		InsuranceBill insuranceBill = null;
		List<InsuranceTrace> tracelist = null;
		List<InsuType> insuTypeList = null;
		try {
			insuranceBill = insuranceService.findDetail(insuranceBillId);
			//查询保单对应的商业险种信息
			if(insuranceBill != null){
				Map<String,Object> param = new HashMap<>();
				param.put("insuId", insuranceBill.getInsuranceBillId());
				param.put("type", 1);
				insuTypeList = insuTypeService.findByCondition(param);
			}
			//根据保单的id查询对应保单的跟踪记录统计表
			tracelist = insuranceService.findInsuranceTrace(insuranceBillId);
			//查询保单的跟踪记录
			List<InsuranceTraceRecode> recodeList = insuranceService.findRecode(insuranceBillId);
			rs.setSuccess(true);
			rs.addContent("insuranceBill",insuranceBill);
			rs.addContent("tracelist",tracelist);
			rs.addContent("recodeList",recodeList);
			rs.addContent("insuTypeList",insuTypeList);
			
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("保单明细查询失败:" + e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 查询保单跟踪记录
	 * @return 
	 */
	@RequestMapping(value="/findRecord",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRecord(@RequestParam(name="id") String id){
		BaseResponse rs = new BaseResponse();
		Integer insuranceBillId = new Integer(id);
		List<InsuranceTraceRecode> RecodeList = insuranceService.findRecode(insuranceBillId);
		rs.setSuccess(true);
		rs.addContent("RecodeList", RecodeList);
		rs.addContent("status", "OK");
		return rs; 
	}
	
	/**
	 * 根据车架号查询潜客及跟踪信息
	 * @return 
	 */
	@RequestMapping(value="/findTraceRecord",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustAndTrace(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String chassisNumber = request.getParameter("chassisNumber");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		if(StringUtils.isEmpty(chassisNumber)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("车架号为空,查询潜客及跟踪信息失败!");
			return rs; 
		}
		try {
			List<CustTraceRecodeVO> traceRecodes = new ArrayList<CustTraceRecodeVO>();
			//查询潜客信息
			RenewalingCustomer customer = new RenewalingCustomer();
			customer = insuranceService.findCust(chassisNumber, storeId);
			if(!ObjectUtils.isEmpty(customer)){
				Integer customerId = customer.getCustomerId();
				//查询跟踪信息
				traceRecodes = insuranceService.findRecords(customerId);
			}
			//查询审批单的保险信息和财务信息
			ApprovalBill approvalBill = approvalBillService.findInfofromApprovalBill(chassisNumber,storeId);
			//查询审批单的商业险险种信息
			List<InsuType> insuTypes = null;
			if(approvalBill != null){
				Map<String, Object> param = new HashMap<>();
				param.put("insuId", approvalBill.getId());
				param.put("type", 3);
				insuTypes = insuTypeService.findByCondition(param);
			}
			//查询去年保单信息
			InsuranceBill insuranceBill = insuranceService.findLastYearInsurBillInfo(chassisNumber,storeId);
			//数据封装
			Map<String, Object> resultMap = new HashMap<String, Object>();
			
			resultMap.put("custInfo", customer);
			resultMap.put("traceRecode", traceRecodes);
			resultMap.put("insuranceBill", insuranceBill);
			resultMap.put("approvalBill", approvalBill);
			resultMap.put("insuTypes", insuTypes);
			rs.setSuccess(true);
			rs.addContent("result", resultMap);
			
		} catch (Exception e) {
			logger.info("查询潜客及跟踪信息失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询潜客及跟踪信息失败,程序异常:");
			return rs; 
		}
		return rs;
	}	
	/**
	 * 保单根据承保类型查询
	 * @return 
	 */
	@RequestMapping(value="/findByCovertypeAndCdrq",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCovertypeAndCdrq(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="coverType") Integer coverType,
			@RequestParam(name="showAll") boolean showAll,
			@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="shortBd") Integer shortBd,
			@RequestParam(name="shortmainBd") Integer shortmainBd){
		BaseResponse rs = new BaseResponse();
		try{
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("fourSStoreId", storeId);
			param.put("coverType", coverType);
			param.put("start", start);
			param.put("pageSize", ConstantUtil.pageSize);
			param.put("shortBd", shortBd);
			param.put("shortmainBd", shortmainBd);
			if(showAll == true){
				param.put("startTime", null);
				param.put("endTime", null);
			}else{
				param.put("startTime", startTime);
				param.put("endTime", endTime);
			}
			//查询保单
			List<InsuranceBill> insuranceBills = insuranceService.findByCovertypeAndCdrq(param);
			//查询总数
			int policyCount = insuranceService.countFindByCovertypeAndCdrq(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			rs.addContent("results", insuranceBills);
		}catch (Exception e){
			logger.info("保单根据承保类型查询失败,程序异常: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单查询失败");
		}
		return rs; 
	}
	
	/**
	 * 续保专员按投保类型查询保单
	 * @return 
	 */
	@RequestMapping(value="/findRCInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRCInsuranceBill(@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="coverType") Integer coverType,
			@RequestParam(name="showAll") boolean showAll,
			@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="shortBd") Integer shortBd,
			@RequestParam(name="shortmainBd") Integer shortmainBd){
		BaseResponse rs = new BaseResponse();

		Integer start = (startNum - 1) *ConstantUtil.pageSize;
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("principalId", principalId);
		param.put("coverType", coverType);
		param.put("start", start);
		param.put("pageSize", ConstantUtil.pageSize);
		param.put("shortBd", shortBd);
		param.put("shortmainBd", shortmainBd);
		if(showAll == true){
			param.put("startTime", null);
			param.put("endTime", null);
		}else{
			param.put("startTime", startTime);
			param.put("endTime", endTime);
		}
		
		List<InsuranceBill> insuranceBills;
		int policyCount = 0;
		try {
			//查询保单
			insuranceBills = insuranceService.findRCInsuranceBill(param);
			//查询总数
			policyCount = insuranceService.countFindRCInsuranceBill(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			rs.addContent("results", insuranceBills);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			logger.error("保单查询失败,程序异常:" + e);
			rs.setMessage("保单查询失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 销售或者服务顾问按投保类型查询保单
	 * @return 
	 */
	@RequestMapping(value="/findSCOrSAInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSCOrSAInsuranceBill(@RequestParam(name="clerkId") Integer clerkId,
			@RequestParam(name="coverType") Integer coverType,
			@RequestParam(name="showAll") boolean showAll,
			@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="shortBd") Integer shortBd,
			@RequestParam(name="shortmainBd") Integer shortmainBd){
		BaseResponse rs = new BaseResponse();

		Integer start = (startNum - 1) *ConstantUtil.pageSize;
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("clerkId", clerkId);
		param.put("coverType", coverType);
		param.put("start", start);
		param.put("pageSize", ConstantUtil.pageSize);
		if(showAll == true){
			param.put("startTime", null);
			param.put("endTime", null);
		}else{
			param.put("startTime", startTime);
			param.put("endTime", endTime);
		}
		
		List<InsuranceBill> insuranceBills;
		int policyCount = 0;
		try {
			//查询保单
			insuranceBills = insuranceService.findSCOrSAInsuranceBill(param);
			//查询总数
			policyCount = insuranceService.countFindSCOrSAInsuranceBill(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			rs.addContent("results", insuranceBills);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			logger.error("保单查询失败,程序异常:", e);
			rs.setMessage("保单查询失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 销售或者服务经理按投保类型查询保单
	 * @return 
	 */
	@RequestMapping(value="/findSeMOrSaMInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSeMOrSaMInsuranceBill(@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="coverType") Integer coverType,
			@RequestParam(name="showAll") boolean showAll,
			@RequestParam(name="startTime") String startTime,
			@RequestParam(name="endTime") String endTime,
			@RequestParam(name="startNum") Integer startNum,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="shortBd") Integer shortBd,
			@RequestParam(name="shortmainBd") Integer shortmainBd){
		BaseResponse rs = new BaseResponse();

		Integer start = (startNum - 1) * ConstantUtil.pageSize;
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("roleId", roleId);
		param.put("coverType", coverType);
		param.put("start", start);
		param.put("pageSize", ConstantUtil.pageSize);
		param.put("shortBd", shortBd);
		param.put("shortmainBd", shortmainBd);
		if(showAll == true){
			param.put("startTime", null);
			param.put("endTime", null);
		}else{
			param.put("startTime", startTime);
			param.put("endTime", endTime);
		}
		
		List<InsuranceBill> insuranceBills;
		int policyCount = 0;
		try {
			//查询保单
			insuranceBills = insuranceService.findSeMOrSaMInsuranceBill(param);
			//查询总数
			policyCount = insuranceService.countFindSeMOrSaMInsuranceBill(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("policyCount", policyCount);
			rs.addContent("results", insuranceBills);
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			logger.error("销售或者服务经理按投保类型查询保单失败,程序异常:", e);
			rs.setMessage("销售或者服务经理按投保类型查询保单失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 续保专员根据不同情况查询保单
	 * @return 
	 */
	@RequestMapping(value="/findAllRCInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllRCInsuranceBill(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();

		Integer principalId = Integer.valueOf(request.getParameter("principalId"));
		String bill = request.getParameter("condition");
		String startNumStr = request.getParameter("startNum");
		Integer startNum = 0;
		if(StringUtils.isNotEmpty(startNumStr)){
			startNum = (Integer.parseInt(startNumStr) - 1)*ConstantUtil.pageSize;
		}
		Integer pageSize = ConstantUtil.pageSize;
		ObjectMapper mapper = new ObjectMapper();
		try {
			InsuranceBillExpand insuranceBill = mapper.readValue(bill, InsuranceBillExpand.class);
			insuranceBill.setPrincipalId(principalId);
			insuranceBill.setStart(startNum);
			insuranceBill.setPageSize(pageSize);
			List<InsuranceBill> insuranceBills = insuranceService.findByMoreCondition(insuranceBill);
			//查询总数
			int policyCount = insuranceService.countFindByMoreCondition(insuranceBill);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", insuranceBills);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("保单查询失败,程序异常!" + e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单查询失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 服务或者销售顾问根据不同情况查询保单
	 * @return 
	 */
	@RequestMapping(value="/findAllSCOrSAInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllSCOrSAInsuranceBill(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		Integer clerkId = Integer.valueOf(request.getParameter("clerkId"));
		String bill = request.getParameter("condition");
		String startNumStr = request.getParameter("startNum");
		Integer startNum = 0;
		if(StringUtils.isNotEmpty(startNumStr)){
			startNum = (Integer.parseInt(startNumStr) - 1)*ConstantUtil.pageSize;
		}
		Integer pageSize = ConstantUtil.pageSize;
		ObjectMapper mapper = new ObjectMapper();
		try {
			InsuranceBillExpand insuranceBill = mapper.readValue(bill, InsuranceBillExpand.class);
			insuranceBill.setClerkId(clerkId);
			insuranceBill.setStart(startNum);
			insuranceBill.setPageSize(pageSize);
			List<InsuranceBill> insuranceBills = insuranceService.findByMoreCondition(insuranceBill);
			//查询总数
			int policyCount = insuranceService.countFindByMoreCondition(insuranceBill);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", insuranceBills);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("保单查询失败,程序异常!" + e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单查询失败,程序异常!");
			return rs; 
			
			
		}
	}
	
	/**
	 * 服务或者销售经理根据不同情况查询保单
	 * @return 
	 */
	@RequestMapping(value="/findAllSeMOrSaMInsuranceBill",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllSeMOrSaMInsuranceBill(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();

		Integer roleId = Integer.valueOf(request.getParameter("roleId"));
		String bill = request.getParameter("condition");
		String startNumStr = request.getParameter("startNum");
		Integer startNum = 0;
		if(StringUtils.isNotEmpty(startNumStr)){
			startNum = (Integer.parseInt(startNumStr) - 1)*ConstantUtil.pageSize;
		}
		Integer pageSize = ConstantUtil.pageSize;
		ObjectMapper mapper = new ObjectMapper();
		try {
			InsuranceBillExpand insuranceBill = mapper.readValue(bill, InsuranceBillExpand.class);
			insuranceBill.setRoleId(roleId);
			insuranceBill.setStart(startNum);
			insuranceBill.setPageSize(pageSize);
			List<InsuranceBill> insuranceBills = insuranceService.findByMoreCondition(insuranceBill);
			//查询总数
			int policyCount = insuranceService.countFindByMoreCondition(insuranceBill);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", insuranceBills);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("保单查询失败,程序异常!" + e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单查询失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 根据不同情况查询保单,保单的多功能查询
	 * @return 
	 */
	@RequestMapping(value="/findByMoreCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByMoreCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String storeIdStr = request.getParameter("storeId");
			Integer storeId = new Integer(storeIdStr);
			String bill = request.getParameter("condition");
			String startNumStr = request.getParameter("startNum");
			Integer startNum = 0;
			if(StringUtils.isNotEmpty(startNumStr)){
				startNum = (Integer.parseInt(startNumStr) - 1)*ConstantUtil.pageSize;
			}
			Integer pageSize = ConstantUtil.pageSize;
			ObjectMapper mapper = new ObjectMapper();
			InsuranceBillExpand insuranceBill = mapper.readValue(bill, InsuranceBillExpand.class);
			insuranceBill.setFourSStoreId(storeId);
			insuranceBill.setStart(startNum);
			insuranceBill.setPageSize(pageSize);
			List<InsuranceBill> insuranceBills = insuranceService.findByMoreCondition(insuranceBill);
			//查询总数
			int policyCount = insuranceService.countFindByMoreCondition(insuranceBill);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", insuranceBills);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("查询出现异常: " ,e);
			rs.setSuccess(false);
			return rs; 
		}
	}
	
	/**
	 * 确认邀约到店
	 * @return 
	 */
	@RequestMapping(value="/confirmIntoStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse confirmIntoStore(
			@RequestParam(name="customerId") Integer customerId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userId") Integer userId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="principal") String principal,
			@RequestParam(name="holderId") Integer holderId){
		BaseResponse rs = new BaseResponse();
		try {
			int result = insuranceService.updateConfirmIntoStore(customerId, userId,userName,storeId,principalId,principal,holderId);
			if(result ==0){
				rs.setSuccess(true);
				rs.addContent("status", "OK");	
				rs.setMessage("确认潜客进店成功");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("已确认进店！");
			}
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("确认邀约到店失败!程序异常");
			logger.info("确认邀约到店失败!程序异常:",e);
			return rs; 
		}
		return rs; 
	}
	
	/**
	 * 多条件查询潜客（基盘是大池子包括未分配的潜客，一般用于续保主管，保险经理，总经理，等需要看到所有潜客的用户）
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/findCustByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCustByCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		Integer roleId=Integer.valueOf(request.getParameter("roleId"));
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
			List<RenewalingCustomer> customerList = insuranceService.findCustByCondition(conditionMap);
			//数据分析员视图下加密电话号码
			if(roleId== RoleType.SJGLY){
				for (RenewalingCustomer renewalingCustomer : customerList) {
					String value = (String) renewalingCustomer.getContactWay();
               	    String turnTelF = StringUtil.turnTelF(value);
               	    renewalingCustomer.setContactWay(turnTelF);
				}
			}
			//查询总数
			int policyCount = insuranceService.countFindCustByCondition(conditionMap);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", customerList);
			rs.addContent("policyCount", policyCount);
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
	 * 保单数据导入
	 * @return 
	 */
	@SuppressWarnings({ "unchecked"})
	@RequestMapping(value="/importInsurance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importInsurance(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer fourSStoreId = Integer.valueOf(request.getParameter("fourSStoreId"));
		List<Map<String,Object>> dataList = null;
		List<InsuranceBill> insuranceBillList = null;//经过初始化校验筛选后的数据,包含重复跳过导入的数据和提示异常的数据
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
			ObjectMapper mapper = new ObjectMapper();
			dataList = mapper.readValue(data, List.class);
			dataCount = dataList.size();
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();
				Map<String,Object> coverTypeMap = (Map<String,Object>)map.get("coverTypeName");
				if(coverTypeMap.size()<=0){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "投保类型不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}else{
					String coverTypeName = coverTypeMap.get("coverTypeName")==null ? "" : coverTypeMap.get("coverTypeName").toString();
					String[] types = {"新保","新转续","续转续","间转续","潜转续","首次"};
					if(!Arrays.asList(types).contains(coverTypeName)){
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "投保类型错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
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
				if (map.get("insurDate") != null) {
					String insurDate = ((String) map.get("insurDate")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(insurDate);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "投保日期格式错误");
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
				if(map.get("jqxrqEnd")== null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "交强险到期日期不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				
				if (map.get("jqxrqEnd") != null) {
					String jqxrqEnd = ((String) map.get("jqxrqEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDateTime(jqxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "交强险到期日期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}else{
						map.put("jqxrqStart", DateUtil.getLastYearTime(jqxrqEnd));
					}
				}
				if (map.get("syxrqEnd") != null) {
					String syxrqEnd = ((String) map.get("syxrqEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDateTime(syxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "商业险到期日期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}else{
						map.put("syxrqStart", DateUtil.getLastYearTime(syxrqEnd));
					}
				}
				String cinsuranceCoverage = map.get("cinsuranceCoverage")==null ? "0" : map.get("cinsuranceCoverage").toString();
				if(!StringUtil.isNumeric(cinsuranceCoverage)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "交强险保费格式错误");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String binsuranceCoverage = map.get("binsuranceCoverage")==null ? "0" : map.get("binsuranceCoverage").toString();
				if(!StringUtil.isNumeric(binsuranceCoverage)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "商业险保费格式错误");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String vehicleTax = map.get("vehicleTax")==null ? "0" : map.get("vehicleTax").toString();
				if(!StringUtil.isNumeric(vehicleTax)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车船税格式错误");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String realPay = map.get("realPay")==null ? "0" : map.get("realPay").toString();
				if(!StringUtil.isNumeric(realPay)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "实付金额格式错误");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			insuranceBillList = mapper.readValue(jsonStr,new TypeReference<List<InsuranceBill>>() { });
			List<InsuranceBill> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			//int errorRow = 0;
			for (int i = 0; i < insuranceBillList.size(); i++) {
				InsuranceBill insuranceBill = insuranceBillList.get(i);
				tempList.add(insuranceBill);
				if ((i + 1) % INSURANCE_IMPORT_SIZE == 0 || i == insuranceBillList.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					//errorRow = i / CUSTOMER_IMPORT_SIZE * CUSTOMER_IMPORT_SIZE;
					errorRows = insuranceService.saveInsuranceFromImport(tempList);
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
		}catch(Exception e){
			logger.error("导入失败,程序异常:",e);
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
	 * 保存审批单
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/print_spd",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse print_spd(@RequestParam(name="print_spd_datas") String printSpdDatas){
		BaseResponse rs = new BaseResponse();
		ObjectMapper mapper = new ObjectMapper();
		try {
			JSONObject printSpdDatasObj = JSONObject.fromObject(printSpdDatas);
			JSONObject approvalBillObj = printSpdDatasObj.getJSONObject("approvalBill");
			if(approvalBillObj.getString("jqxrqStart").isEmpty()){
				approvalBillObj.replace("jqxrqStart", null);
			}
			if(approvalBillObj.getString("jqxrqEnd").isEmpty()){
				approvalBillObj.replace("jqxrqEnd", null);
			}
			if(approvalBillObj.getString("insurDate").isEmpty()){
				approvalBillObj.replace("insurDate", null);
			}
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd HH:mm:ss","yyyy-MM-dd"}));
			JSONArray zsxxArrayObj =  (JSONArray) printSpdDatasObj.get("zsxxs");
			List<GivingInformation> givingInformationList = (List<GivingInformation>)JSONArray.toCollection(zsxxArrayObj,GivingInformation.class);
			String insuTypeArrayStr =  printSpdDatasObj.get("insuTypes").toString();
			List<InsuType> insuTypeList = mapper.readValue(insuTypeArrayStr,new TypeReference<List<InsuType>>() { });
			ApprovalBill approvalBill = (ApprovalBill)JSONObject.toBean(approvalBillObj,ApprovalBill.class);
			customerService.saveApprovalBill(approvalBill,givingInformationList,insuTypeList);
		} catch (Exception e) {
			logger.info("保存审批单失败，程序异常：",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存审批单失败！");
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("添加成功");
		return rs;
	}
	
	/**
	 * 根据车架号查询审批单
	 */
	@RequestMapping(value="/findInfofromApprovalBill",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findInfofromApprovalBill(@RequestParam(name = "chassisNumber") String chassisNumber,
			@RequestParam(name = "chassisNumber") Integer fourSStoreId){
		BaseResponse rs = new BaseResponse();
		ApprovalBill approvalBill = null;
		try {
			approvalBill = approvalBillService.findInfofromApprovalBill(chassisNumber,fourSStoreId);
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败,程序异常:"+e.getMessage());
			return rs; 
		}
		rs.setSuccess(true);
		rs.addContent("results", approvalBill);
		rs.addContent("status", "OK");
		rs.setMessage("查询成功");
		return rs;
	}
	
	/**
	 * 更新保单信息
	 */
	@RequestMapping(value="/updateInsuranceBillInfo",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateInsuranceBillInfo(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String insuranceBill = request.getParameter("insuranceBill");
		String insuTypesStr = request.getParameter("insuTypes");
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> map = objectMapper.readValue(insuranceBill, Map.class);
			List<InsuType> insuTypeList = new ArrayList<InsuType>();
			//logger.info("商险信息Str : " + insuTypesStr);
			String  insuranceType = JSONObject.fromObject(insuranceBill).getString("insuranceType");
			String[] insuranceTypeSplit = insuranceType.split(",");
			if(!"".equals(insuTypesStr)){
				insuTypeList = objectMapper.readValue(insuTypesStr,new TypeReference<List<InsuType>>() { });
			}
			//logger.info(insuranceType);
			for (int i = 0; i < insuTypeList.size(); i++) {
				for (int k = 0; k < insuranceTypeSplit.length; k++) {
					if( insuranceTypeSplit[k].indexOf(insuTypeList.get(i).getTypeName())>-1){
						insuTypeList.get(i).setTypeName(insuranceTypeSplit[k]);
					}
				}
			} 
			
			Date jqxrqEnd = null;
			Date syxrqEnd = null;
			String jqxrqEndStr = (String)map.get("jqxrqEnd");
			String syxrqEndStr = (String)map.get("syxrqEnd");
			if(jqxrqEndStr !=null){
				jqxrqEnd = new SimpleDateFormat("yyyy-MM-dd").parse(jqxrqEndStr) ;
			}
			if(syxrqEndStr !=null){
				syxrqEnd = new SimpleDateFormat("yyyy-MM-dd").parse(syxrqEndStr) ;
			}
			
			String chassisNumber = (String) map.get("chassisNumber");
			Integer fourSStoreId = (Integer) map.get("fourSStoreId");
			Integer insuranceBillId = (Integer) map.get("insuranceBillId");
			InsuranceBill bill = insuranceService.findDetail(insuranceBillId);
			//此处用于修改车架号时校验是否存在同期保单
			if(!chassisNumber.equals(bill.getChassisNumber())){
				if(jqxrqEnd!=null){
					boolean existJqxBill = commonService.verifyInsuranceBill(jqxrqEnd, chassisNumber, fourSStoreId,"JqxrqEnd");
					if(existJqxBill){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("保单修改失败,存在相同车架号的同年交强险保单");
						return rs; 
					}
				}
				if(syxrqEnd!=null){
					boolean existSyxBill = commonService.verifyInsuranceBill(syxrqEnd, chassisNumber, fourSStoreId,"SyxrqEnd");
					if(existSyxBill){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("保单修改失败,存在相同车架号的同年商业险保单");
						return rs; 
					}
				}
			}
			//此处用于修改交强险日期时校验是否存在同期保单
			if(jqxrqEnd != null){
				String existJqxrqEndStr = null;
				if(bill.getJqxrqEnd() != null){
					existJqxrqEndStr = new SimpleDateFormat("yyyy-MM-dd").format(bill.getJqxrqEnd());
				}
				if(existJqxrqEndStr == null || !jqxrqEndStr.equals(existJqxrqEndStr)){
					InsuranceBill existBill = insuranceService.findExistInsuranceBill(jqxrqEnd, chassisNumber, fourSStoreId, "JqxrqEnd");
					if(existBill != null){
						if(!existBill.getInsuranceBillId().equals(insuranceBillId)){
							rs.setSuccess(false);
							rs.addContent("status", "BAD");
							rs.setMessage("保单修改失败,存在同期的交强险保单");
							return rs; 
						}
					}
				}
			}
			//此处用于修改商业险日期时校验是否存在同期保单
			if(syxrqEnd != null){
				String existSyxrqEndStr = null;
				if(bill.getSyxrqEnd() != null){
					existSyxrqEndStr = new SimpleDateFormat("yyyy-MM-dd").format(bill.getSyxrqEnd());
				}
				if(existSyxrqEndStr ==null || !syxrqEndStr.equals(existSyxrqEndStr)){
					InsuranceBill existBill = insuranceService.findExistInsuranceBill(syxrqEnd, chassisNumber, fourSStoreId, "SyxrqEnd");
					if(existBill != null){
						if(!existBill.getInsuranceBillId().equals(insuranceBillId)){
							rs.setSuccess(false);
							rs.addContent("status", "BAD");
							rs.setMessage("保单修改失败,存在同期的商业险保单");
							return rs; 
						}
					}
				}
			}
			
			insuranceService.updateInsuranceBillInfo(map,insuTypeList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs;
		} catch (Exception e) {
			logger.error("更新保单信息失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新保单信息失败,程序异常!");
			return rs; 
		}
	}
	
	/**
	 * 新增历史保单
	 * @return 
	 */
	@RequestMapping(value="/saveOldInsurance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveOldInsurance(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		logger.info("---------------新增历史保单Controller开始-------------");
		String insureInfoJson = request.getParameter("insureInfo");
		String insuTypesStr = request.getParameter("insuTypes");
		if(StringUtils.isEmpty(insureInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保单信息为空,新增历史保单失败!");
			return rs; 
		}
		try {
			ObjectMapper object = new ObjectMapper();
			InsuranceBill insuranceBill = object.readValue(insureInfoJson,InsuranceBill.class);
			List<InsuType> insuTypeList = object.readValue(insuTypesStr,new TypeReference<List<InsuType>>() { });
			//logger.info("保单信息："+insuranceBill);
			boolean existJqxTnBill = false;
			boolean existSyxTnBill = false;
			if(insuranceBill.getJqxrqEnd() != null){
				existJqxTnBill = commonService.verifyInsuranceBill(insuranceBill.getJqxrqEnd(), insuranceBill.getChassisNumber(),
						insuranceBill.getFourSStoreId(),"JqxrqEnd");
				if(existJqxTnBill){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增保单失败,同期交强险保单已存在");
					return rs; 
				}
			} 
			if(insuranceBill.getSyxrqEnd() != null) {
				existSyxTnBill = commonService.verifyInsuranceBill(insuranceBill.getSyxrqEnd(), insuranceBill.getChassisNumber(),
						insuranceBill.getFourSStoreId(),"SyxrqEnd");
				if(existSyxTnBill){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增保单失败,同期商业险保单已存在");
					return rs; 
				}
			}
			
			//调用service新增保单
			insuranceService.saveOldInsuranceBill(insuranceBill,insuTypeList);
			logger.info("---------------新增保单Controller结束-------------");
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("保存保单信息成功");
			return rs; 
		} catch (Exception e) {
			logger.error("保存保单信息失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存保单信息失败,程序异常");
			return rs; 
		}
	}
	/**
	 * 多条件查询审批单
	 */
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findByCondition(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			String storeId = request.getParameter("storeId");
			Integer roleId = Integer.valueOf(request.getParameter("roleId"));
			String shortSpd = request.getParameter("shortSpd");
			String shortmainSpd = request.getParameter("shortmainSpd");
			String billFlag = request.getParameter("billFlag");
			Integer startNum = new Integer(request.getParameter("startNum"));
			ObjectMapper objectMapper = new ObjectMapper();
			ApprovalBill approvalBill = objectMapper.readValue(condition, ApprovalBill.class);
			Integer start = (startNum - 1) *ConstantUtil.pageSize;
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("approvalBill", approvalBill);
			param.put("start", start);
			param.put("storeId", new Integer(storeId));
			param.put("pageSize", ConstantUtil.pageSize);
			param.put("shortSpd", shortSpd);
			param.put("shortmainSpd", shortmainSpd);
			List<ApprovalBill> list = null;
			int approvalBillCount = 0;
			if("0".equals(billFlag)){
				list = approvalBillService.findTempApprByCondition(param);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (ApprovalBill approvalBill1 : list) {
						String value = (String) approvalBill1.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    approvalBill1.setContactWay(turnTelF);
					}
				}
				approvalBillCount = approvalBillService.findTempApprByConditionCount(param);
			}else{
				list = approvalBillService.findByCondition(param);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
					for (ApprovalBill approvalBill1 : list) {
						String value = (String) approvalBill1.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    approvalBill1.setContactWay(turnTelF);
					}
				}
				approvalBillCount = approvalBillService.findCountByCondition(param);
			}
			rs.addContent("result", list);
			rs.addContent("policyCount", approvalBillCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("多条件查询审批单失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("多条件查询审批单失败!");
		}
		return rs;
	}
	
	/**
	 * 根据审批单的id查询审批单详情
	 */
	@RequestMapping(value="/findByApprovalBillId",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findByApprovalBillId(@RequestParam(name="approvalBillId") Integer approvalBillId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="billFlag") String billFlag,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
			ApprovalBill approvalBill = null;
			if("0".equals(billFlag)){
				approvalBill = approvalBillService.findTempApproByApprovalBillId(approvalBillId, storeId);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
						String value = (String) approvalBill.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    approvalBill.setContactWay(turnTelF);
				}
			}else{
				approvalBill = approvalBillService.findByApprovalBillId(approvalBillId, storeId);
				//数据分析员视图下加密电话号码
				if(roleId==RoleType.SJGLY){
						String value = (String) approvalBill.getContactWay();
	               	    String turnTelF = StringUtil.turnTelF(value);
	               	    approvalBill.setContactWay(turnTelF);
				}
			}
			rs.addContent("result", approvalBill);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("查询审批单详情,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询审批单详情失败!");
		}
		return rs;
	}
	
	/**
	 * 总经理删除保单
	 */
	@RequestMapping(value="/deleteBill",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse deleteBill(@RequestParam(name="insuranceBillId") Integer insuranceBillId){
		BaseResponse rs = new BaseResponse();
		try {
			insuranceService.deleteBill(insuranceBillId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("删除保单失败,程序异常!", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除保单失败");
		}
		return rs;
	}
	
	/**
	 * 按车架号校验本月是否已出单
	 * @param chassisNumber 车架号
	 * @param storeId 4s店id
	 */
	@RequestMapping(value="/findExistBillThisMonth",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findExistBillThisMonth(@RequestParam(name="chassisNumber") String chassisNumber,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="insurDate") String insurDate){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> map = new HashMap<>();
			map.put("storeId", storeId);
			map.put("chassisNumber", chassisNumber);
			map.put("insurDate", insurDate);
			Integer existCount = insuranceService.findExistBillThisMonth(map);
			rs.addContent("existCount", existCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("按车架号校验本月是否已出单方法出现异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
		}
		return rs;
	}
	
	/**
	 * 根据条件查询保单及统计保费总额度 
	 * @param condition
	 * @param storeId
	 * @return
	 */
	@RequestMapping(value="/findInformationAndPremiumCount",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse findInformationAndPremiumCount(@RequestParam(name="condition") String condition,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper mapper = new ObjectMapper();
			InsuranceBillExpand insuranceBill = mapper.readValue(condition, InsuranceBillExpand.class);
			insuranceBill.setFourSStoreId(storeId);
			insuranceBill.setStart((insuranceBill.getStart()-1)*ConstantUtil.pageSize);
			insuranceBill.setPageSize(ConstantUtil.pageSize);
			List<InsuranceBill> lists = insuranceService.findByMoreCondition(insuranceBill);
			for(int i=0;i<lists.size();i++){
				InsuranceBill bill = lists.get(i);
				Double giftDiscount = bill.getGiftDiscount();
				Double privilegeSum = bill.getPrivilegeSum();
				if(giftDiscount==null){
					giftDiscount = 0.0;
				}
				if(privilegeSum==null){
					privilegeSum = 0.0;
				}
				Double comprehensiveDiscount = giftDiscount + privilegeSum;
				bill.setComprehensiveDiscount(comprehensiveDiscount);
			} 
			Integer policyCount = insuranceService.countFindByMoreCondition(insuranceBill);
			double dou = insuranceService.sumPremiumCount(insuranceBill);
			rs.addContent("lists", lists);
			rs.addContent("dou", dou);
			rs.addContent("policyCount", policyCount);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("根据条件查询保单及统计保费总额度方法出现异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
		}
		return rs;
	}
	
	@RequestMapping(value = "/moveInsuranceBill",method={RequestMethod.GET})
	@ResponseBody
	public BaseResponse moveInsuranceBill(){
		BaseResponse rs = new BaseResponse();
		try {
			int num = 0;
			//审批单记录数据迁移
			while(true){
				List<Map<String, Object>> maps = approvalBillService.findApprovalRecordAll();
				if(maps!=null&&maps.size()>0){
					for(int i=0;i<maps.size();i++){
						insuranceService.updateInsuTypeAndBill(maps.get(i),2);
					}
					num = num+maps.size();
					logger.info("已迁移"+num+"个审批单记录！");
				}else{
					logger.info("审批单记录数据迁移完毕！");
					break;
				}
			}
			num = 0;
			//审批单临时记录数据迁移
			while(true){
				List<Map<String, Object>> maps = approvalBillService.findApprovalAll();
				if(maps!=null&&maps.size()>0){
					for(int i=0;i<maps.size();i++){
						insuranceService.updateInsuTypeAndBill(maps.get(i),3);
					}
					num = num+maps.size();
					logger.info("已迁移"+num+"个审批单临时记录！");
				}else{
					logger.info("审批单临时记录数据迁移完毕！");
					break;
				}
			}
			num = 0;
			//保单数据迁移
			while(true){
				List<Map<String, Object>> maps = insuranceService.findBillAll();
				if(maps!=null&&maps.size()>0){
					for(int i=0;i<maps.size();i++){
						insuranceService.updateInsuTypeAndBill(maps.get(i),1);
					}
					num = num+maps.size();
					logger.info("已迁移"+num+"个保单！");
				}else{
					logger.info("保单数据迁移完毕！");
					break;
				}
			}
			rs.setMessage("数据迁移成功！");
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("保单数据迁移失败！", e);
			rs.setMessage("保单数据迁移失败！");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
		}
		return rs;
	}
}
