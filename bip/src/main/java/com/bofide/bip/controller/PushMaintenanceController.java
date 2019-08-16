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

import com.bofide.bip.po.Store;
import com.bofide.bip.po.PushMaintenance;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.service.PushMaintenanceService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.StoreService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.ConstantUtil;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/pushMaintenance")
public class PushMaintenanceController {
	private static Logger logger = Logger.getLogger(MaintenanceRecordController.class);
	private static int PUSH_MAINTENANCE_IMPORT_SIZE = 1;

	@Autowired
	private PushMaintenanceService pushMaintenanceService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	
	/**
	 * 新增推送修记录
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/addPushMaintenance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addPushMaintenance(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			if(param==null){
				rs.setMessage("集合为空!");
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				return rs; 
			}
			param.put("storeId", storeId);
			pushMaintenanceService.insert(param);
			rs.setSuccess(true);
			rs.setMessage("新增推送修记录成功!");
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("新增推送修记录失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 根据条件查询推送修记录
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCondition(@RequestParam(name="storeId") Integer storeId,
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
			Integer startNum = (Integer) param.get("startNum");
			if(startNum==null||startNum<1){
				startNum = 1;
			}
			param.put("start", (startNum - 1) * ConstantUtil.pageSize);
			param.put("pageSize", ConstantUtil.pageSize);
			List<PushMaintenance> lists = pushMaintenanceService.findByCondition(param);
			int policyCount = 0;
			policyCount = pushMaintenanceService.countByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", lists);
			rs.addContent("policyCount", policyCount);
			return rs; 
		} catch (Exception e) {
			logger.error("查询推送修记录失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 根据报案号以及店ID查询推送修记录的明细
	 * @param storeId
	 * @param reportNumber
	 * @return
	 */
	@RequestMapping(value="/findPMaintenanceByRNumber",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findPMaintenanceByRNumber(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="reportNumber") String reportNumber){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String, Object>();
			param.put("storeId", storeId);
			param.put("reportNumber", reportNumber);
			PushMaintenance pushMaintenance = pushMaintenanceService.findPMaintenanceByRNumber(param);
			RenewalingCustomer renewalingCustomer = null;
			if(pushMaintenance!=null&&pushMaintenance.getChassisNumber()!=null&&pushMaintenance.getChassisNumber().length()>0){
				renewalingCustomer = renewalingCustomerService.selectBychaNum(pushMaintenance.getChassisNumber(),pushMaintenance.getStoreId());
				if(renewalingCustomer!=null&&renewalingCustomer.getCustomerId()!=null){
					renewalingCustomer = renewalingCustomerService.findTraceRecordByCustomerId(renewalingCustomer.getCustomerId());
				}
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", pushMaintenance);
			rs.addContent("rc", renewalingCustomer);
			return rs; 
		} catch (Exception e) {
			logger.error("查询推送修记录失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	/**
	 * 推送修记录导入
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/importPushMaintenance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse importPushMaintenance(HttpServletRequest request, HttpServletResponse response){
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
				if(map.get("reportNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "报案号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("insuranceNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "保单号不能为空");
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
				if(map.get("chassisNumber") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车架号不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("reporter") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "报案人不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("reporterPhone") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "报案电话不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("accidentPlace") == null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "出险地点不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if(map.get("accidentTime")== null){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "出险时间不能为空");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("accidentTime") != null) {
					String accidentTime = ((String) map.get("accidentTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(accidentTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "出险时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("pushTime") != null) {
					String pushTime = ((String) map.get("pushTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(pushTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "推送时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("insuranceDateStart") != null) {
					String insuranceDateStart = ((String) map.get("insuranceDateStart")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(insuranceDateStart);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "保险起期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("insuranceDateEnd") != null) {
					String insuranceDateEnd = ((String) map.get("insuranceDateEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(insuranceDateEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "保险止期格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String clzws = (String) map.get("clzws");
				if(!StringUtil.isNumeric(clzws)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车辆座位数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String csxbe = (String) map.get("csxbe");
				if(!StringUtil.isNumeric(csxbe)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车损险保额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String syszxbe = (String) map.get("syszxbe");
				if(!StringUtil.isNumeric(syszxbe)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "商业三者险保额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("reportTime") != null) {
					String reportTime = ((String) map.get("reportTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(reportTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "报案时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("dachsj") != null) {
					String dachsj = ((String) map.get("dachsj")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(dachsj);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "大案初核时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String zrxs = (String) map.get("zrxs");
				if(!StringUtil.isNumeric(zrxs)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "责任系数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("sdsj") != null) {
					String sdsj = ((String) map.get("sdsj")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(sdsj);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "收单时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("lasj") != null) {
					String lasj = ((String) map.get("lasj")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(lasj);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "立案时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String laje = (String) map.get("laje");
				if(!StringUtil.isNumeric(laje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "立案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String cslaje = (String) map.get("cslaje");
				if(!StringUtil.isNumeric(cslaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车损立案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String rslaje = (String) map.get("rslaje");
				if(!StringUtil.isNumeric(rslaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "人伤立案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String wslaje = (String) map.get("wslaje");
				if(!StringUtil.isNumeric(wslaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "物损立案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("zalsTimeStart") != null) {
					String zalsTimeStart = ((String) map.get("zalsTimeStart")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(zalsTimeStart);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "整案理算开始时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("zalsTimeEnd") != null) {
					String zalsTimeEnd = ((String) map.get("zalsTimeEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(zalsTimeEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "整案理算结束时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("scrgzjTimeStart") != null) {
					String scrgzjTimeStart = ((String) map.get("scrgzjTimeStart")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(scrgzjTimeStart);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "首次人工质检开始时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("mcrgzjTimeEnd") != null) {
					String mcrgzjTimeEnd = ((String) map.get("mcrgzjTimeEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(mcrgzjTimeEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "末次人工质检结束时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("scckTimeStart") != null) {
					String scckTimeStart = ((String) map.get("scckTimeStart")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(scckTimeStart);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "首次查勘开始时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("mcckTimeEnd") != null) {
					String mcckTimeEnd = ((String) map.get("mcckTimeEnd")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(mcckTimeEnd);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "末次查勘结束时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("sctdTime") != null) {
					String sctdTime = ((String) map.get("sctdTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(sctdTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "首次提调时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String cwnbdcjsje = (String) map.get("cwnbdcjsje");
				if(!StringUtil.isNumeric(cwnbdcjsje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车物内部调查减损金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String cwwbdcjsje = (String) map.get("cwwbdcjsje");
				if(!StringUtil.isNumeric(cwwbdcjsje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车物外部调查减损金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String jpje = (String) map.get("jpje");
				if(!StringUtil.isNumeric(jpje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "拒赔金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String fkjsje = (String) map.get("fkjsje");
				if(!StringUtil.isNumeric(fkjsje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "复勘减损金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String zcje = (String) map.get("zcje");
				if(!StringUtil.isNumeric(zcje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "追偿金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				if (map.get("sczfcgTime") != null) {
					String sczfcgTime = ((String) map.get("sczfcgTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(sczfcgTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "首次支付成功时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("mczfcgTime") != null) {
					String mczfcgTime = ((String) map.get("mczfcgTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(mczfcgTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "末次支付成功时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("sczfthTime") != null) {
					String sczfthTime = ((String) map.get("sczfthTime")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(sczfthTime);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "首次支付退回时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				if (map.get("jasj") != null) {
					String jasj = ((String) map.get("jasj")).replaceAll("/", "-");
					boolean dateFlag = DateUtil.verifyDate(jasj);
					if (!dateFlag) {
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", (Integer)map.get("rowNumber"));
						errorMap.put("errorString", "结案时间格式错误");
						errorMessage.add(errorMap);
						iter.remove();
						continue;
					}
				}
				String jaje = (String) map.get("jaje");
				if(!StringUtil.isNumeric(jaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "结案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String csjaje = (String) map.get("csjaje");
				if(!StringUtil.isNumeric(csjaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "车损结案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String rsjaje = (String) map.get("rsjaje");
				if(!StringUtil.isNumeric(rsjaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "人伤结案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String wsjaje = (String) map.get("wsjaje");
				if(!StringUtil.isNumeric(wsjaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "物损结案金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String pfcs = (String) map.get("pfcs");
				if(!StringUtil.isNumeric(pfcs)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "赔付次数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String wjje = (String) map.get("wjje");
				if(!StringUtil.isNumeric(wjje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "未决金额只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String yeqxfsckrwls = (String) map.get("yeqxfsckrwls");
				if(!StringUtil.isNumeric(yeqxfsckrwls)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "有E权限发送查勘任务流数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String elpfsckrwls = (String) map.get("elpfsckrwls");
				if(!StringUtil.isNumeric(elpfsckrwls)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "E理赔发送查勘任务流数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String fscsdsrwls = (String) map.get("fscsdsrwls");
				if(!StringUtil.isNumeric(fscsdsrwls)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "发送车损定损任务流数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String yeqxfsdsrwls = (String) map.get("yeqxfsdsrwls");
				if(!StringUtil.isNumeric(yeqxfsdsrwls)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "有E权限发送定损任务流数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String elpfsdsrwls = (String) map.get("elpfsdsrwls");
				if(!StringUtil.isNumeric(elpfsdsrwls)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "E理赔发送定损任务流数只能为数字");
					errorMessage.add(errorMap);
					iter.remove();
					continue;
				}
				String zaje = (String) map.get("zaje");
				if(!StringUtil.isNumeric(zaje)){
					Map<String, Object> errorMap = new HashMap<>();
					errorMap.put("errorRow", (Integer)map.get("rowNumber"));
					errorMap.put("errorString", "整案金额只能为数字");
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
				if ((i + 1) % PUSH_MAINTENANCE_IMPORT_SIZE == 0 || i == records.size() - 1) {
					try{
						pushMaintenanceService.saveImportPushMaintenance(tempList);
						logger.info("成功导入" + (i+1) +"条推送修数据");
					}catch(Exception e){
						logger.error("第"+ (i+1) +"条推送修数据导入失败,程序异常!", e);
						Map<String, Object> errorMap = new HashMap<>();
						errorMap.put("errorRow", recordMap.get("rowNumber"));
						errorMap.put("errorString", "数据异常");
						errorMessage.add(errorMap);
					}finally{
						tempList.clear();
					}
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
	 * 台帐的推送修查询
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/findTzPushMaintenance",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTzPushMaintenance(@RequestParam(name="storeId") String storeId,
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
			Integer startNum = (Integer) param.get("startNum");
			if(startNum==null||startNum<1){
				startNum = 1;
			}
			param.put("start", (startNum - 1) * ConstantUtil.pageSize);
			param.put("pageSize", ConstantUtil.pageSize);
			List<Map<String, Object>> lists = pushMaintenanceService.findTzPushMaintenance(param);
			Map<String, Object> maintainCountAndCostSum = pushMaintenanceService.findTzMaintainCountAndCostSum(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", lists);
			rs.addContent("maintainCountAndCostSum", maintainCountAndCostSum);
			return rs; 
		} catch (Exception e) {
			logger.error("台帐的推送修查询失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询失败");
			return rs; 
		}
	}
}
