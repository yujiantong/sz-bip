package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.exception.CustomerAssignException;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.AssignCustomerService;
import com.bofide.bip.service.CustomerService;
import com.bofide.bip.service.RenewalingCustomerService;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.TraceDaySetService;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.SplitListUtil;

@Controller
@RequestMapping(value = "/assign")
public class AssignController extends BaseResponse{
	private static Logger logger = Logger.getLogger(AssignController.class);
	
	@Autowired
	private AssignCustomerService assignCustomerService;
	@Autowired
	private TraceDaySetService traceDaySetService;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private RenewalingCustomerService renewalingCustomerService;
	@Autowired
	private StoreService storeService;
	
	//分配潜客
	public void systemAssignRenewalCustomer(){
		try {
			logger.info("----------系统定时分配潜客开始---------");
			
			List<Map<String, Integer>> listMap = traceDaySetService.findStoreSetTraceDay();
			for(Map<String,Integer> map : listMap){
				Map<String,Object> reSetParam = new HashMap<String,Object>();
				reSetParam.put("fourSStoreId", map.get("fourSStoreId"));
				reSetParam.put("nextGetCusDayNum", map.get("nextGetCusDayNum"));
				Map<String,Object> assignParam = new HashMap<String,Object>();
				assignParam.put("fourSStoreId", 113);
				assignParam.put("dayNumber", (0-90));
				assignParam.put("status", 1);
				assignParam.put("customerLevel", "S");
				//根据每家店设置的捞取天数，查询出分配前要重置的潜客
				List<Customer> reSetList = customerService.findRenewalCustomer(reSetParam);
				
				//对于重置潜客信息的事务是：10个潜客处理完就一个commit
				 List<List<Customer>> reSetListAll = new ArrayList<List<Customer>>();
				 if(reSetList.size() > 0){
					 reSetListAll = SplitListUtil.splitList(reSetList,10);
					 for (int i = 0; i < reSetListAll.size(); i++) {
						 try{
							 assignCustomerService.updateReSetCustomer(reSetListAll.get(i));
						 }catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(Customer customer : reSetListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("重置将要分配的潜客失败,失败的潜客的id是:"+customerIds,e);
						 }
					 } 
				 }
				 
				/**
				 * 在2017-08-07号之前,失销后再去修改潜客的保险到期日,来年不会分配,是因为分配标志没有被初始化
				 * 在这将分配标志初始化为1(未分配), 2017-08-09  HuLiangqing 添加
				 * 本年度的,即距离当前时间150天(暂定)以内的失销不处理
				 */
				Integer storeId = map.get("fourSStoreId");
				customerService.updateCustomerByRepairData(storeId);
				
				 //根据每家店设置的捞取天数，查询出将要分配的潜客
				 List<Customer> assignList = customerService.findRenewalCustomer2(assignParam);
				//对于分配的事务是：10个潜客被分配完成就一个commit
				 List<List<Customer>> assignListAll = new ArrayList<List<Customer>>();
				 if(assignList.size() > 0){
					 int assignNum = 0;
					 assignListAll = SplitListUtil.splitList(assignList,10);
					 for (int i = 0; i < assignListAll.size(); i++) {
						 try{
							 assignCustomerService.systemAssignRenewalCustomer(assignListAll.get(i));
						 }catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(Customer customer : assignListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("分配的潜客失败,失败的潜客的id是:"+customerIds,e);
						 }
						 assignNum = assignNum + assignListAll.get(i).size();
						 logger.info("分配了"+assignNum+"个潜客！");
					 }
				 }
			}
			logger.info("----------系统定时分配潜客结束---------");
			
			
			logger.info("-----------系统定时更新跟踪状态开始------------");
			//根据店的id去查询每家店要更新跟踪状态的潜客
			List<Store> storeList = storeService.findAllStore();
			for(Store store : storeList){
				Integer storeId = store.getStoreId();
				//对于更新潜客跟踪状态的事务是：10个潜客被分配完成就一个commit
				List<RenewalingCustomer> traceList = renewalingCustomerService.findWillTraceCustomer(storeId);
				List<List<RenewalingCustomer>> traceListAll = new ArrayList<List<RenewalingCustomer>>();
				if(traceList.size() > 0){
					int updateNum = 0;
					traceListAll = SplitListUtil.splitList(traceList,10);
					for(int i = 0; i < traceListAll.size(); i++) {
						try{
							assignCustomerService.updateTraceStatuOnTime(traceListAll.get(i));
						}catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(RenewalingCustomer customer : traceListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("系统定时更新跟踪状态失败,失败的潜客的id是:"+customerIds,e);
						}
						updateNum = updateNum + traceListAll.get(i).size();
						 logger.info("更新跟踪状态"+updateNum+"个潜客！");
					}
				}
			}
			logger.info("-----------系统定时更新跟踪状态结束------------");
			
			
			logger.info("-------------系统定时更新潜客脱保状态开始------------");
			//根据店的id去查询每家店要更新潜客脱保状态的潜客
			for(Store store : storeList){
				Integer storeId = store.getStoreId();
				//对于更新潜客脱保状态的事务是：10个潜客被分配完成就一个commit
				List<RenewalingCustomer> updateLostInsurList = renewalingCustomerService.findUpdateCustomerLostStatu(storeId);
				List<List<RenewalingCustomer>> updateLostInsurListAll = new ArrayList<List<RenewalingCustomer>>();
				if(updateLostInsurList.size() > 0){
					int updateNum = 0;
					updateLostInsurListAll = SplitListUtil.splitList(updateLostInsurList,10);
					for(int i = 0; i < updateLostInsurListAll.size(); i++) {
						try{
							assignCustomerService.updateInsuranceDateStatuOnTime(updateLostInsurListAll.get(i));
						}catch(Exception e){
							String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(RenewalingCustomer customer : updateLostInsurListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							logger.info("系统定时更新潜客脱保状态失败,失败的潜客的id是:"+customerIds,e);
						}
						updateNum = updateNum + updateLostInsurListAll.get(i).size();
						 logger.info("更新潜客脱保状态"+updateNum+"个潜客！");
					}
				}
			}
			logger.info("-------------系统定时更新潜客脱保状态结束------------");
			
			/**
			 * 存在一些正常状态的潜客,由于脱保标志紊乱,导致分配后直接进入将脱保或者已脱保
			 * 对于这种数据,现在采用下发的时候就修复这些数据的方案
			 */
			logger.info("----------修复正常潜客分配后进入将脱保的数据开始---------");
			customerService.updateJtbCustomerByRepairData();
			logger.info("----------修复正常潜客分配后进入将脱保的数据结束---------");
			logger.info("----------修复正常潜客分配后进入已脱保的数据开始---------");
			customerService.updateYtbCustomerByRepairData();
			logger.info("----------修复正常潜客分配后进入已脱保的数据结束---------");
		}catch (NoUserAssignException e) {
			logger.info("没有工作人员可以分配！检查该店是否与有建用户！");
		}catch (CustomerAssignException e) {
			logger.info("分配出现异常，插入分配表的map为空！");
		}catch (Exception e) {
			logger.error("分配失败,程序异常",e);
		}
		
	}
	//分配潜客
	@RequestMapping(value = "/assignTest",method={RequestMethod.GET})
	@ResponseBody 
	public BaseResponse systemAssignRenewalCustomerForTest(){
		BaseResponse rs = new BaseResponse(); 
		try {
			logger.info("----------系统定时分配潜客开始---------");
			
			List<Map<String, Integer>> listMap = traceDaySetService.findStoreSetTraceDay();
			for(Map<String,Integer> map : listMap){
				Map<String,Object> reSetParam = new HashMap<String,Object>();
				reSetParam.put("fourSStoreId", map.get("fourSStoreId"));
				reSetParam.put("nextGetCusDayNum", map.get("nextGetCusDayNum"));
				Map<String,Object> assignParam = new HashMap<String,Object>();
				assignParam.put("fourSStoreId", map.get("fourSStoreId"));
				assignParam.put("dayNumber", (0-map.get("dayNumber")));
				assignParam.put("status", 1);
				assignParam.put("customerLevel", "S");
				//根据每家店设置的捞取天数，查询出分配前要重置的潜客
				List<Customer> reSetList = customerService.findRenewalCustomer(reSetParam);
				
				//对于重置潜客信息的事务是：10个潜客处理完就一个commit
				 List<List<Customer>> reSetListAll = new ArrayList<List<Customer>>();
				 if(reSetList.size() > 0){
					 reSetListAll = SplitListUtil.splitList(reSetList,10);
					 for (int i = 0; i < reSetListAll.size(); i++) {
						 try{
							 assignCustomerService.updateReSetCustomer(reSetListAll.get(i));
						 }catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(Customer customer : reSetListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("重置将要分配的潜客失败,失败的潜客的id是:"+customerIds,e);
						 }
					 } 
				 }
				 
				/**
				 * 在2017-08-07号之前,失销后再去修改潜客的保险到期日,来年不会分配,是因为分配标志没有被初始化
				 * 在这将分配标志初始化为1(未分配), 2017-08-09  HuLiangqing 添加
				 * 本年度的,即距离当前时间150天(暂定)以内的失销不处理
				 */
				Integer storeId = map.get("fourSStoreId");
				customerService.updateCustomerByRepairData(storeId);
				 
				 
				 //根据每家店设置的捞取天数，查询出将要分配的潜客
				 List<Customer> assignList = customerService.findRenewalCustomer2(assignParam);
				//对于分配的事务是：10个潜客被分配完成就一个commit
				 List<List<Customer>> assignListAll = new ArrayList<List<Customer>>();
				 if(assignList.size() > 0){
					 int assignNum = 0;
					 assignListAll = SplitListUtil.splitList(assignList,10);
					 for (int i = 0; i < assignListAll.size(); i++) {
						 try{
							 assignCustomerService.systemAssignRenewalCustomer(assignListAll.get(i));
						 }catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(Customer customer : assignListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("分配的潜客失败,失败的潜客的id是:"+customerIds,e);
						 }
						 assignNum = assignNum + assignListAll.get(i).size();
						 logger.info("分配了"+assignNum+"个潜客！");
					 }
				 }
			}
			logger.info("----------系统定时分配潜客结束---------");
			
			
			logger.info("-----------系统定时更新跟踪状态开始------------");
			//根据店的id去查询每家店要更新跟踪状态的潜客
			List<Store> storeList = storeService.findAllStore();
			for(Store store : storeList){
				Integer storeId = store.getStoreId();
				//对于更新潜客跟踪状态的事务是：10个潜客被分配完成就一个commit
				List<RenewalingCustomer> traceList = renewalingCustomerService.findWillTraceCustomer(storeId);
				List<List<RenewalingCustomer>> traceListAll = new ArrayList<List<RenewalingCustomer>>();
				if(traceList.size() > 0){
					int updateNum = 0;
					traceListAll = SplitListUtil.splitList(traceList,10);
					for(int i = 0; i < traceListAll.size(); i++) {
						try{
							assignCustomerService.updateTraceStatuOnTime(traceListAll.get(i));
						}catch(Exception e){
							 String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(RenewalingCustomer customer : traceListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							 logger.info("系统定时更新跟踪状态失败,失败的潜客的id是:"+customerIds,e);
						}
						updateNum = updateNum + traceListAll.get(i).size();
						 logger.info("更新跟踪状态"+updateNum+"个潜客！");
					}
				}
			}
			logger.info("-----------系统定时更新跟踪状态结束------------");
			
			
			logger.info("-------------系统定时更新潜客脱保状态开始------------");
			//根据店的id去查询每家店要更新潜客脱保状态的潜客
			for(Store store : storeList){
				Integer storeId = store.getStoreId();
				//对于更新潜客脱保状态的事务是：10个潜客被分配完成就一个commit
				List<RenewalingCustomer> updateLostInsurList = renewalingCustomerService.findUpdateCustomerLostStatu(storeId);
				List<List<RenewalingCustomer>> updateLostInsurListAll = new ArrayList<List<RenewalingCustomer>>();
				if(updateLostInsurList.size() > 0){
					int updateNum = 0;
					updateLostInsurListAll = SplitListUtil.splitList(updateLostInsurList,10);
					for(int i = 0; i < updateLostInsurListAll.size(); i++) {
						try{
							assignCustomerService.updateInsuranceDateStatuOnTime(updateLostInsurListAll.get(i));
						}catch(Exception e){
							String customerIds = null;
							 StringBuffer sb = new StringBuffer();
							 sb.append("[");
							 for(RenewalingCustomer customer : updateLostInsurListAll.get(i)){
								 Integer customerId = customer.getCustomerId();
								 sb.append(customerId.toString());
								 sb.append(",");
							 }
							 sb.append("]");
							 customerIds = sb.toString();
							logger.info("系统定时更新潜客脱保状态失败,失败的潜客的id是:"+customerIds,e);
						}
						updateNum = updateNum + updateLostInsurListAll.get(i).size();
						 logger.info("更新潜客脱保状态"+updateNum+"个潜客！");
					}
				}
			}
			logger.info("-------------系统定时更新潜客脱保状态结束------------");
			
			/**
			 * 存在一些正常状态的潜客,由于脱保标志紊乱,导致分配后直接进入将脱保或者已脱保
			 * 对于这种数据,现在采用下发的时候就修复这些数据的方案
			 */
			logger.info("----------修复正常潜客分配后进入将脱保的数据开始---------");
			customerService.updateJtbCustomerByRepairData();
			logger.info("----------修复正常潜客分配后进入将脱保的数据结束---------");
			logger.info("----------修复正常潜客分配后进入已脱保的数据开始---------");
			customerService.updateYtbCustomerByRepairData();
			logger.info("----------修复正常潜客分配后进入已脱保的数据结束---------");
			rs.setSuccess(true);
			rs.setMessage("分配成功");
			rs.addContent("status", "OK");
			return rs;
		}catch (NoUserAssignException e) {
			logger.info(e.getMessage());
			rs.setSuccess(false);
			rs.setMessage("分配失败,没有员工可分配");
			rs.addContent("status", "BAD");
			return rs;
		}catch (Exception e) {
			logger.error("分配失败,程序异常",e);
			rs.setMessage("分配失败,程序异常");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs;
		}
		
	}
}
