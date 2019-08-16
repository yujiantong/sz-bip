package com.bofide.bip.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.vo.BxFromBHInfoVo;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service(value="getCarInfoFromBofideService")
public class GetCarInfoFromBofideService {
	
	private static Logger logger = Logger.getLogger(GetCarInfoFromBofideService.class);
	
	@Resource(name="biHuService")
	private BiHuService biHuService;
	@Resource(name="customerMapper")
	private CustomerMapper customerMapper;
	
	/**
	 * 
	 * @param json
	 * @param customer
	 * @param insuranceComps
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> requestBofide(Customer customer,Integer userId,boolean boo) throws Exception{
		Map<String, Object> result = new HashMap<>();
		logger.info(customer.getFourSStoreId()+"========================================bofide开始请求"+new Date().getTime());
		//这里去掉车牌号校验，输入车牌号或者车架号也可直接刷新
		/*if((!StringUtils.isEmpty(customer.getEngineNumber())&&customer.getEngineNumber().matches("[a-z_A-Z_0-9]+"))||
				(!StringUtils.isEmpty(customer.getCarLicenseNumber())&&
						customer.getCarLicenseNumber().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")))*/
		if(!StringUtils.isEmpty(customer.getChassisNumber()) && customer.getChassisNumber().matches("^[a-zA-Z0-9]{17}$")||
				!StringUtils.isEmpty(customer.getCarLicenseNumber())&&customer.getCarLicenseNumber().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
			Map<String,Object> map = new HashMap<>();
			map.put("vehicleLicenceCode", customer.getCarLicenseNumber()==null?"":customer.getCarLicenseNumber());
			map.put("vehicleFrameNo", customer.getChassisNumber()==null?"":customer.getChassisNumber());
			map.put("engineNo", customer.getEngineNumber()==null?"":customer.getEngineNumber());
			map.put("vin", "");
			map.put("plateType", "02");
			if(customer.getCertificateNumber()!=null){
				if(customer.getCertificateNumber().length()<6){
					map.put("certyNo", "");
				}else{
					map.put("certyNo", customer.getCertificateNumber().substring(customer.getCertificateNumber().length()-6));
				}
			}else{
				map.put("certyNo", "");
			}
			result = biHuService.getCarInfo(map, customer.getFourSStoreId());
		}
		logger.info(customer.getFourSStoreId()+"========================================bofide结束请求"+new Date().getTime());
		return result;
	}
	
	
	@SuppressWarnings("unchecked")
	public Map<String,Object> disposeMap(Map<String, Object> jsonMap,Customer customer,List<InsuranceComp> insuranceComps) throws Exception{
		boolean success = (boolean)jsonMap.get("success");
		Map<String, Object> data = (Map<String, Object>)jsonMap.get("data");
		Map<String, Object> map = new HashMap<>();
		if(success){
			logger.info("返回数据："+data+" 潜客ID："+customer.getCustomerId()+" 店ID："+customer.getFourSStoreId());
			List<Map<String, Object>> lists = (List<Map<String, Object>>)data.get("quoteInsuranceVos");
			String name = (String)data.get("insuranceType");
			BxFromBHInfoVo vo = null;
			if(lists!=null&&lists.size()>0){
				vo = new BxFromBHInfoVo();
				for(int i=0;i<lists.size();i++){
					vo.setSource(getInsuranceCompNum(name,insuranceComps));
					vo = getInfo(lists.get(i),vo);
				}
				vo = zhInfo(vo);
				ObjectMapper o = new ObjectMapper();
				String saveQuote = o.writeValueAsString(vo);
				map.put("customerId", customer.getCustomerId());
				map.put("bxInfo", saveQuote);
				customerMapper.updateCustomerInfo(map);//修改数据
			}
			
			if(!StringUtils.isEmpty(name)){
				map.put("insuranceCompLY", getInsuranceCompName(name,insuranceComps));
			}
			
			if(!StringUtils.isEmpty(vo)){
				map.put("insuranceTypeLY", vo.toStr());
			}
			
			SimpleDateFormat sdft = new SimpleDateFormat("yyyy-MM-dd");
			if(!StringUtils.isEmpty(data.get("insuranceEndTime"))){
				map.put("bhInsuranceEndDate", sdft.parse((String)data.get("insuranceEndTime")));
			}
			if(!StringUtils.isEmpty(data.get("vehicleLicenceCode"))&&
					((String) data.get("vehicleLicenceCode")).matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
				map.put("carLicenseNumber", (String)data.get("vehicleLicenceCode"));
			}
			if(!StringUtils.isEmpty(data.get("engineNo"))){
				map.put("engineNumber", (String)data.get("engineNo"));
			}
			
			if(!StringUtils.isEmpty(data.get("businessEndTime"))){
				map.put("syxrqEnd", sdft.parse((String)data.get("businessEndTime")));
			}
			
			if(!StringUtils.isEmpty(data.get("ownerName"))&& data.get("ownerName").toString().indexOf("*") < 0 ){
				map.put("carOwner", (String)data.get("ownerName"));
			}
			if(!StringUtils.isEmpty(data.get("taxpayerName"))&& data.get("taxpayerName").toString().indexOf("*") < 0 ){
				map.put("insured", (String)data.get("taxpayerName"));
			}
			//身份证加密,不覆盖本地信息
			if(!StringUtils.isEmpty(data.get("certificateCode")) && data.get("certificateCode").toString().indexOf("*") < 0 ){
				map.put("certificateNumber", (String)data.get("certificateCode"));
			}
			 
			String toStr = usageToString((String)data.get("usage"));
			if(!StringUtils.isEmpty(toStr)){
				map.put("customerCharacter", toStr);
			}
			if(!StringUtils.isEmpty(data.get("vehicleFrameNo"))){
				map.put("chejiahao", (String)data.get("vehicleFrameNo"));//因为前台新增页面刷新需要这个数据，而我又不需要修改这个数据，所以字段名搞成和数据库不一样
			}
			if(!StringUtils.isEmpty(data.get("modelType"))){
				map.put("modleName", (String)data.get("modelType"));
			}
			if(!StringUtils.isEmpty(data.get("createdDate"))){
				map.put("registerDate", (String)data.get("createdDate"));
			}
			//newCarPrice
			if(!StringUtils.isEmpty(data.get("newCarPrice"))){
				map.put("newCarPrice", (String)data.get("newCarPrice"));
			}
		}else{
			String message = (String)data.get("message");
			logger.info("错误原因："+message+" 错误潜客ID："+customer.getCustomerId()+" 错误店ID："+customer.getFourSStoreId());
		}
		return map;
	}
	
	public static Integer getInsuranceCompNum(String name,List<InsuranceComp> insuranceComps){
		Integer num = 0;
		if(name!=null&&name.length()>0){
			for(int i=0; i<insuranceComps.size(); i++){
				InsuranceComp insuranceComp = insuranceComps.get(i);
				if(name.equals(insuranceComp.getInsuranceKey())){
					num = insuranceComp.getSource();
				}
			}
		}
		return num;
	}
	
	/**
	 * 博福接口返回的保险公司码,转为系统定义的保险公司名称
	 * 目前只支持四家: cpic:太平洋;pingan:平安;picc:人保; lifeInsurance:人寿
	 */
	public static String getInsuranceCompName(String name,List<InsuranceComp> insuranceComps){
		String insurCompName = "";
		if(name!=null&&name.length()>0){
			for(int i=0; i<insuranceComps.size(); i++){
				InsuranceComp insuranceComp = insuranceComps.get(i);
				if(name.equals(insuranceComp.getInsuranceKey())){
					insurCompName = insuranceComp.getInsuranceCompName();
				}
			}
		}
		return insurCompName;
	}
	
	
	public static BxFromBHInfoVo getInfo(Map<String, Object> map,BxFromBHInfoVo vo){
		String amount = (String)map.get("amount");
		String insuranceCode = (String)map.get("insuranceCode");
		String nonDeductible = (String)map.get("nonDeductible");
		if(insuranceCode!=null&&insuranceCode.length()>0){
			Double dd = 0.0;
			if(amount!=null&&amount.length()>0){
				dd = Double.valueOf(amount);
			}
			if(insuranceCode.equals("01")){
				vo.setCheSun(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianCheSun(1.0);
				}
			}else if(insuranceCode.equals("02")){
				vo.setSanZhe(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianSanZhe(1.0);
				}
			}else if(insuranceCode.equals("03")){
				vo.setSiJi(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianSiJi(1.0);
				}
			}else if(insuranceCode.equals("04")){
				vo.setChengKe(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianChengKe(1.0);
				}
			}else if(insuranceCode.equals("05")){
				vo.setDaoQiang(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianDaoQiang(1.0);
				}
			}else if(insuranceCode.equals("06")){
				String producingArea = (String)map.get("producingArea");
				vo.setBoLi(Integer.valueOf(producingArea)+1);
			}else if(insuranceCode.equals("07")){
				vo.setZiRan(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianZiRan(1.0);
				}
			}else if(insuranceCode.equals("08")){
				vo.setHuaHen(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianHuaHen(1.0);
				}
			}else if(insuranceCode.equals("09")){
				vo.setSheShui(1.0);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianSheShui(1.0);
				}
			}else if(insuranceCode.equals("11")){
				vo.setHcJingShenSunShi(dd);
				if(nonDeductible!=null&&nonDeductible.length()>0){
					vo.setBuJiMianJingShenSunShi(1.0);
				}
			}else if(insuranceCode.equals("13")){
				vo.setHcXiuLiChang(1.0);
			}else if(insuranceCode.equals("14")){
				vo.setHcSanFangTeYue(1.0);
			}
		}
		return vo;
	}
	
	public static BxFromBHInfoVo zhInfo(BxFromBHInfoVo vo){
		if(vo!=null){
			if(vo.getSource()==null){
				vo.setSource(0);
			}
			if(vo.getCheSun()==null){
				vo.setCheSun(0.0);
			}
			if(vo.getBuJiMianCheSun()==null){
				vo.setBuJiMianCheSun(0.0);
			}
			if(vo.getSanZhe()==null){
				vo.setSanZhe(0.0);
			}
			if(vo.getBuJiMianSanZhe()==null){
				vo.setBuJiMianSanZhe(0.0);
			}
			if(vo.getSiJi()==null){
				vo.setSiJi(0.0);
			}
			if(vo.getBuJiMianSiJi()==null){
				vo.setBuJiMianSiJi(0.0);
			}
			if(vo.getChengKe()==null){
				vo.setChengKe(0.0);
			}
			if(vo.getBuJiMianChengKe()==null){
				vo.setBuJiMianChengKe(0.0);
			}
			if(vo.getDaoQiang()==null){
				vo.setDaoQiang(0.0);
			}
			if(vo.getBuJiMianDaoQiang()==null){
				vo.setBuJiMianDaoQiang(0.0);
			}
			if(vo.getBoLi()==null){
				vo.setBoLi(0);
			}
			if(vo.getZiRan()==null){
				vo.setZiRan(0.0);
			}
			if(vo.getBuJiMianZiRan()==null){
				vo.setBuJiMianZiRan(0.0);
			}
			if(vo.getHuaHen()==null){
				vo.setHuaHen(0.0);
			}
			if(vo.getBuJiMianHuaHen()==null){
				vo.setBuJiMianHuaHen(0.0);
			}
			if(vo.getSheShui()==null){
				vo.setSheShui(0.0);
			}
			if(vo.getBuJiMianSheShui()==null){
				vo.setBuJiMianSheShui(0.0);
			}
			if(vo.getHcJingShenSunShi()==null){
				vo.setHcJingShenSunShi(0.0);
			}
			if(vo.getBuJiMianJingShenSunShi()==null){
				vo.setBuJiMianJingShenSunShi(0.0);
			}
			if(vo.getHcXiuLiChang()==null){
				vo.setHcXiuLiChang(0.0);
			}
			if(vo.getHcXiuLiChangType()==null){
				vo.setHcXiuLiChangType(-1.0);
			}
			if(vo.getHcSanFangTeYue()==null){
				vo.setHcSanFangTeYue(0.0);
			}
		}
		return vo;
	}
	
	public String usageToString(String usage){
		String str = "";
		if(usage!=null&&usage.length()>0){
			if(usage.equals("101")){
				str = "家庭自用车";
			}else if(usage.equals("201")){
				str = "党政机关用车";
			}else if(usage.equals("202")){
				str = "事业团体用车";
			}else if(usage.equals("301")){
				str = "企业非营业用车";
			}else if(usage.equals("401")){
				str = "出租车";
			}else if(usage.equals("402")){
				str = "租赁车";
			}else if(usage.equals("501")){
				str = "城市公交";
			}else if(usage.equals("502")){
				str = "公路客运";
			}else if(usage.equals("601")){
				str = "营业货车";
			}
		}
		return str;
	}
}
