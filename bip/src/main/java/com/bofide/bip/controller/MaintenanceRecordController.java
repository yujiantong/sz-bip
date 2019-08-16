package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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

import com.bofide.bip.po.Customer;
import com.bofide.bip.po.MaintenanceRecord;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.MaintenanceItemService;
import com.bofide.bip.service.MaintenancePartService;
import com.bofide.bip.service.MaintenanceRecordService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/maintenance")
public class MaintenanceRecordController {
	private static Logger logger = Logger.getLogger(MaintenanceRecordController.class);
	private static int IMPORT_SIZE = 10;
	
	@Autowired
	private UserService userService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private MaintenanceRecordService maintenanceRecordService;
	@Autowired
	private MaintenanceItemService maintenanceItemService;
	@Autowired
	private MaintenancePartService maintenancePartService;
	@Autowired
	private CustomerService customerService;

	/**
	 * 维修记录导入
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/importMaintenanceRecord",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importMaintenanceRecord(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(storeId);
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> dataList = mapper.readValue(data, List.class);
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();				
				if(map.get("maintainNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "施工单号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("carLicenseNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车牌号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("consultantName") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "服务顾问不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("maintainCost") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "维修金额不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String maintainCost = map.get("maintainCost")==null ? "0" : map.get("maintainCost").toString();
				if(!StringUtil.isNumeric(maintainCost)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "维修金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("maintenanceTimeStart")== null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "维修开始时间不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				
				if (map.get("maintenanceTimeStart") != null) {
					String jqxrqEnd = ((String) map.get("maintenanceTimeStart")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(jqxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "维修开始时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if(map.get("maintenanceTimeEnd")== null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "维修结束时间不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				
				if (map.get("maintenanceTimeEnd") != null) {
					String jqxrqEnd = ((String) map.get("maintenanceTimeEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(jqxrqEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "维修结束时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String certainCost = map.get("certainCost")==null ? "0" : map.get("certainCost").toString();
				if(!StringUtil.isNumeric(certainCost)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "定损金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String realCost = map.get("realCost")==null ? "0" : map.get("realCost").toString();
				if(!StringUtil.isNumeric(realCost)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "实收金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			List<Map<String,Object>> records = mapper.readValue(jsonStr, List.class);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			for (int i = 0; i < records.size(); i++) {
				Map<String,Object> recordMap = records.get(i);
				tempList.add(recordMap);
				if ((i + 1) % IMPORT_SIZE == 0 || i == records.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					errorRows = maintenanceRecordService.saveImportMaintenanceRecord(tempList);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功导入" + (i+1) +"条潜客数据");
				}
			}
		}catch(Exception e){
			logger.error("导入失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(storeId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		rs.setSuccess(true);
		if(errorMessage.size()>0){
			rs.addContent("errorMessage", errorMessage);
			rs.setMessage("导入完成,有部分错误数据导入失败.");
		}else{
			rs.setMessage("导入成功.");
		}
		return rs;
	}
	
	/**
	 * 维修记录导入
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/importMaintenancePart",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importMaintenancePart(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(storeId);
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> dataList = mapper.readValue(data, List.class);
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();				
				if(map.get("maintainNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "施工单号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("partName") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "配件名称不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String unitPrice = (String) map.get("unitPrice");
				if(!StringUtil.isNumeric(unitPrice)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "单价只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String amount = (String) map.get("amount");
				if(!StringUtil.isNumeric(amount)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "数量只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String totalAmount = (String) map.get("totalAmount");
				if(!StringUtil.isNumeric(totalAmount)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "总金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			List<Map<String,Object>> records = mapper.readValue(jsonStr, List.class);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			for (int i = 0; i < records.size(); i++) {
				Map<String,Object> recordMap = records.get(i);
				tempList.add(recordMap);
				if ((i + 1) % IMPORT_SIZE == 0 || i == records.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					errorRows = maintenancePartService.saveImportMaintenancePart(tempList);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功导入" + (i+1) +"条潜客数据");
				}
			}
		}catch(Exception e){
			logger.error("导入失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(storeId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		rs.setSuccess(true);
		if(errorMessage.size()>0){
			rs.addContent("errorMessage", errorMessage);
			rs.setMessage("导入完成,有部分错误数据导入失败.");
		}else{
			rs.setMessage("导入成功.");
		}
		return rs;
	}
	
	/**
	 * 维修工时记录导入
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/importMaintenanceItem",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importMaintenanceItem(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String data = request.getParameter("data");
		Integer storeId = Integer.valueOf(request.getParameter("storeId"));
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		Store store = null;
		try {
			store = storeService.findStoreById(storeId);
		} catch (Exception e) {
			logger.error("导入时查询店导入状态失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		}
		if(store.getImportStatus() !=null && store.getImportStatus() ==1){
			rs.setSuccess(false);
			rs.setMessage("系统正在导入中,请稍后重试");
			return rs;
		} 
		try{
			ObjectMapper mapper = new ObjectMapper();
			List<Map<String,Object>> dataList = mapper.readValue(data, List.class);
			for (Iterator<Map<String, Object>> iter = dataList.iterator(); iter.hasNext();) {
				Map<String,Object> map = (Map<String, Object>) iter.next();				
				if(map.get("maintainNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "施工单号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("maintenanceItem") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "维修项目不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String workingHour = (String) map.get("workingHour");
				if(!StringUtil.isNumeric(workingHour)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "工时只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String workingCost = (String) map.get("workingCost");
				if(!StringUtil.isNumeric(workingCost)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "工时费用只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
			}
			String jsonStr = mapper.writeValueAsString(dataList);
			List<Map<String,Object>> records = mapper.readValue(jsonStr, List.class);
			List<Map<String,Object>> tempList = new ArrayList<>();
			//修改店导入状态
			store.setImportStatus(1);
			storeService.updateStoreInfoById(store);
			for (int i = 0; i < records.size(); i++) {
				Map<String,Object> recordMap = records.get(i);
				tempList.add(recordMap);
				if ((i + 1) % IMPORT_SIZE == 0 || i == records.size() - 1) {
					List<Map<String, Object>> errorRows = new ArrayList<>();
					errorRows = maintenanceItemService.saveImportMaintenanceItem(tempList);
					errorMessage.addAll(errorRows);
					tempList.clear();
					logger.info("成功导入" + (i+1) +"条潜客数据");
				}
			}
		}catch(Exception e){
			logger.error("导入失败,程序异常", e);
			rs.setSuccess(false);
			rs.setMessage("导入失败,程序异常");
			return rs;
		} finally{
			Store importStatu = new Store();
			importStatu.setStoreId(storeId);
			importStatu.setImportStatus(0);
			try {
				storeService.updateStoreInfoById(importStatu);
			} catch (Exception e) {
				logger.error("导入时更改店导入状态失败:", e);
			}
		}
		rs.setSuccess(true);
		if(errorMessage.size()>0){
			rs.addContent("errorMessage", errorMessage);
			rs.setMessage("导入完成,有部分错误数据导入失败.");
		}else{
			rs.setMessage("导入成功.");
		}
		return rs;
	}
	
	/**
	 * 根据条件查询维修记录
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCondition(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			if(param==null){
				param = new HashMap<String, Object>();
			}
			param.put("storeId", storeId);
			Integer crlsign = (Integer) param.get("crlsign");
			if(roleId==8&&!(crlsign!=null&&crlsign==1)){
				param.put("userId", userId);
			}
			Integer startNum = (Integer) param.get("startNum");
			if(startNum==null||startNum<1){
				startNum = 1;
			}
			param.put("start", (startNum - 1) * ConstantUtil.pageSize);
			param.put("pageSize", ConstantUtil.pageSize);
			List<Map<String, Object>> lists = maintenanceRecordService.findByCondition(param);
			int policyCount = 0;
			policyCount = maintenanceRecordService.countByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", lists);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("查询维修记录失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 根据施工单号和店ID查询维修项目以及维修配件
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/findByMaintainNumber",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByMaintainNumber(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="maintainNumber") String maintainNumber){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("storeId", storeId);
			param.put("maintainNumber", maintainNumber);
			List<Map<String, Object>> itemLists = maintenanceItemService.findByMaintainNumber(param);
			List<Map<String, Object>> partLists = maintenancePartService.findByMaintainNumber(param);
			MaintenanceRecord record = maintenanceRecordService.findByMaintainNumber(param);
			List<Customer> lists = null;
			if(record!=null&&record.getCarLicenseNumber()!=null){
				param.put("carLicenseNumber", record.getCarLicenseNumber());
				lists = customerService.selectByCLNumber(param);
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("itemLists", itemLists);
			rs.addContent("partLists", partLists);
			rs.addContent("record", record);
			rs.addContent("lists", lists);
			return rs; 
		} catch (Exception e) {
			logger.error("查询维修项目以及维修配件失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	
}
