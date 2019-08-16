package com.bofide.bip.controller;

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

import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerUpdateSms;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.SmsTemplate;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.AdminService;
import com.bofide.bip.service.CommonService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.CustomerUpdateSmsService;
import com.bofide.bip.service.ModuleSetService;
import com.bofide.bip.service.SettingService;
import com.bofide.bip.service.SmsTemplateService;
import com.bofide.bip.service.StoreService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.HttpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/smsTemplate")
public class SmsTemplateController {
	private static Logger logger = Logger.getLogger(SmsTemplateController.class);
	
	@Autowired
	private SmsTemplateService smsTemplateService;
	@Autowired
	private SettingService settingService;
	@Autowired
	private CustomerUpdateSmsService customerUpdateSmsService;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private StoreService storeService;
	@Autowired
	private AdminService adminService;
	@Autowired
	private ModuleSetService moduleSetService;
	@Autowired
	private CommonService commonService;
	/**
	 * 查询营销模板
	 * @param storeId
	 * @return
	 */
	@RequestMapping(value="/findByCondition",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findByCondition(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<>();
			param.put("storeId", storeId);
			List<Map<String, Object>> lists = smsTemplateService.findByCondition(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", lists);
			return rs; 
		} catch (Exception e) {
			logger.error("查询营销模板失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 新增营销模板
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/saveSmsTemplate",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse saveSmsTemplate(@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer enabledState = Integer.valueOf((String)param.get("enabledState"));
			Integer storeId = (Integer) param.get("storeId");
			if(enabledState==1){
				int enableCount = smsTemplateService.findEnableCount(storeId);
				if(enableCount>=1){
					String message = "新增模板失败,存在已经启用的模板,请先把别的模板禁用";
					rs.setSuccess(false);
					rs.setMessage(message);
					rs.addContent("status", "BAD");
					return rs;
				}
			}
			
			smsTemplateService.insert(param);
			
			rs.setSuccess(true);
			rs.setMessage("新增营销模板成功");
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("新增营销模板失败: ", e);
			rs.setSuccess(false);
			rs.setMessage("新增营销模板失败");
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 修改营销模板
	 * @param condition
	 * @return
	 */
	@RequestMapping(value="/updateTemplateById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateTemplateById(@RequestParam(name="condition") String condition,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//将condition转成map
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			Integer id = (Integer) param.get("id");
			Integer newEnabledState = Integer.valueOf((String)param.get("enabledState"));
			Map<String,Object> templateMap = smsTemplateService.findTemplateById(id);
			Integer oldEnabledState = (Integer) templateMap.get("enabledState");
			if(!oldEnabledState.equals(newEnabledState)&&newEnabledState==1){
				int enableCount = smsTemplateService.findEnableCount(storeId);
				if(enableCount>=1){
					String message = "修改模板失败,存在已经启用的模板,请先把别的模板禁用";
					rs.setSuccess(false);
					rs.setMessage(message);
					rs.addContent("status", "BAD");
					return rs;
				}
			}
			
			smsTemplateService.updateTemplateById(param);
			
			rs.setSuccess(true);
			rs.setMessage("修改营销模板成功");
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("修改营销模板失败: ", e);
			rs.setSuccess(false);
			rs.setMessage("修改营销模板失败");
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 删除营销模板
	 * @param id 模板id
	 * @return
	 */
	@RequestMapping(value="/deleteTemplateById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteTemplateById(@RequestParam(name="id") Integer id,
			@RequestParam(name="userName") String userName){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<>();
			param.put("id", id);
			param.put("deleted", 1);
			param.put("endOperationName", userName);
			param.put("endOperationTime", new Date());
			
			smsTemplateService.updateTemplateById(param);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			logger.error("删除营销模板失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 根据模板id查询营销模板
	 * @param id 模板id
	 * @return
	 */
	@RequestMapping(value="/findTemplateById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findTemplateById(@RequestParam(name="id") Integer id){
		BaseResponse rs = new BaseResponse();
		try {
			
			Map<String, Object> templateMap = smsTemplateService.findTemplateById(id);
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", templateMap);
			return rs; 
		} catch (Exception e) {
			logger.error("根据模板id查询营销模板失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 系统定时发送营销短信
	 */
	public void timingSMS(){
		try{
			logger.info("----------系统定时发送营销短信开始---------");
			Map<String,Object> param = new HashMap<>();
			param.put("moduleName", "updateSMS");
			param.put("switchOn", 1);
			
			List<ModuleSet> lists = settingService.selectByCondition(param);
			
			param.put("pageNum", 0);
			param.put("pageSize", 10);
			if(lists!=null&&lists.size()>0){
				for(int i=0;i<lists.size();i++){
					param.put("storeId", lists.get(i).getFourSStoreId());
					SmsTemplate smsTemplate = smsTemplateService.findByStoreIdAndState(param);
					if(smsTemplate!=null&&smsTemplate.getEnabledState()==1){
						Store store = storeService.findStoreById(smsTemplate.getStoreId());
						double messageBalance= store.getMessageBalance();//短信余额
						if(messageBalance>=0){//短信余额大于0可继续发送短信，如果小于0自动关闭
							while(true){
								List<CustomerUpdateSms> beans = customerUpdateSmsService.select(param);
								if(beans!=null&&beans.size()>0){
									if(!disBeans(beans,smsTemplate,store.getStoreName(),store.getLogo())){
										break;
									}
								}else{
									break;
								}
							}
						}else{
							//调用service修改4S店营销短信开启状态
							Store s = new Store();
							s.setUpdateSMS(0);
							s.setStoreId(store.getStoreId());
							storeService.updateStoreMessage(s);
							//营销短信计费功能模块ModuleSet
							ModuleSet moduleSet = new ModuleSet();
							moduleSet.setFourSStoreId(store.getStoreId());
							moduleSet.setModuleName("updateSMS");
							moduleSet.setSwitchOn(0);
							//根据4s店id和模块名称更新记录
							moduleSetService.updateByFoursIdAndMoName(moduleSet);
						}
					}
				}
			}
			//发送完成后，查询每家店的余额,如果少于50元发送系统通知
			List<Store> listStore = storeService.findAllStore();
			String content0 =BofideTobihuUtils.getLgend("messageConfig", "content0");
			String content10 =BofideTobihuUtils.getLgend("messageConfig", "content10");
			String content50 =BofideTobihuUtils.getLgend("messageConfig", "content50");
			for (int i = 0; i < listStore.size(); i++) {
				Double messageBalance = listStore.get(i).getMessageBalance();
				Integer storeId = listStore.get(i).getStoreId();
				//如果已发送过，且在20(不足50元)天之外，再次发送，在7天之外(不足10元或不足0元)
				Integer countZero= commonService.findSystemMessageTime(storeId,content0);
				Integer countTen= commonService.findSystemMessageTime(storeId,content10);
			    Integer countFifty= commonService.findSystemMessageTimeFifty(storeId,content50);
				if(countFifty==0 && messageBalance>10 && messageBalance<50){
					commonService.insertSystemMessageMarket(content50,storeId);
				}else if(countTen==0 && messageBalance>0 && messageBalance<10){
					commonService.insertSystemMessageMarket(content10,storeId);
				}else if(countZero==0 && messageBalance<=0){
					commonService.insertSystemMessageMarket(content0,storeId);
				}
			}
			customerUpdateSmsService.delete();
			logger.info("----------系统定时发送营销短信结束---------");
		}catch(Exception e){
			logger.error("定时发送短信失败，定时任务中断！", e);
		}
	}
	/**
	 * 处理需要发送短信的潜客
	 * @param beans
	 */
	public boolean disBeans(List<CustomerUpdateSms> beans,SmsTemplate smsTemplate,String storeName,Integer logo){
		try{
			for(int i=0;i<beans.size();i++){
				try{
					Customer cus = customerService.selectByPrimaryKey(beans.get(i).getCustomerId());
					//删除临时表数据
					customerUpdateSmsService.deleteByCustomerId(beans.get(i).getCustomerId());
					if(cus==null){
						continue;
					}
					String hostName = "";
					String templateId = "";
					if(logo == 1){
						templateId = BofideTobihuUtils.getLgend("messageConfig", "bipTemplateId");
						hostName = BofideTobihuUtils.getLgend("messageConfig", "bipHostName");
					}else{
						templateId = BofideTobihuUtils.getLgend("messageConfig", "chipTemplateId");
						hostName = BofideTobihuUtils.getLgend("messageConfig", "chipHostName");
					}
					String str = cus.getContact()+","+storeName+"," + hostName + "/marketing?customerId="+cus.getCustomerId();
					String message = "";
					if(!cus.getContactWay().substring(0,1).equals("1")||cus.getContactWay().length()!=11){
						message = "发送失败，手机号码格式错误！";
						smsTemplateService.disBean(beans.get(i),cus,smsTemplate,message,false);
						continue;
					}
					String result = HttpRequest.sendMessagePost(cus.getContactWay(),str,templateId);
					logger.info("请求串返回结果："+result);
					if(result!=null&&result.length()>0){
						//将str转成map
						ObjectMapper objectMapper = new ObjectMapper();
						@SuppressWarnings("unchecked")
						Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(result, Map.class);
						String code = (String) param.get("code");
						String msg =  (String) param.get("msg");
						//计费条数
						Integer count = Integer.valueOf(param.get("count").toString());
						if(code!=null && code.equals("000000") && msg!=null && msg.equals("OK")){
							message = "发送成功！";
							smsTemplateService.disBean(beans.get(i),cus,smsTemplate,message,true);
							//发送成功，更新费用
							Integer storeId = beans.get(i).getStoreId();
							updateMessageBalance(storeId,count);
						}else{
							message = "发送失败，错误代码："+code+"；平台返回信息："+msg+"！";
							smsTemplateService.disBean(beans.get(i),cus,smsTemplate,message,false);
						}
					}
				}catch(Exception e){
					logger.error("潜客id为"+beans.get(i).getCustomerId()+"的潜客定时发送短信有错误", e);
					continue;
				}
			}
			return true;
		}catch(Exception e){
			logger.error("定时发送短信失败，disBeans方法出错！", e);
			return false;
		}
	}
	/**
	 * 发送一条信息就更新本店的短信余额
	 * @param storeId
	 * @param count
	 */
	public void updateMessageBalance(Integer storeId,Integer count) {
			try {
				Store store = storeService.findStoreById(storeId);
				double messageBalance = Double.valueOf(BofideTobihuUtils.getLgend("messageConfig", "messageBalance"));
				double messageB = messageBalance*count;//产生费用
				double messageOriginal = store.getMessageBalance();//原来的费用
				Store sto = new Store();
				double messageUpdate= messageOriginal-messageB;
				sto.setStoreId(storeId);
				sto.setMessageBalance(messageUpdate);
				adminService.messageRecharge(sto);
			} catch (NumberFormatException e) {
				e.printStackTrace();
			} catch (Exception e) {
				logger.info("发送营销短信时更新短信余额失败，程序异常！",e);
			}
	}

	/**
	 * 禁用/启用营销模板
	 * @param id 模板id
	 * @return
	 */
	@RequestMapping(value="/updateEnabledState",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateEnabledState(@RequestParam(name="id") Integer id,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="userName") String userName,
			@RequestParam(name="enabledState") Integer enabledState){
		BaseResponse rs = new BaseResponse();
		String message ="";
		try {
			if(enabledState==0){
				message = "禁用模板成功";
			}else if(enabledState==1){
				message = "启用模板成功";
				//校验是否已经有模板启用
				int enableCount = smsTemplateService.findEnableCount(storeId);
				if(enableCount>=1){
					message = "启用模板失败,至多只能启用一个模板,请先把别的模板禁用";
					rs.setSuccess(false);
					rs.setMessage(message);
					rs.addContent("status", "BAD");
					return rs;
				}
			}
			Map<String,Object> param = new HashMap<>();
			param.put("id", id);
			param.put("enabledState", enabledState);
			param.put("endOperationName", userName);
			param.put("endOperationTime", new Date());
			
			smsTemplateService.updateTemplateById(param);
			
			rs.setSuccess(true);
			rs.setMessage(message);
			rs.addContent("status", "OK");
			return rs; 
		} catch (Exception e) {
			if(enabledState==0){
				message = "禁用模板失败";
			}else if(enabledState==1){
				message = "启用模板失败";
			}
			logger.error(message, e);
			rs.setSuccess(false);
			rs.setMessage(message);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 营销短信链接查询模板详情
	 * @param customerId
	 * @return
	 */
	@RequestMapping(value="/showModule",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse showModule(@RequestParam(name="customerId") Integer customerId){
		BaseResponse rs = new BaseResponse();
		try {
			Customer cus = customerService.selectByPrimaryKey(customerId);
			if(cus!=null){
				Map<String,Object> param = new HashMap<>();
				param.put("storeId", cus.getFourSStoreId());
				SmsTemplate smsTemplate = smsTemplateService.findByStoreIdAndState(param);
				rs.addContent("results", smsTemplate);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				return rs; 
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				return rs; 
			}
		} catch (Exception e) {
			logger.error("营销短信链接查询模板详情失败！", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 * 营销短信链接修改高意向
	 * @param customerId
	 * @return
	 */
	@RequestMapping(value="/updateCustomer",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateCustomer(@RequestParam(name="customerId") Integer customerId){
		BaseResponse rs = new BaseResponse();
		try {
			if(customerId!=null){
				Map<String,Object> param = new HashMap<>();
				param.put("customerId", customerId);
				param.put("sfgyx", 1);
				customerService.updateCustomer(param);
				rs.setSuccess(true);
				rs.setMessage("感谢您的支持，我们会尽快联系您");
				rs.addContent("status", "OK");
				return rs;
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				return rs; 
			}
		} catch (Exception e) {
			logger.error("营销短信链接修改高意向失败！", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
}
