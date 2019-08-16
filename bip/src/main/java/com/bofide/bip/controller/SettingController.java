package com.bofide.bip.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.po.Factorage;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.SettingService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.common.util.BaseResponse;

import net.sf.json.JSONArray;
@Controller
@RequestMapping(value = "/setting")
public class SettingController {
	private static Logger logger = Logger.getLogger(SettingController.class);
	@Autowired
	private SettingService settingService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private UserService userService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private CustomerService customerService;
	/**
	 * 初始化界面
	 */
	@RequestMapping(value = "/initInsuranceComp", method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse initInsuranceComp (@RequestParam(name="fourSId") Integer fourSId){
		BaseResponse rs = new BaseResponse();
		List<Map<String,Object>> list = null;
		
		try {
			//初始化保险公司相关信息
			list = settingService.initiInsuranceComp(fourSId);
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询保险公司失败,程序异常:"+e.getMessage());
		}
		rs.addContent("list", list);
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs;
	}
	
	/**
	 * 更新已选中的保险公司
	 */
	@RequestMapping(value = "/updateInsuranceComp", method = {RequestMethod.POST})
	@ResponseBody
	public BaseResponse updateInsuranceComp(@RequestParam(name="insuranceCompIds") String insuranceCompIds,@RequestParam(name="fourSId") Integer fourSId){
		BaseResponse rs = new BaseResponse();
		
		if(StringUtils.isEmpty(insuranceCompIds) && fourSId == null){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保险公司信息为空,新增保险公司失败!");
		}else{
			try {
				JSONArray jsonarray = JSONArray.fromObject(insuranceCompIds);
				List<Integer> listId = (List<Integer>)JSONArray.toCollection(jsonarray, Integer.class);
				settingService.updateInsuranceStatu(listId,fourSId);
			} catch (Exception e) {
				logger.error(e);
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("保存保险公司信息失败,程序异常:"+e.getMessage());
			}
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		}
		return rs;
	}
	
	/**
	 * 查询该4s店的所有保险公司
	 */
	@RequestMapping(value = "/findByFourSId", method = {RequestMethod.POST})
	@ResponseBody
	public BaseResponse findByFourSId(@RequestParam(name="fourSId") Integer fourSId){
		BaseResponse rs = new BaseResponse();
		List<Map<String,Object>> listFourS = null;
		if(fourSId == null){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保险公司信息为空,新增保险公司失败!");
		}else{
			try {
				listFourS = settingService.findByFourSId(fourSId);
			} catch (Exception e) {
				logger.error(e);
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("保存保险公司信息失败,程序异常:"+e.getMessage());
			}
			rs.addContent("list", listFourS);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		}
		return rs;
	}
	
	/**
	 * 险种设置
	 */
	@RequestMapping(value = "/setbInsuranceType",method = {RequestMethod.POST})
	@ResponseBody
	public BaseResponse setbInsuranceType(@RequestParam(name="insuranceCompId") Integer insuranceCompId, @RequestParam(name="bInsuranceType") String bInsuranceType){
		BaseResponse rs = new BaseResponse();
		settingService.addInsuranceType(insuranceCompId,bInsuranceType);
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs;
	}
	
	
	/**
	 * 客户级别设置
	 * 
	 */
	@RequestMapping(value = "/setCustomerLevel", method = {RequestMethod.POST})
	@ResponseBody
	public BaseResponse setCustomerLevel(@RequestParam(name="dateNumbers") String dateNumbers,@RequestParam(name="levelId") Integer levelId){
		BaseResponse rs = new BaseResponse();
		/*settingService.setCustomerLevel();*/
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		return rs;
	}
	
	/**

	 * 查询模块开启设置
	 * @return 
	 */
	@RequestMapping(value="/findModuleSet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findModuleSet(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//查询模块开启设置
			List<ModuleSet> moduleSetList = settingService.findModileSet(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", moduleSetList);
			rs.setMessage("查询模块开启设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询模块开启设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	/**

	 * 查询级别跟踪天数设置
	 * @return 
	 */
	@RequestMapping(value="/findTraceDaySet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTraceDaySet(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//查询级别跟踪天数设置
			List<TraceDaySet> traceDaySetList = settingService.findTraceDaySet(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", traceDaySetList);
			rs.setMessage("查询级别跟踪天数设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询级别跟踪天数设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	/**

	 * 更新模块开启设置
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/updateModuleSet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateModuleSet(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取模块开启设置信息
		String moduleSetInfoStr = request.getParameter("moduleSetInfo");
		if(StringUtils.isEmpty(moduleSetInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("模块开启设置信息为空,更新模块开启设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(moduleSetInfoStr);
		List<ModuleSet> moduleSetList = (List<ModuleSet>)JSONArray.toCollection(jsonarray, ModuleSet.class);
		
		try {
			for (ModuleSet moduleSet : moduleSetList) {
				// 对客服模块开关变化做校验
				if ("csModule".equals(moduleSet.getModuleName())) {
					Integer storeId = moduleSet.getFourSStoreId();
					Store store = storeService.findStoreById(storeId);
					// 检测客服模块的开关是否变化
					if (!moduleSet.getSwitchOn().equals(store.getCsModuleFlag())) {
						// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
						if (moduleSet.getSwitchOn() == 0) {
							//由于需要转移战败线索,需要校验用户是否存在或者状态是否正常, 如果关闭客服,需要校验续保专员
							boolean flag = userService.findExistUserByRole(storeId, 2);
							if(flag == false){
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("客服模块设置失败,没有续保专员可接收客服专员转移的战败线索,请确保续保专员存在或者状态正常");
								return rs;
							}
							Map<String, Object> param = new HashMap<String, Object>();
							param.put("roleId", 2);
							param.put("storeId", storeId);
							param.put("returnStatu", 3);
							// 检测续保主管是否存在专员的回退待审批业务
							int returnApproveNum = renewalingCustomerService.findCountByApprovalCategory(param);
							if (returnApproveNum > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("续保主管存在续保专员的回退待审批,无法禁用客服模块");
								return rs;
							}
							// 检测续保主管是否存在唤醒未分配业务
							param.put("returnStatu", 10);
							Integer hxwfps = customerService.findCountActivateCustomer(param);
							if (hxwfps != null && hxwfps > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("续保主管存在唤醒未分配的潜客,无法禁用客服模块");
								return rs;
							}
							// 检测客服专员是否持有潜客
							param.put("roleId", 5);
							int kfcyqks = renewalingCustomerService.countFindByRoleId(param);
							if (kfcyqks > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("客服专员存在未接收或待失效的潜客,请客服先处理这些潜客再禁用客服模块");
								return rs;
							}
						} else {
							//由于需要转移战败线索,需要校验用户是否存在或者状态是否正常, 如果打开客服,需要校验客服专员
							boolean flag = userService.findExistUserByRole(storeId, 5);
							if(flag == false){
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("客服模块设置失败,没有客服专员可接收续保专员转移的战败线索,请确保客服专员存在或者状态正常");
								return rs;
							}
							Map<String, Object> param = new HashMap<String, Object>();
							param.put("storeId", storeId);
							param.put("returnStatu3", 3);
							param.put("applyStatu", 1);
							// 检测续保主管是否存在失销待审批业务
							int sxdsps = customerService.findByApprovalCount(param);
							if (sxdsps > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("续保主管存在失销待审批的潜客，无法启用客服模块");
								return rs;
							}
							// 检测续保主管是否存在睡眠待审批业务
							param.put("applyStatu", 2);
							int smdsps = customerService.findByApprovalCount(param);
							if (smdsps > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("续保主管存在睡眠待审批的潜客，无法启用客服模块");
								return rs;
							}
						}
					}
				}
				// 对出单员模块开关变化做校验
				if ("asmModule".equals(moduleSet.getModuleName())) {
					Integer storeId = moduleSet.getFourSStoreId();
					Store store = storeService.findStoreById(storeId);
					// 检测出单员模块的开关是否变化
					if (!moduleSet.getSwitchOn().equals(store.getAsmModuleFlag())) {
						// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
						if (moduleSet.getSwitchOn() == 0) {
							//由于需要转移战败线索,需要校验用户是否存在或者状态是否正常, 如果关闭客服,需要校验续保专员
							boolean flag = userService.findExistUserByRole(storeId, 2);
							if(flag == false){
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("出单员模块设置失败,请确保续保专员存在或者状态正常");
								return rs;
							}
							Map<String, Object> param = new HashMap<String, Object>();
							param.put("storeId", storeId);
							// 检测出单员是否存在，若存在，先删除
							int cdyCount = userService.findCountByUserCdy(param);
							if (cdyCount > 0) {
								rs.setSuccess(false);
								rs.addContent("status", "BAD");
								rs.setMessage("无法禁用出单员模块,请先联系AM管理员删除出单员");
								return rs;
							}
						} 
					}
				}
			}
			
			//更新模块开启设置
			settingService.updateModuleSet(moduleSetList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("更新模块开启设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新模块开启设置信息失败,程序异常");
			return rs; 
		}
		return rs;
	}
	
	/**

	 * 更新级别跟踪天数设置
	 * @return 
	 */
	@RequestMapping(value="/updateTraceDaySet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateTraceDaySet(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取级别跟踪天数设置
		String traceDaySetInfoStr = request.getParameter("traceDaySetInfo");
		if(StringUtils.isEmpty(traceDaySetInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("级别跟踪天数设置为空,更新级别跟踪天数设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(traceDaySetInfoStr);
		List<TraceDaySet> traceDaySetList = (List<TraceDaySet>)JSONArray.toCollection(jsonarray, TraceDaySet.class);  
		try {
			//更新级别跟踪天数设置
			settingService.updateTraceDaySet(traceDaySetList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("更新级别跟踪天数设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新级别跟踪天数设置失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 * 查询手续费设置
	 * @return 
	 */
	@RequestMapping(value="/findFactorage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findFactorage(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="compPreId") Integer compPreId){
		BaseResponse rs = new BaseResponse();
		
		try {
			//查询手续费设置
			List<Factorage>  factorageList = settingService.findFactorage(compPreId, storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", factorageList);
			rs.setMessage("查询手续费设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询手续费设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	/**

	 * 更新手续费设置
	 * @return 
	 */
	@RequestMapping(value="/updateFactorage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateFactorage(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取手续费设置信息
		String factorageInfoStr = request.getParameter("factorageInfo");
		Integer userId = Integer.valueOf(request.getParameter("userId"));
		String userName = request.getParameter("userName");
		if(StringUtils.isEmpty(factorageInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手续费设置信息为空,更新手续费设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(factorageInfoStr);
		List<Factorage> factorageList = (List<Factorage>)JSONArray.toCollection(jsonarray, Factorage.class);
		try {
			//更新手续费设置信息
			settingService.updateFactorage(factorageList,userId,userName);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("更新手续费设置信息成功");
			
		} catch (Exception e) {
			logger.error("更新手续费设置信息失败,程序异常:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新手续费设置信息失败");
			return rs; 
		}
		return rs;
	}
	
	/**

	 *保存手续费设置
	 * @return 
	 */
	@RequestMapping(value="/insertFactorage",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insertFactorage(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取手续费设置信息
		String factorageInfoStr = request.getParameter("factorageInfo");
		if(StringUtils.isEmpty(factorageInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("手续费设置信息为空,更新手续费设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(factorageInfoStr);
		List<Factorage> factorageList = (List<Factorage>)JSONArray.toCollection(jsonarray, Factorage.class);  
		try {
			//保存手续费设置信息
			settingService.insertFactorage(factorageList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("保存手续费设置信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存手续费设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 *保存模块开启设置
	 * @return 
	 */
	@RequestMapping(value="/insertModuleSet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insertModuleSet(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取模块开启设置信息信息
		String moduleSetInfo = request.getParameter("moduleSetInfo");
		if(StringUtils.isEmpty(moduleSetInfo)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("模块开启设置信息为空,更新模块开启设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(moduleSetInfo);
		List<ModuleSet> moduleSetList = (List<ModuleSet>)JSONArray.toCollection(jsonarray, ModuleSet.class);  
		try {
			//保存手续费设置信息
			settingService.insertModuleSet(moduleSetList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("保存模块开启设置信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存模块开启设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 *保存级别跟踪天数设置
	 * @return 
	 */
	@RequestMapping(value="/insertTraceDaySet",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse insertTraceDaySet(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		//获取级别跟踪天数设置信息
		String traceDaySetInfoStr = request.getParameter("traceDaySetInfo");
		if(StringUtils.isEmpty(traceDaySetInfoStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("级别跟踪天数设置信息为空,更新级别跟踪天数设置失败!");
			return rs; 
		}
		JSONArray jsonarray = JSONArray.fromObject(traceDaySetInfoStr);
		List<TraceDaySet> traceDayList = (List<TraceDaySet>)JSONArray.toCollection(jsonarray, TraceDaySet.class);  
		try {
			//保存手续费设置信息
			settingService.insertTraceDaySet(traceDayList);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("保存级别跟踪天数设置信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保存级别跟踪天数设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 * 根据4s店id查询保险公司信息
	 * @return 
	 */
	@RequestMapping(value="/findCompInfoByStoreId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCompInfoByStoreId(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		
		try {
			//查询保险公司信息
			List<InsuranceComp> companys = settingService.findCompInfoByStoreId(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", companys);
			rs.setMessage("查询手续费设置成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询手续费设置信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	
	/**
	 * 总经理设置锁死客户级别
	 * @return 
	 */
	@RequestMapping(value="/updateStoreLockLevel",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateStoreLockLevel(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="lockLevel") Integer lockLevel){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			map.put("lockLevel", lockLevel);
			settingService.updateStoreLockLevel(map);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("级别锁死成功");
			return rs;
		} catch (Exception e) {
			logger.error("级别锁死失败:",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("级别锁死失败");
			return rs; 
		}
	}	
}
