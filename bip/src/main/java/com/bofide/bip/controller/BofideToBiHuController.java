package com.bofide.bip.controller;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.po.CustomerBJRecode;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.AdminService;
import com.bofide.bip.service.BiHuService;
import com.bofide.bip.service.CustomerService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.DateUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/bofideToBiHu")
public class BofideToBiHuController extends BaseResponse {
	private static Logger logger = Logger.getLogger(BofideToBiHuController.class);
	@Autowired
	private BiHuService biHuService;
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private AdminService adminService;
	
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;

	/**
	 * 申请报价
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/applyBJ",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse applyBJ(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Map<String, Object> resultMap = biHuService.applyBJ(param);
			if(resultMap.get("BusinessStatus")!=null&&!resultMap.get("BusinessStatus").equals(1)){
				rs.addContent("status", "BAD");
				rs.setSuccess(false);
				logger.info("报价失败！"+resultMap.get("StatusMessage"));
				rs.setMessage("报价失败！"+resultMap.get("StatusMessage"));
			}else{
				rs.addContent("status", "OK");
				rs.addContent("results", resultMap);
				rs.setSuccess(true);
				rs.setMessage("报价成功！");
			}
		} catch (Exception e) {
			logger.info("报价失败!不能查询到该车牌的相应信息，请换个车牌重试。",e);
			rs.addContent("status", "BAD");
			rs.setSuccess(false);
			rs.setMessage("报价失败！不能查询到该车牌的相应信息，请换个车牌重试。");
		}
		return rs;
	}
	
	/**
	 * 保存报价
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/saveBJ",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse saveBJ(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer result = biHuService.saveBJ(param);
			if(result.equals(0)){
				rs.addContent("status", "BAD");
				rs.setSuccess(false);
				logger.info("保存报价成功为0条");
				rs.setMessage("保存报价成功为0条！请确认报价金额是否大于0！");
			}else{
				param.put("time", DateUtil.dateJS90());
				List<CustomerBJRecode> lists = customerService.findBJListByCustomerId(param);
				rs.addContent("lists", lists);
				rs.addContent("status", "OK");
				rs.setSuccess(true);
				rs.setMessage("保存报价成功"+result+"条！");
			}
		} catch (Exception e) {
			logger.info("保存报价失败。",e);
			rs.addContent("status", "BAD");
			rs.setSuccess(false);
			rs.setMessage("保存报价失败。");
		}
		return rs;
	}
	
	/**
	 * 将博福报价返回的结果的结构转换成壁虎报价返回结果的结构,其中
	 *  博福的结构为:{
	 *                success:true,
	 *                data:[
	 *                  { "insuranceCompany": "cpic","data":{若干键值对} , success: true},
	 *                  { "insuranceCompany": "pingan","message":"错误提示" , success: false},
	 *                  ...
	 *                ]
	 *              }
	 *  壁虎的机构为:{
	 *                 xbInfo:{},
	 *                 bj:[
	 *                   {bJinfo:{},Item:{},applyBJ:{BusinessStatus:1, StatusMessage:"原因"},若干键值对},
	 *                   {bJinfo:{},Item:{},applyBJ:{BusinessStatus:1, StatusMessage:"原因"},若干键值对},
	 *                   ...
	 *                 ]
	 *              }
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	public Map<String,Object> convertFormat(List<Map<String,Object>> bxList,Map<String,Object> carInfoMap) throws Exception{
		Map<String,Object> resultMap = new HashMap<>();
		List<Map<String,Object>> bjList = new ArrayList<>();
		Map<String,Object> xbInfoMap = new HashMap<>();
		Map<String,Object> userInfoMap = new HashMap<>();
		for(int i=0;i<bxList.size();i++){
			Map<String,Object> bjMap = new HashMap<>();
			bjMap.put("sfhb", 0);
			bjMap.put("sfbj", 1);
			//获取博福接口返回的保险公司的报价结果
			Map<String,Object> map = bxList.get(i);
			//获取博福接口返回的保险公司
			String insuranceCompany = (String) map.get("insuranceCompany");
			List<InsuranceComp> insuraces = adminService.findInsuranceComp();
			for(int k=0;k<insuraces.size();k++){
				InsuranceComp insuranceComp = insuraces.get(k);
				if(insuranceComp.getInsuranceKey() != null){
					if(insuranceComp.getInsuranceKey().equals(insuranceCompany)){
						bjMap.put("insuranceCompName", insuranceComp.getInsuranceCompName());
						bjMap.put("source", insuranceComp.getSource());
					}
				}
			}
			Map<String,Object> applyBJMap = new HashMap<>();//applyBJ:{}
			Map<String,Object> bJinfoMap = new HashMap<>();//bJinfo:{}
			Map<String,Object> itemMap = new HashMap<>();// Item:{}
			//获取博福接口返回的成功标志
			boolean success = map.get("success")==null||"".equals(map.get("success"))? false: (boolean) map.get("success");
			if(!success){
				applyBJMap.put("BusinessStatus", -1);
				applyBJMap.put("StatusMessage", map.get("message"));
			}else{
				applyBJMap.put("BusinessStatus", 1);
				itemMap.put("QuoteStatus", 1);
			}
			bjMap.put("applyBJ", applyBJMap);
			//获取博福接口返回的报价信息
			Map<String,Object> dataMap = (Map<String, Object>) map.get("data");
			if(dataMap!=null){
				bjMap.put("totalPremium", dataMap.get("totalPremium"));
				userInfoMap.put("ModleName", dataMap.get("modelType"));//车型
				userInfoMap.put("LicenseNo", dataMap.get("plateNo"));//车牌号
				userInfoMap.put("CarVin", dataMap.get("carVIN"));//车架号
				//商险信息
				Map<String,Object> commercialInsuransVoMap = new HashMap<>();
				commercialInsuransVoMap = dataMap.get("commercialInsuransVo")==null||"".equals(dataMap.get("commercialInsuransVo"))?commercialInsuransVoMap: (Map<String, Object>) dataMap.get("commercialInsuransVo");
				String syxDateStr = (String) commercialInsuransVoMap.get("stStartDate");
				String syxDateStart = "".equals(syxDateStr)||syxDateStr==null? "":syxDateStr.substring(0, 10);
				userInfoMap.put("NextBusinessStartDate", syxDateStart);//商业开始日期
				String bizTotalStr = commercialInsuransVoMap.get("premium")==null||"".equals(commercialInsuransVoMap.get("premium"))?"0": commercialInsuransVoMap.get("premium").toString();
				String standardPremiumStr = commercialInsuransVoMap.get("standardPremium")==null||"".equals(commercialInsuransVoMap.get("standardPremium"))?"0": commercialInsuransVoMap.get("standardPremium").toString();
				//premiumRatio
				String premiumRatioStr = commercialInsuransVoMap.get("premiumRatio")==null||"".equals(commercialInsuransVoMap.get("premiumRatio"))?"0": commercialInsuransVoMap.get("premiumRatio").toString();
				String rateFactorStr1 = commercialInsuransVoMap.get("nonClaimDiscountRate")==null||"".equals(commercialInsuransVoMap.get("nonClaimDiscountRate"))?"0":commercialInsuransVoMap.get("nonClaimDiscountRate").toString();
				String rateFactorStr2 = commercialInsuransVoMap.get("channelRate")==null||"".equals(commercialInsuransVoMap.get("channelRate"))?"0":commercialInsuransVoMap.get("channelRate").toString();
				String rateFactorStr3 = commercialInsuransVoMap.get("underwritingRate")==null||"".equals(commercialInsuransVoMap.get("underwritingRate"))?"0":commercialInsuransVoMap.get("underwritingRate").toString();
				String rateFactorStr4 = commercialInsuransVoMap.get("trafficTransgressRate")==null||"".equals(commercialInsuransVoMap.get("trafficTransgressRate"))?"0":commercialInsuransVoMap.get("trafficTransgressRate").toString();
				double bizTotal = bizTotalStr==null? 0:Double.valueOf(bizTotalStr);
				double premiumRatio = premiumRatioStr==null? 0:Double.valueOf(premiumRatioStr);
				double rateFactor1 = rateFactorStr1==null? 0:Double.valueOf(rateFactorStr1);
				double rateFactor2 = rateFactorStr2==null? 0:Double.valueOf(rateFactorStr2);
				double rateFactor3 = rateFactorStr3==null? 0:Double.valueOf(rateFactorStr3);
				double rateFactor4 = rateFactorStr4==null? 0:Double.valueOf(rateFactorStr4);
				double standardPremium = standardPremiumStr==null? 0:Double.valueOf(standardPremiumStr);
				
				itemMap.put("BizTotal", bizTotal);
				itemMap.put("zhekou", premiumRatio);
				itemMap.put("RateFactor1", rateFactor1);
				itemMap.put("RateFactor2", rateFactor2);
				itemMap.put("RateFactor3", rateFactor3);
				itemMap.put("RateFactor4", rateFactor4);
				itemMap.put("standardPremium", standardPremium);//标准保费（不懂可以查看人保的标准保费什么）
				//交强信息
				Map<String,Object> compulsoryInsuransVoMap = new HashMap<>();
				compulsoryInsuransVoMap =  dataMap.get("compulsoryInsuransVo")==null||"".equals(dataMap.get("compulsoryInsuransVo"))?compulsoryInsuransVoMap: (Map<String, Object>) dataMap.get("compulsoryInsuransVo");
				String jqxDateStr = (String) compulsoryInsuransVoMap.get("stStartDate");
				String jqxDateStart = "".equals(jqxDateStr)||jqxDateStr==null? "":jqxDateStr.substring(0, 10);
				userInfoMap.put("NextForceStartDate", jqxDateStart);//交强开始日期
				String cipremiumStr = compulsoryInsuransVoMap.get("cipremium")==null||"".equals(compulsoryInsuransVoMap.get("cipremium"))?"0":compulsoryInsuransVoMap.get("cipremium").toString();
				String taxAmountStr = compulsoryInsuransVoMap.get("taxAmount")==null||"".equals(compulsoryInsuransVoMap.get("taxAmount"))?"0":compulsoryInsuransVoMap.get("taxAmount").toString();
				double cipremium = cipremiumStr==null? 0:Double.valueOf(cipremiumStr);
				double taxAmount = taxAmountStr==null? 0:Double.valueOf(taxAmountStr);
				itemMap.put("ForceTotal", cipremium);
				itemMap.put("TaxTotal", taxAmount);
				//险种组合
				List<Map<String,Object>> quoteInsuranceVosList = new ArrayList<>();
				quoteInsuranceVosList = dataMap.get("quoteInsuranceVos")==null||"".equals(dataMap.get("quoteInsuranceVos"))?quoteInsuranceVosList : (List<Map<String, Object>>) dataMap.get("quoteInsuranceVos");
				for(int j=0;j<quoteInsuranceVosList.size();j++){
					Map<String,Object> quoteInsuranceMap = quoteInsuranceVosList.get(j);
					String premiumStr = quoteInsuranceMap.get("premium")==null||"".equals(quoteInsuranceMap.get("premium"))?"0":quoteInsuranceMap.get("premium").toString();
					double premium = premiumStr==null? 0:Double.valueOf(premiumStr);//保费
					String insuranceCode = (String) quoteInsuranceMap.get("insuranceCode");
					Map<String,Object> bebfMap = new HashMap<>();
					Map<String,Object> bjmBebfMap = new HashMap<>();
					if("01".equals(insuranceCode)){//机动车损失保险
						String amount = quoteInsuranceMap.get("amount")==null||"".equals(quoteInsuranceMap.get("amount"))?"0":quoteInsuranceMap.get("amount").toString();
						bebfMap.put("BaoE", Double.valueOf(amount));
						bebfMap.put("BaoFei", premium);
						itemMap.put("CheSun", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianCheSun", bjmBebfMap);
						}
					}else if("02".equals(insuranceCode)){//机动车第三者责任保险
						bebfMap.put("BaoFei", premium);
						itemMap.put("SanZhe", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianSanZhe", bjmBebfMap);
						}
					}else if("03".equals(insuranceCode)){//机动车车上人员责任保险-司机
						bebfMap.put("BaoFei", premium);
						itemMap.put("SiJi", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianSiJi", bjmBebfMap);
						}
					}else if("04".equals(insuranceCode)){//机动车车上人员责任保险-乘客
						bebfMap.put("BaoFei", premium);
						itemMap.put("ChengKe", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianChengKe", bjmBebfMap);
						}
					}else if("05".equals(insuranceCode)){//机动车全车盗抢保险
						bebfMap.put("BaoFei", premium);
						itemMap.put("DaoQiang", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianDaoQiang", bjmBebfMap);
						}
					}else if("06".equals(insuranceCode)){//玻璃单独破碎险
						bebfMap.put("BaoFei", premium);
						itemMap.put("BoLi", bebfMap);
					}else if("07".equals(insuranceCode)){//自燃损失险
						bebfMap.put("BaoFei", premium);
						itemMap.put("ZiRan", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianZiRan", bjmBebfMap);
						}
					}else if("08".equals(insuranceCode)){//车身划痕损失险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HuaHen", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianHuaHen", bjmBebfMap);
						}
					}else if("09".equals(insuranceCode)){//发动机涉水损失险
						bebfMap.put("BaoFei", premium);
						itemMap.put("SheShui", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianSheShui", bjmBebfMap);
						}
					}else if("10".equals(insuranceCode)){//车上货物责任险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcHuoWuZeRen", bebfMap);
					}else if("11".equals(insuranceCode)){//精神损害抚慰金责任险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcJingShenSunShi", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BuJiMianJingShenSunShi", bjmBebfMap);
						}
					}else if("12".equals(insuranceCode)){//修理期间费用补偿险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcFeiYongBuChang", bebfMap);
					}else if("13".equals(insuranceCode)){//指定修理厂险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcXiuLiChang", bebfMap);
					}else if("14".equals(insuranceCode)){//机动车损失保险无法找到第三方特约险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcSanFangTeYue", bebfMap);
					}else if("15".equals(insuranceCode)){//新增设备损失险
						bebfMap.put("BaoFei", premium);
						itemMap.put("HcSheBeiSunshi", bebfMap);
						String nonDeductible = quoteInsuranceMap.get("nonDeductible")==null||"".equals(quoteInsuranceMap.get("nonDeductible"))?"0":quoteInsuranceMap.get("nonDeductible").toString();
						if(nonDeductible!=null){
							bjmBebfMap.put("BaoFei", Double.valueOf(nonDeductible));
							itemMap.put("BjmSheBeiSunShi", bjmBebfMap);
						}
					}
				}
			}
			
			bJinfoMap.put("Item", itemMap);
			bjMap.put("bJinfo", bJinfoMap);
			bjList.add(bjMap);
		}
		resultMap.put("bj", bjList);
		userInfoMap.put("ModleName", carInfoMap.get("modelType"));//车型号
		userInfoMap.put("LicenseNo", carInfoMap.get("vehicleLicenceCode"));//车牌号
		userInfoMap.put("CarVin", carInfoMap.get("vehicleFrameNo"));//车架号
		String insuranceEndTime = carInfoMap.get("insuranceEndTime") == null
				|| "".equals(carInfoMap.get("insuranceEndTime")) ? "" : carInfoMap.get("insuranceEndTime").toString();
		String businessEndTime = carInfoMap.get("businessEndTime") == null
				|| "".equals(carInfoMap.get("businessEndTime")) ? "" : carInfoMap.get("businessEndTime").toString();
		String currentTime = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		// 日期取值规则: 自己的规范就取自己的, 如果不规范就看别的, 别的规范就取别的, 别的不规范就取当前
		// 交险起保时间
		if ("".equals(insuranceEndTime)||currentTime.compareTo(insuranceEndTime) > 0) {
			if("".equals(businessEndTime)||currentTime.compareTo(businessEndTime) > 0){
				userInfoMap.put("NextForceStartDate", DateUtil.toString(DateUtil.ziding(new Date(),1)));
			}else{
				userInfoMap.put("NextForceStartDate", DateUtil.toString(DateUtil.ziding(DateUtil.toDate(businessEndTime),1)));
			}
		} else {
			userInfoMap.put("NextForceStartDate", DateUtil.toString(DateUtil.ziding(DateUtil.toDate(insuranceEndTime),1)));
		}
		// 商险起保时间
		if ("".equals(businessEndTime)||currentTime.compareTo(businessEndTime) > 0) {
			if("".equals(insuranceEndTime)||currentTime.compareTo(insuranceEndTime) > 0){
				userInfoMap.put("NextBusinessStartDate", DateUtil.toString(DateUtil.ziding(new Date(),1)));
			}else{
				userInfoMap.put("NextBusinessStartDate", DateUtil.toString(DateUtil.ziding(DateUtil.toDate(insuranceEndTime),1)));
			}
		} else {
			userInfoMap.put("NextBusinessStartDate", DateUtil.toString(DateUtil.ziding(DateUtil.toDate(businessEndTime),1)));
		}
		xbInfoMap.put("UserInfo", userInfoMap);
		resultMap.put("xbInfo", xbInfoMap);
		return resultMap;
	}
	
	/**
	 * 用bofide提供的接口报价
	 * @param condition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/applyBJFromBofide",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse applyBJFromBofide(@RequestParam(name="condition") String condition,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String bjType = param.get("bjType") == null ? "" : param.get("bjType").toString();
			//调用报价接口参数容器
			Map<String, Object> carInfoMap = new HashMap<>();
			if("1".equals(bjType)){
				//按(车牌号)|(车架号+发动机)|三者一起报价
				Map<String,Object> argsMap = new HashMap<String,Object>();
				argsMap.put("vehicleLicenceCode", (String)param.get("plateNo"));
				argsMap.put("vehicleFrameNo", (String)param.get("carVIN"));
				argsMap.put("engineNo", (String)param.get("engineNo"));
				argsMap.put("vin", "");
				argsMap.put("plateType", "02");
				Map<String, Object> carInfoResultMap = biHuService.getCarInfo(argsMap, storeId);
				
				boolean bo = (boolean)carInfoResultMap.get("success");
				if(bo){
					carInfoMap = (Map<String, Object>) carInfoResultMap.get("data");
					//企业非营业用车时，默认一以下字段为家庭自用车的字段
					if("301".equals(String.valueOf(carInfoMap.get("usage")))){
						carInfoMap.put("certType", "1");
						carInfoMap.put("taxCustomerType","1");
						carInfoMap.put("certificateType", "1");
						carInfoMap.put("taxpayerType", "1");
						carInfoMap.put("certificateCode", "");
						carInfoMap.put("taxpayerName", "");
						carInfoMap.put("certNo", "");
						carInfoMap.put("taxpayerNo", "");
					}
					String vehicleLicenceCode = carInfoMap.get("vehicleLicenceCode")==""||carInfoMap.get("vehicleLicenceCode")==null ? "" : carInfoMap.get("vehicleLicenceCode").toString();
					if("".equals(vehicleLicenceCode)){
						String plateNo = param.get("plateNo")==""||param.get("plateNo")==null ? "":param.get("plateNo").toString();
						if(!"".equals(plateNo)){
							carInfoMap.put("vehicleLicenceCode", plateNo);
						}
					}
					if(param.get("maturityDate")!=null){
						carInfoMap.put("insuranceEndTime", param.get("maturityDate"));
					}
					if(param.get("businessEndTime")!=null){
						carInfoMap.put("businessEndTime", param.get("businessEndTime"));
					}
					carInfoMap.put("compulsory", param.get("compulsory"));
					carInfoMap.put("commercial", param.get("commercial"));
					carInfoMap.put("insuranceCompanys", param.get("insuranceCompanys"));
					carInfoMap.put("quoteInsuranceVos", param.get("quoteInsuranceVos"));
					Map<String, Object> resultMap = biHuService.getBxPrice(carInfoMap,storeId);
					boolean boo = (boolean)resultMap.get("success");
					if(boo){
						List<Map<String, Object>> dates = (List<Map<String, Object>>)resultMap.get("data");
						if(dates.size() == 1 && !(boolean)(dates.get(0).get("success"))){
							rs.addContent("status", "BAD");
							rs.setSuccess(false);
							logger.info("报价失败！"+dates.get(0).get("message"));
							rs.setMessage("报价失败！"+dates.get(0).get("message"));
							return rs;
						}
						rs.addContent("status", "OK");
						rs.addContent("results", convertFormat(dates,carInfoMap));
						rs.setSuccess(true);
						rs.setMessage("报价成功！");
						
					}else{
						rs.addContent("status", "BAD");
						rs.setSuccess(false);
						logger.info("报价失败！"+resultMap.get("message"));
						rs.setMessage("报价失败！"+resultMap.get("message"));
					}
				}else{
					rs.addContent("status", "BAD");
					rs.setSuccess(false);
					logger.info("报价失败！"+carInfoResultMap.get("message"));
					rs.setMessage("报价失败！"+carInfoResultMap.get("message"));
				}
			} else {
				//按行驶证报价
				carInfoMap.put("vehicleLicenceCode", param.get("plateNo"));
				carInfoMap.put("vehicleFrameNo", param.get("carVIN"));
				carInfoMap.put("engineNo", param.get("engineNo"));
				//品牌型号
				carInfoMap.put("modelType", param.get("modelType"));
				//注册日期
				carInfoMap.put("createdDate", param.get("stRegisterDate"));
				//购车指导价
				carInfoMap.put("newCarPrice", param.get("newCarPrice"));
				//车辆使用性质
				if(param.get("carUsedType")==null){
					//如果不选车辆使用性质, 默认是家庭自用车
					carInfoMap.put("usage", "101");
				}else{
					if("1".equals(param.get("carUsedType").toString())){
						carInfoMap.put("usage", "101");
					}else if("2".equals(param.get("carUsedType").toString())){
						//如果选择的是党政机关、事业团体, 对于博福报价统一传201
						carInfoMap.put("usage", "201");
					}else{
						carInfoMap.put("usage", "301");
					}
				}
				if(param.get("maturityDate")!=null){
					carInfoMap.put("insuranceEndTime", param.get("maturityDate"));
				}
				if(param.get("businessEndTime")!=null){
					carInfoMap.put("businessEndTime", param.get("businessEndTime"));
				}
				if(param.get("carOwnersName")!=null){
					carInfoMap.put("taxpayerName", param.get("carOwnersName"));
				}
				if(param.get("idCard")!=null){
					carInfoMap.put("taxpayerNo", param.get("idCard"));
				}
				if(param.get("ownerIdCardType")!=null){
					if("1".equals(param.get("ownerIdCardType").toString())){
						carInfoMap.put("taxpayerType", "1");
					}else{
						carInfoMap.put("taxpayerType", "6");
					}
				}
				carInfoMap.put("compulsory", param.get("compulsory"));
				carInfoMap.put("commercial", param.get("commercial"));
				carInfoMap.put("insuranceCompanys", param.get("insuranceCompanys"));
				carInfoMap.put("quoteInsuranceVos", param.get("quoteInsuranceVos"));
				
				Map<String, Object> resultMap = biHuService.getBxPrice(carInfoMap,storeId);
				boolean boo = (boolean)resultMap.get("success");
				if(boo){
					List<Map<String, Object>> dates = (List<Map<String, Object>>)resultMap.get("data");
					if(dates.size() == 1 && !(boolean)(dates.get(0).get("success"))){
						rs.addContent("status", "BAD");
						rs.setSuccess(false);
						logger.info("报价失败！"+dates.get(0).get("message"));
						rs.setMessage("报价失败！"+dates.get(0).get("message"));
						return rs;
					}
					rs.addContent("status", "OK");
					rs.addContent("results", convertFormat(dates,carInfoMap));
					rs.setSuccess(true);
					rs.setMessage("报价成功！");
				}else{
					rs.addContent("status", "BAD");
					rs.setSuccess(false);
					logger.info("报价失败！"+resultMap.get("message"));
					rs.setMessage("报价失败！"+resultMap.get("message"));
				}
			}
		} catch (Exception e) {
			logger.info("报价失败!!请联系我们耐心可爱的小猿!!!程序异常",e);
			rs.addContent("status", "BAD");
			rs.setSuccess(false);
			rs.setMessage("报价失败");
		}
		return rs;
	}
	
	/**
	 * 获取壁虎车辆品牌型号
	 * @param condition
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/getModels",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse getModels(@RequestParam(name="condition") String condition,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userId") Integer userId){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String licenseNo = (String)param.get("licenseNo");
			String engineNo = (String)param.get("engineNo");
			String carVin = (String)param.get("carVin");
			if(licenseNo.matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
				String moldName = (String)param.get("moldName");
				String agentCustKey = biHuService.getAgentCustKey(storeId,BiHuService.getRandom20());
				String biHuKey = biHuService.getBiHuKey(storeId);
				String code = biHuService.getCityCode(storeId);
				String cond = "LicenseNo="+licenseNo;
				if(!StringUtils.isEmpty(engineNo)&&!StringUtils.isEmpty(engineNo)){
					cond = cond+"&EngineNo="+engineNo+"&CarVin="+carVin;
				}
				cond = cond+"&IsNeedCarVin=0&MoldName="+moldName+"&CityCode="+code+agentCustKey;
				//保存请求信息
				Map<String, Object> map = new HashMap<>();
				map.put("storeId", storeId);
				map.put("userId", userId);
				map.put("agent", agentCustKey.split("&")[1].split("=")[1]);
				map.put("custKey", agentCustKey.split("&")[2].split("=")[1]);
				map.put("transferType", 6);
				map.put("engineNo", engineNo);
				map.put("carVin", carVin);
				map.put("licenseNo", licenseNo);
				map.put("source", -1);
				biHuService.saveSentBihuInfo(map);
				//请求壁虎
				String json = BofideTobihuUtils.sendGet("getNewVehicleInfo",cond,biHuKey);
				if(json!=null&&json.length()>0){
					Map<String,Object> resultMap = biHuService.jsonToMap(json);
					if(resultMap.get("BusinessStatus")!=null&&!resultMap.get("BusinessStatus").equals(1)){
						rs.addContent("status", "BAD");
						rs.setSuccess(false);
						logger.info("获取车品牌型号失败！"+resultMap.get("StatusMessage"));
						rs.setMessage("获取车品牌型号失败！"+resultMap.get("StatusMessage"));
					}else{
						if(resultMap.get("Items")!=null){
							List<Map<String, Object>> maps = (List<Map<String, Object>>) resultMap.get("Items");
							if(maps!=null&&maps.size()>0){
								for(int i=0;i<maps.size();i++){
									String models = (String)maps.get(i).get("VehicleName")+"/"+maps.get(i).get("VehicleAlias")+
											"/"+maps.get(i).get("VehicleExhaust")+"/"+maps.get(i).get("VehicleSeat")+
											"/"+maps.get(i).get("PurchasePrice")+"/"+maps.get(i).get("VehicleYear")+
											"/"+maps.get(i).get("SourceName");
									maps.get(i).put("models", models);
								}
								rs.addContent("results", maps);
								rs.addContent("status", "OK");
								rs.setSuccess(true);
								rs.setMessage("获取车品牌型号成功！");
							}else{
								rs.addContent("status", "BAD");
								rs.setSuccess(false);
								rs.setMessage("获取车品牌型号失败！返回数据为空");
							}
						}else{
							rs.addContent("status", "BAD");
							rs.setSuccess(false);
							rs.setMessage("获取车品牌型号失败！返回数据为空");
						}
					}
				}else{
					rs.addContent("status", "BAD");
					rs.setSuccess(false);
					rs.setMessage("获取车品牌型号失败！返回数据为空");
				}
			}else{
				rs.addContent("status", "BAD");
				rs.setSuccess(false);
				rs.setMessage("获取车品牌型号失败！车牌号格式不正确！");
			}
		} catch (Exception e) {
			logger.info("获取车品牌型号失败!",e);
			rs.addContent("status", "BAD");
			rs.setSuccess(false);
			rs.setMessage("获取车品牌型号失败!");
		}
		return rs;
	}

	/**
	 * 调用博福接口获取车辆已投保信息
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/getCarInsuranceInfo",method={RequestMethod.POST})
	@ResponseBody
	public BaseResponse getCarInsuranceInfo(@RequestParam(name="condition") String condition,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			Store store = storeMapper.selectByPrimaryKey(storeId);
			//判断是否是搏福报价
			if (StringUtils.isEmpty(store.getShopId()) || StringUtils.isEmpty(store.getToken())) {
				rs.addContent("status", "BAD");
				rs.setSuccess(false);
				rs.setMessage("获取出单信息失败");
			}
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Map<String, Object> infoMap = biHuService.getCarInsuranceInfo(param,storeId);
			boolean successFlag = (boolean) infoMap.get("success");
			if(successFlag){
				rs.addContent("results", infoMap.get("data"));
				rs.addContent("status", "OK");
				rs.setSuccess(true);
				rs.setMessage("获取出单信息成功");
			}else{
				rs.addContent("status", "BAD");
				rs.setSuccess(false);
				rs.setMessage("获取出单信息失败: " + infoMap.get("message"));
			}
		} catch (Exception e) {
			logger.info("获取出单信息失败,程序异常: ",e);
			rs.addContent("status", "BAD");
			rs.setSuccess(false);
			rs.setMessage("获取出单信息失败");
		}
		return rs;
	}
	
}
