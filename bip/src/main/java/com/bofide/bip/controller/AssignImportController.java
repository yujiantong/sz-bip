package com.bofide.bip.controller;


import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;

import com.bofide.bip.common.po.ReturnStatus;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.service.AssignCustomerService;
import com.bofide.bip.service.CustomerAssignService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.vo.BxFromBHInfoVo;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.HttpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONObject;

@Controller
public class AssignImportController {
	private static Logger logger = Logger.getLogger(AssignImportController.class);

	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private CustomerAssignService customerAssignService;
	@Autowired
	private AssignCustomerService assignCustomerService;
	/*@Value("${updateCustomerShopId.shopId}")
	private String shopId;
	@Value("${updateCustomertoken.token}")
	private String token;*/
	/**
	 * 更新潜客信息(8-22点每整点执行一次),从保险公司查出最新信息更新
	 * yujiantong 2018-08-19
	 */
	public void updateCustomer(){
		Map<String, Object> urlMap = new HashMap<String, Object>();
		List<Customer> updateCustomer = new ArrayList<>();
		List<RenewalingCustomer> updateRenewalingCustomer = new ArrayList<>();
			try {
					logger.info("----------系统定时更新潜客信息开始---------");
					List<Customer> list = customerService.selectByImportFlag(0);
					if(list.size()>0){
						int i = 0;
						for (Customer customer : list) {
							i++;
							if((customer.getShopId()!=null && !"".equals(customer.getShopId())) && 
									(customer.getToken()!=null && !"".equals(customer.getToken()))){
								urlMap.put("shopId", customer.getShopId());
								urlMap.put("token", customer.getToken());
							}else{
								/*urlMap.put("shopId", shopId);
								urlMap.put("token", token);*/
							}
							String urlParam = mapToUrlParam(urlMap);
							String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "getCarInfo");
							JSONObject jsonObject=new JSONObject();
							String chassisNumber = customer.getChassisNumber();
							String carlicenseNumber = customer.getCarLicenseNumber();
							String bxCompny =customer.getInsuranceCompLY();
							Date virtualJqxdqr = customer.getVirtualJqxdqr();//虚拟的交强险到期日
							Integer holderId = customer.getUserId();//为了同时更新虚拟交强险日期规则
							jsonObject.put("vehicleFrameNo", chassisNumber);
							jsonObject.put("vehicleLicenceCode", carlicenseNumber);
							if(bxCompny!=null && "人保".equals(bxCompny)){
								jsonObject.put("engineNo", customer.getEngineNumber());
								jsonObject.put("vin", chassisNumber);
							}
							ObjectMapper o = new ObjectMapper();
							String args = o.writeValueAsString(jsonObject);
							requestUrl = requestUrl +"?"+urlParam+"&args="+ URLEncoder.encode(args,"utf-8");
							logger.info("请求参数"+requestUrl);
							String getCarInsuranceInfo = HttpRequest.sendGetRequest(requestUrl);
							Map<String, Object> map = jsonToMap(getCarInsuranceInfo);
							logger.info("接口返回值："+map);
							String newJqxrqEndStr = "";//交强险到期日
							String syxrqEnd = "";//商业险到期日
							String registrationDate = "";//注册日期
							String insuranceCompLY = "";//保险公司
							String engineNumber = "";//发动机号
							String factoryLicenseType = "";//车型号
							String carOwner = "";//车主
							String insured = "";//被保险人
							String customerCharacter = "";//客户性质
							String insuranceTypeLY = "";//投保险种
							String certificateNumber = "";//被保险人证件号
							if(!map.isEmpty()){
								boolean success = (boolean)map.get("success");
								@SuppressWarnings("unchecked")
								Map<String, Object> data = (Map<String, Object>)map.get("data");
								if(success){
									newJqxrqEndStr = data.get("insuranceEndTime").toString();
									syxrqEnd = data.get("businessEndTime").toString();
									registrationDate = data.get("createdDate").toString();
									String insuranceType = data.get("insuranceType").toString();
									insuranceCompLY = changeInsu(insuranceType);//保险公司名称转换
									engineNumber = data.get("engineNo").toString();
									factoryLicenseType = data.get("modelType").toString();
									carOwner = data.get("ownerName").toString();
									insured = data.get("holderName").toString();
								    String usage = data.get("usage").toString();//传过来是数字标识，需要转换
									customerCharacter = usageToString(usage);
									@SuppressWarnings("unchecked")
									List<Map<String, Object>> lists = (List<Map<String, Object>>)data.get("quoteInsuranceVos");
									BxFromBHInfoVo vo = null;
									if(lists!=null&&lists.size()>0){
										vo = new BxFromBHInfoVo();
										for(int j=0;j<lists.size();j++){
											vo = getInfo(lists.get(j),vo);
										}
										vo = zhInfo(vo);
										insuranceTypeLY = vo.toStr();//传过来是数组，需要转换为字符串
									}
									certificateNumber = data.get("certificateCode").toString();
								}
							}
							RenewalingCustomer renewalingCustomer = renewalingCustomerService.selectByPrimaryKey(customer.getCustomerId(),customer.getFourSStoreId());
							//交强险	
							//获取原本的保险到期日
							Date oldJqxdqrEnd = customer.getJqxrqEnd();
							String oldJqxdqrEndStr = DateUtil.toString(oldJqxdqrEnd);
							Date newVirtualJqxdqr = null;
							CustomerAssign customerAssign = null;
							//如果该潜客修改了保险到期日并且是处于审批延期日状态时，则不允许修改保险到期日
							if(newJqxrqEndStr!=null && newJqxrqEndStr.length()>0){
								if(!oldJqxdqrEndStr.equals(newJqxrqEndStr)){
									customerAssign = customerAssignService.findCustomerAssign(customer.getCustomerId(),holderId);
									//根据新的保险到期日生成新的虚拟保险到期日
									//如果修改的保险到期日后的保险到期日是在当前日期之前则按如下规则生成保险到期日
									Calendar curCal = Calendar.getInstance();
									Date curDate = DateUtil.formatDate(curCal);
									Date newJqxrqEnd = DateUtil.toDate(newJqxrqEndStr);
									if(customerAssign != null){
										Integer returnStatus = customerAssign.getReturnStatu();
										if(returnStatus != Integer.valueOf(ReturnStatus.CHECKDELAY)){
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
											customer.setJqxrqEnd(DateUtil.toDate(newJqxrqEndStr));
											customer.setVirtualJqxdqr(newVirtualJqxdqr);//虚拟的交强险日期也需要更新
											if(renewalingCustomer!=null){
												List<RenewalingCustomer> reList =  new ArrayList<RenewalingCustomer>();
												renewalingCustomer.setJqxrqEnd(DateUtil.toDate(newJqxrqEndStr));
												renewalingCustomer.setVirtualJqxdqr(newVirtualJqxdqr);//虚拟的交强险日期也需要更新
												//如果修改了保险到期日，则需要及时更新潜客脱保状态
												reList.add(renewalingCustomer);
												assignCustomerService.updateInsuranceDateStatuOnTime(reList);
											}
										 }
									  }else{
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
											customer.setJqxrqEnd(DateUtil.toDate(newJqxrqEndStr));
											customer.setVirtualJqxdqr(newVirtualJqxdqr);//虚拟的交强险日期也需要更新
											if(renewalingCustomer!=null){
												List<RenewalingCustomer> reList =  new ArrayList<RenewalingCustomer>();
												renewalingCustomer.setJqxrqEnd(DateUtil.toDate(newJqxrqEndStr));
												renewalingCustomer.setVirtualJqxdqr(newVirtualJqxdqr);//虚拟的交强险日期也需要更新
												//如果修改了保险到期日，则需要及时更新潜客脱保状态
												reList.add(renewalingCustomer);
												assignCustomerService.updateInsuranceDateStatuOnTime(reList);
											}
									    }
									}	
							}
							if(syxrqEnd!=null && syxrqEnd.length()>0){
					                customer.setSyxrqEnd(DateUtil.toDate(syxrqEnd));
									if(renewalingCustomer != null){
										renewalingCustomer.setSyxrqEnd(DateUtil.toDate(syxrqEnd));
									}
								}
							if(registrationDate !=null &&registrationDate.length()>0){
									customer.setRegistrationDate(DateUtil.toDate(registrationDate));
									if(renewalingCustomer != null){
										renewalingCustomer.setRegistrationDate(DateUtil.toDate(registrationDate));
									}
								}
							if(insuranceCompLY !=null &&insuranceCompLY.length()>0){
									customer.setInsuranceCompLY(insuranceCompLY);
									if(renewalingCustomer != null){
										renewalingCustomer.setInsuranceCompLY(insuranceCompLY);
									}
								}
							if(engineNumber !=null &&engineNumber.length()>0){
									customer.setEngineNumber(engineNumber);
									if(renewalingCustomer != null){
										renewalingCustomer.setEngineNumber(engineNumber);
									}
								}
							if(factoryLicenseType !=null &&factoryLicenseType.length()>0){
									customer.setFactoryLicenseType(factoryLicenseType);
									if(renewalingCustomer != null){
										renewalingCustomer.setFactoryLicenseType(factoryLicenseType);
									}
								}
							if(carOwner !=null &&carOwner.length()>0){
								customer.setCarOwner(carOwner);
								if(renewalingCustomer != null){
									renewalingCustomer.setCarOwner(carOwner);
								}
							}
							if(insured !=null &&insured.length()>0){
								customer.setInsured(insured);
								if(renewalingCustomer != null){
									renewalingCustomer.setInsured(insured);
								}
							}
							if(customerCharacter !=null &&customerCharacter.length()>0){
								customer.setCustomerCharacter(customerCharacter);
								if(renewalingCustomer != null){
									renewalingCustomer.setCustomerCharacter(customerCharacter);
								}
							}
							if(insuranceTypeLY !=null &&insuranceTypeLY.length()>0){
								customer.setInsuranceTypeLY(insuranceTypeLY);
								if(renewalingCustomer != null){
									renewalingCustomer.setInsuranceTypeLY(insuranceTypeLY);
								}
							}
							if(certificateNumber !=null &&certificateNumber.length()>0){
								customer.setCertificateNumber(certificateNumber);
								if(renewalingCustomer != null){
									renewalingCustomer.setCertificateNumber(certificateNumber);
								}
							}
							//会有请求超时的情况，应该判断一下，在set这个更新的导入标志
							if(getCarInsuranceInfo.indexOf("超时")>-1){
								customer.setImportFlag(0);
							}else{
								customer.setImportFlag(1);
							}
							updateCustomer.add(customer);
							updateRenewalingCustomer.add(renewalingCustomer);
								
							if(i==100){
								Thread.sleep(2*60*1000);//睡眠两分钟
								i=0;
						    }
							updateCustomer.remove(null);
							updateRenewalingCustomer.remove(null);
						}
						//更新大池子里面的交强险到期日和商业险到期日
						if(updateCustomer.size() > 0){
							try {
								customerService.updateBxMessageList(updateCustomer);
								logger.info("更新bf_bip_customer表(大池子)信息："+updateCustomer.size());
							} catch (Exception e) {
								logger.info("bf_bip_customer更新失败(大池子)");
							}
						}
						if(updateRenewalingCustomer.size() > 0){
							try {
								renewalingCustomerService.updateBxMessageList(updateRenewalingCustomer);
								logger.info("更新bf_bip_renewaling_customer表(小池子)信息："+updateRenewalingCustomer.size());
							} catch (Exception e) {
								logger.info("bf_bip_renewaling_customer(小池子)更新失败");
							}
						}
					}else{
						logger.info("无导入潜客需要更新信息");
					}
					
					logger.info("----------系统定时更新潜客信息结束---------");
				} catch (Exception e) {
					logger.info("定时更新潜客信息失败，程序异常");
				}
	}
	/**
	 * 保险公司
	 * @param insu value值
	 * @return
	 */
	public String changeInsu(String insu){
		Map<String, String> param = new HashMap<String, String>();
		param.put("pingan", "平安");
		param.put("picc", "人保");
		param.put("cpic", "太平洋");
		param.put("lifeInsurance", "人寿");
		return param.get(insu);
	}
	/**
	 * url参数由MAP转成String
	 * 
	 * @param param url所需参数
	 * @return urlParam url参数的字符串
	 */
	public String mapToUrlParam(Map<String, Object> param) {

		String urlParam = "";
		int i = 0;
		for (String key : param.keySet()) {
			if (i == 0) {
				urlParam = key + "=" + param.get(key);
			}else{
				urlParam = urlParam +"&"+ key + "=" + param.get(key);
			}
			i++;
		}
		return urlParam;
	}
	/**
	 * 由json转成Map
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> jsonToMap(String jsonParam) {
		ObjectMapper  objectMapper = new ObjectMapper();
		try {
			return (Map<String,Object>)objectMapper.readValue(jsonParam, Map.class);
		} catch (IOException e) {
			
		}
		return null;
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
	public static void main(String[] args) {
		AssignImportController assignImportController= new AssignImportController();
		assignImportController.updateCustomer();
	}
}
