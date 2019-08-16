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

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.po.CarBrand;
import com.bofide.bip.po.CarModel;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.InsuranceType;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.AdminService;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.bip.vo.UserVo;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONUtils;

@Controller
@RequestMapping(value = "/admin")
public class AdminController  extends BaseResponse {
	
	private static Logger logger = Logger.getLogger(UserController.class);
	@Autowired
	private AdminService adminService;
	@Autowired
	private UserService userService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private CommonService commonService;
	/**
	 * 新增险种
	 * @return 
	 */
	@RequestMapping(value="/addInsuranceType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addInsuranceType(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String typeInfoJson = request.getParameter("typeInfo");
		if(StringUtils.isEmpty(typeInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("险种信息为空,新增险种失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject typeInfoJsonObj = JSONObject.fromObject(typeInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			InsuranceType insuranceType = (InsuranceType)JSONObject
					.toBean(typeInfoJsonObj,InsuranceType.class);
			//调用service新增险种
			int typeId = adminService.insertInsuranceType(insuranceType);
			if(typeId == -1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增险种失败,该险种已存在");
				logger.info("新增险种失败，该险种已存在");
			}else{
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("typeId", typeId);
				rs.setMessage("新增险种信息成功");
			}
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增险种失败,程序异常");
			logger.info("新增险种失败，程序异常:", e);
			return rs; 
		}
		
	}
	
	/**
	 * 删除险种
	 * @return 
	 */
	@RequestMapping(value="/deleteInsuranceType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteInsuranceType(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String typeIdStr = request.getParameter("typeId");
		if(StringUtils.isEmpty(typeIdStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("险种id为空,删除险种失败!");
			return rs; 
		}
		try {
			Integer typeId = Integer.parseInt(typeIdStr);
			//调用service删除险种
			adminService.deleteInsuranceType(typeId);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除险种失败,程序异常");
			logger.info("删除险种失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("删除险种信息成功");
		return rs; 
	}
	
	/**
	 * 查询险种
	 * @return 
	 */
	@RequestMapping(value="/findInsuranceType",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInsuranceType(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			//调用service查询险种
			Map<String, Object> map = new HashMap<String, Object>();
			List<InsuranceType> typeList = adminService.findInsuranceType(map);
			map.put("deleted", 0);
			List<InsuranceType> typeList1 = adminService.findInsuranceType(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", typeList);
			rs.addContent("result1", typeList1);
			rs.setMessage("查询险种信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询险种失败,程序异常");
			logger.info("查询险种失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 新增保险公司
	 * @return 
	 */
	@RequestMapping(value="/addInsuranceComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addInsuranceComp(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String companyInfoJson = request.getParameter("companyInfo");
		if(StringUtils.isEmpty(companyInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保险公司信息为空,新增保险公司失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject companyInfoJsonObj = JSONObject.fromObject(companyInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			InsuranceComp company = (InsuranceComp)JSONObject
					.toBean(companyInfoJsonObj,InsuranceComp.class);
			//调用service新增保险公司
			int insuranceCompId = adminService.insertInsuranceComp(company);
			if(insuranceCompId != -1){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("insuranceCompId",insuranceCompId);
				rs.setMessage("新增保险公司信息成功");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增保险公司失败,该保险公司已存在");
				logger.info("新增保险公司失败,该保险公司已存在");
			}
			
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增保险公司失败,程序异常");
			logger.info("新增保险公司失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 删除保险公司
	 * @return 
	 */
	@RequestMapping(value="/deleteInsuranceComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteInsuranceComp(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String insuranceCompIdStr = request.getParameter("insuranceCompId");
		if(StringUtils.isEmpty(insuranceCompIdStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保险公司id为空,删除保险公司失败!");
			return rs; 
		}
		try {
			Integer insuranceCompId = Integer.parseInt(insuranceCompIdStr);
			//调用service删除保险公司
			adminService.deleteInsuranceComp(insuranceCompId);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除保险公司失败,程序异常");
			logger.info("删除保险公司失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("删除保险公司信息成功");
		return rs; 
	}
	
	/**
	 * 查询保险公司
	 * @return 
	 */
	@RequestMapping(value="/findInsuranceComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInsuranceComp(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			//调用service查询保险公司
			List<InsuranceComp> companyList = adminService.findInsuranceComp();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", companyList);
			rs.setMessage("查询保险公司信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询保险公司失败,程序异常");
			logger.info("查询保险公司失败,程序异常", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 修改保险公司(险种)
	 * @return 
	 */
	@RequestMapping(value="/updateInsuranceComp",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateInsuranceComp(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String companyInfoJson = request.getParameter("companyInfo");
		if(StringUtils.isEmpty(companyInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("保险公司信息为空,修改保险公司失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject companyInfoJsonObj = JSONObject.fromObject(companyInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			InsuranceComp company = (InsuranceComp)JSONObject
					.toBean(companyInfoJsonObj,InsuranceComp.class);
			//调用service修改保险公司
			adminService.updateInsuranceComp(company);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改保险公司失败,程序异常");
			logger.info("修改保险公司失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("修改保险公司信息成功");
		return rs; 
	}
	
	/**
	 * 新增4S店
	 * @return 
	 */
	@RequestMapping(value="/addStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String storeInfoJson = request.getParameter("storeInfo");
		if(StringUtils.isEmpty(storeInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("4S店信息为空,新增4S店失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject storeInfoJsonObj = JSONObject.fromObject(storeInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			Store store = (Store)JSONObject.toBean(storeInfoJsonObj,Store.class);
			//调用service新增4S店
			Integer storeId = adminService.insertStore(store);
			if(storeId != -1){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("storeId", storeId);
				rs.setMessage("新增4S店信息成功");
				return rs; 
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增4S店信息失败,店名缩写与其他店重复或被集团缩写名使用");
				return rs; 
			}
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增4S店失败,程序异常");
			logger.info("新增4S店失败,程序异常:", e);
			return rs; 
		}
		
		
	}
	
	/**
	 * 删除4S店(软删除)
	 * @return 
	 */
	@RequestMapping(value="/deleteStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String storeIdStr = request.getParameter("storeId");
		if(StringUtils.isEmpty(storeIdStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("4S店id为空,删除4S店失败!");
			return rs; 
		}
		try {
			Integer storeId = Integer.parseInt(storeIdStr);
			//调用service删除4S店
			adminService.deleteStore(storeId);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除4S店失败,程序异常");
			logger.info("删除4S店失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("删除4S店信息成功");
		return rs; 
	}
	
	/**
	 * 查询4S店
	 * @return 
	 */
	@RequestMapping(value="/findStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			String jtId = request.getParameter("jtId");
			String unitId = request.getParameter("unitId");
			String userId = request.getParameter("userId");
			String roleId = request.getParameter("roleId");
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			if(unitId!=null&&unitId.length()>0){
				param.put("unitId", Integer.parseInt(unitId));
			}else if(jtId!=null&&jtId.length()>0){
				param.put("jtId", Integer.parseInt(jtId));
			}
			if(roleId!=null&&roleId.equals("23")){
				param.put("dataAnalystId", Integer.parseInt(userId));
			}
			//调用service查询4S店
			List<Store> storeList = adminService.findStore(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", storeList);
			rs.setMessage("查询4S店信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询4S店失败,程序异常");
			logger.info("查询4S店失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 修改4S店
	 * @return 
	 */
	@RequestMapping(value="/updateStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String storeInfoJson = request.getParameter("storeInfo");
		if(StringUtils.isEmpty(storeInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("4S店信息为空,修改4S店失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject storeInfoJsonObj = JSONObject.fromObject(storeInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			Store store = (Store)JSONObject.toBean(storeInfoJsonObj,Store.class);
			//调用service修改4S店
			adminService.updateStore(store);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改4s店成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增4S店失败,程序异常");
			logger.info("新增4S店失败,程序异常:", e);
			return rs; 
		}
		
		return rs; 
	}

	/**
	 * 新增汽车品牌
	 * @return 
	 */
	@RequestMapping(value="/addCarBrand",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addCarBrand(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String carBrandInfoJson = request.getParameter("carBrandInfo");
		if(StringUtils.isEmpty(carBrandInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("汽车品牌信息为空,新增汽车品牌失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject carBrandInfoJsonObj = JSONObject.fromObject(carBrandInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			CarBrand carBrand = (CarBrand)JSONObject
					.toBean(carBrandInfoJsonObj,CarBrand.class);
			//调用service新增汽车品牌
			int brandId = adminService.insertCarBrand(carBrand);
			if(brandId > 0){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("brandId", brandId);
				rs.setMessage("新增汽车品牌信息成功");
				return rs; 
			}else{
				if(brandId == -1){
					rs.setMessage("新增汽车品牌失败,品牌名称已存在");
				}else{
					rs.setMessage("新增汽车品牌失败,厂家信息为空");
				}
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				return rs; 
			}
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增汽车品牌失败,程序异常");
			logger.info("新增汽车品牌失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 修改汽车品牌
	 * @return 
	 */
	@RequestMapping(value="/updateCarBrand",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateCarBrand(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String carBrandInfoJson = request.getParameter("carBrandInfo");
		if(StringUtils.isEmpty(carBrandInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("汽车品牌信息为空,修改汽车品牌失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject carBrandInfoJsonObj = JSONObject.fromObject(carBrandInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			CarBrand carBrand = (CarBrand)JSONObject
					.toBean(carBrandInfoJsonObj,CarBrand.class);
			if(carBrand.getVenderId()==null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("厂家信息为空,修改汽车品牌失败!");
				return rs;
			}
			//调用service修改汽车品牌
			adminService.updateCarBrand(carBrand);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改汽车品牌成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改汽车品牌失败,程序异常"+e);
			logger.info("修改汽车品牌失败,程序异常:", e);
			return rs; 
		}
		
		return rs; 
	}
	
	/**
	 * 删除汽车品牌
	 * @return 
	 */
	@RequestMapping(value="/deleteCarBrand",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteCarBrand(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String brandIdStr = request.getParameter("brandId");
		if(StringUtils.isEmpty(brandIdStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("汽车品牌id为空,删除汽车品牌失败!");
			return rs; 
		}
		try {
			Integer brandId = Integer.parseInt(brandIdStr);
			//调用service删除汽车品牌
			adminService.deleteCarBrand(brandId);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除汽车品牌失败,程序异常");
			logger.info("删除汽车品牌失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("删除汽车品牌信息成功");
		return rs; 
	}
	
	
	/**
	 * 查询汽车品牌
	 * @return 
	 */
	@RequestMapping(value="/findCarBrand",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCarBrand(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//调用service查询汽车品牌
			List<CarBrand> carBrandList = adminService.findCarBrand(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", carBrandList);
			rs.setMessage("查询汽车品牌信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询汽车品牌失败,程序异常");
			logger.info("查询汽车品牌失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 新增汽车型号
	 * @return 
	 */
	@RequestMapping(value="/addCarModel",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse addCarModel(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String carModelInfoJson = request.getParameter("carModelInfo");
		if(StringUtils.isEmpty(carModelInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("汽车型号信息为空,新增汽车型号失败!");
			return rs; 
		}
		try {
			//保单Json转java对象
			JSONObject carModelInfoJsonObj = JSONObject.fromObject(carModelInfoJson);
			JSONUtils.getMorpherRegistry().registerMorpher(
					new DateMorpher(new String[]{"yyyy-MM-dd"}));
			CarModel carModel = (CarModel)JSONObject
					.toBean(carModelInfoJsonObj,CarModel.class);
			//调用service新增汽车型号
			Integer modelId = adminService.insertCarModel(carModel);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("modelId", modelId);
			rs.setMessage("新增汽车型号信息成功");
			return rs; 
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增汽车型号失败,程序异常");
			logger.info("新增汽车型号失败,程序异常:", e);
			return rs; 
		}
		
	}
	
	/**
	 * 删除汽车型号
	 * @return 
	 */
	@RequestMapping(value="/deleteCarModel",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteCarModel(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String modelIdStr = request.getParameter("modelId");
		if(StringUtils.isEmpty(modelIdStr)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("汽车型号id为空,删除汽车型号失败!");
			return rs; 
		}
		try {
			Integer modelId = Integer.parseInt(modelIdStr);
			//调用service删除汽车型号
			adminService.deleteCarModel(modelId);
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除汽车型号失败,程序异常");
			logger.info("删除汽车型号失败,程序异常:", e);
			return rs; 
		}
		
		rs.setSuccess(true);
		rs.addContent("status", "OK");
		rs.setMessage("删除汽车型号信息成功");
		return rs; 
	}
	
	/**
	 * 查询汽车型号
	 * @return 
	 */
	@RequestMapping(value="/findCarModel",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCarModel(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String brandIdStr = request.getParameter("brandId");
		if(StringUtils.isEmpty(brandIdStr)){
			brandIdStr = "-1";
		}
		try {
			Integer brandId = Integer.parseInt(brandIdStr);
			//调用service查询汽车型号
			List<Map> carModelList = adminService.findCarModel(brandId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", carModelList);
			rs.setMessage("查询汽车型号信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询汽车型号失败,程序异常");
			logger.info("查询汽车型号失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 查询4S店汽车品牌及型号
	 * @return 
	 */
	@RequestMapping(value="/findCarInfoByStoreId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCarInfoByStoreId(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		
		try {
			//调用service查询汽车型号
			List<CarBrand> carBrandList = adminService.findCarBrandAndModel(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", carBrandList);
			rs.setMessage("查询汽车信息成功");
			
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询汽车失败,程序异常");
			logger.info("查询汽车失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	
	/**
	 * 格式化店的所有数据,初始化店数据
	 * @param storeId
	 * @return
	 */
	@RequestMapping(value="/formatStoreById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse formatStoreById(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="loginName") String loginName,
			@RequestParam(name="password") String password){
		BaseResponse rs = new BaseResponse();
		try {
			if(storeId == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("店的id为空，参数有异常！");
				return rs;
			}
			//校验该用户是否存在并且是否该店的续保主管，如果该用户不存在返回不存在，如果该用户不是续保主管返回没有权限
			UserVo userVo = userService.selectUserInfo(loginName, password);
			if(userVo == null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("提供的信息有误，请重试！");
			}else{
				Integer storeId2 = userVo.getStore().getStoreId();
				if(storeId.intValue() != storeId2.intValue()){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("该店不存在该用户，请重试！");
				}else{
					Integer roleId = userVo.getRole().getRoleId();
					if(roleId == RoleType.XBZG){
						adminService.updateFormatStoreById(storeId);
						rs.setSuccess(true);
						rs.addContent("status", "OK");
					}else{
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("提供的用户没有权限操作，请重试！");
					}
				}
			}
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("格式化该店数据失败");
			logger.info("格式化该店数据失败,程序异常:", e);
			return rs; 
		}

		return rs; 
	}
	
	/**
	 * 按品牌名称首字母大小排序查询所有品牌
	 * @return 
	 */
	@RequestMapping(value="/findCarBrandByOrder",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findCarBrandByOrder(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			String condition = request.getParameter("condition");
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			
			List<CarBrand> carBrandList = adminService.findCarBrandByOrder(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", carBrandList);
			rs.setMessage("查询汽车品牌成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询汽车品牌失败,程序异常");
			logger.info("查询汽车品牌失败,程序异常:", e);
			return rs; 
		}
	}
	
	
	/**
	 * 按条件校验4s店的信息是否存在, true表示存在, false表示不存在
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/findExistStoreByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findExistStoreByCondition(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			
			boolean existFlag = adminService.findExistStoreByCondition(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", existFlag);
			rs.setMessage("校验店信息成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("校验店信息失败,程序异常");
			logger.info("校验店信息失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 根据险种ID查询险种
	 * @param typeId
	 * @return
	 */
	@RequestMapping(value="/findInsuByTypeId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findInsuByTypeId(@RequestParam(name="typeId") Integer typeId){
		BaseResponse rs = new BaseResponse();
		try {
			InsuranceType insuranceType = adminService.findInsuByTypeId(typeId);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", insuranceType);
			rs.setMessage("根据险种ID查询险种成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据险种ID查询险种失败,程序异常");
			logger.info("根据险种ID查询险种失败,程序异常:", e);
			return rs; 
		}
	}
	
	/**
	 * 修改险种
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/updateInsu",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateInsu(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer typeId = (Integer)param.get("typeId");
			if(typeId!=null){
				adminService.updateInsu(param);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("编辑险种成功");
				return rs;
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("险种ID为空，编辑险种失败！");
				return rs; 
			}
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("编辑险种失败,程序异常");
			logger.info("编辑险种失败,程序异常:", e);
			return rs; 
		}
	}
	/**
	 * 营销短信充值
	 * @return 
	 */
	@RequestMapping(value="/messageRecharge",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse messageRecharge(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String storeInfoJson = request.getParameter("storeInfo");
		if(StringUtils.isEmpty(storeInfoJson)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("充值失败!");
			return rs; 
		}
		try {
			JSONObject storeInfoJsonObj = JSONObject.fromObject(storeInfoJson);
			Integer storeId = Integer.valueOf(storeInfoJsonObj.get("storeId").toString());
			String rechargeBalance = storeInfoJsonObj.get("rechargeBalance").toString();
			Store store = storeService.findStoreById(storeId);
			double messageB = store.getMessageBalance();//余额
			double recharge = Double.valueOf(rechargeBalance);//充值金额
			double messageBalance = messageB+recharge;
			store.setMessageBalance(messageBalance);
			//调用service修改充值金额
			adminService.messageRecharge(store);
			Store sto = storeService.findStoreById(storeId);
			double messageBalanceHou = sto.getMessageBalance();
			//充值后，发送系统通知
			String content = "【营销短信提示】您好！短信已充值"+recharge+"元，余额为："+messageBalance+"元，此功能可正常使用！";
			commonService.insertSystemMessageMarket(content,storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", messageBalanceHou);
			rs.setMessage("充值成功！");
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("充值失败,程序异常");
			logger.info("充值失败,程序异常:", e);
			return rs; 
		}
		
		return rs; 
	}
}
