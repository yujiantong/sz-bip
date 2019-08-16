package com.bofide.bip.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bofide.bip.common.po.CoverType;
import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.exception.CustomerAssignException;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.CustomerUpdateMapper;
import com.bofide.bip.mapper.CustomerUpdateSmsMapper;
import com.bofide.bip.mapper.InsuranceBillMapper;
import com.bofide.bip.mapper.ModuleSetMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.RoleMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.TraceDaySetMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.CustomerUpdate;
import com.bofide.bip.po.CustomerUpdateSms;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Role;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.po.User;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.DealStringUtil;

/**
 * 分配潜客服务类
 * @author qiumingyu
 *
 */
@Service(value = "assignCustomerService")
@Transactional
public class AssignCustomerService {
	private static Logger logger = Logger.getLogger(AssignCustomerService.class);
	@Resource(name="customerMapper")
	private CustomerMapper customerMapper;
	@Resource(name="renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name="customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name="userMapper")
	private UserMapper userMapper;
	@Resource(name="insuranceBillMapper")
	private InsuranceBillMapper insuranceBillMapper;
	@Resource(name="operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	@Resource(name="traceDaySetMapper")
	private TraceDaySetMapper traceDaySetMapper;
	@Resource(name="moduleSetMapper")
	private ModuleSetMapper moduleSetMapper;
	@Resource(name="storeMapper")
	private StoreMapper storeMapper;
	@Resource(name="roleMapper")
	private RoleMapper roleMapper;
	@Autowired
	private UserService userService;
	@Resource(name = "customerUpdateMapper")
	private CustomerUpdateMapper customerUpdateMapper;
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Autowired
	private CustomerService customerService;
	@Resource(name="customerUpdateSmsMapper")
	private CustomerUpdateSmsMapper customerUpdateSmsMapper;
	/**
	 * 禁用用户时分配接口
	 * @param customerList
	 * @param id 被分配前,该潜客的持有人id
	 * @param userId 操作人id,即进行禁用的用户id
	 * @throws Exception
	 */
	public void systemAssignForbidden(List<RenewalingCustomer> customerList,Integer id,Integer userId) throws Exception {
		for(RenewalingCustomer renewalingCustomer : customerList){
			Integer fourSStoreId = renewalingCustomer.getFourSStoreId();
			Integer renewalType = renewalingCustomer.getRenewalType();
			Integer customerId = renewalingCustomer.getCustomerId();
			Date virtualJqxdqr = renewalingCustomer.getVirtualJqxdqr();
			//查询目前分配潜客最少的续保专员
			Integer roleId = RoleType.XBZY;
			User user = userService.findAssignCustomerUser(roleId,fourSStoreId,renewalType);
			
			//插入一条跟踪记录
			User proUser = userMapper.findUserByIdIsNoDel(id, fourSStoreId);
			User operatUser = userMapper.findUserByIdIsNoDel(userId, fourSStoreId);
			String operation = "禁用";
			String context = "潜客从" + proUser.getUserName() + "手中分给" + user.getUserName();
			String traceContext = DealStringUtil.dealTraceRecordContent(operation,context,operatUser.getUserName());
			String lastTraceResult = DealStringUtil.dealLastTraceResult(operation,operatUser.getUserName());
			customerService.addTraceRecord(renewalingCustomer.getPrincipalId(), renewalingCustomer.getPrincipal()
					, customerId, traceContext, lastTraceResult, null, null, userId);
			
			
			//将该潜客的负责人更新为目前分配最少的续保专员(销售顾问被禁用应该全部分配续保专员，如果没有负责人id则又会分配该销售顾问)
			Map<String,Object> updateParam = new HashMap<String,Object>();
			updateParam.put("principalId", user.getId());
			updateParam.put("principal", user.getUserName());
			updateParam.put("customerId", customerId);
			customerMapper.updateCustomerInfo(updateParam);
			renewalingCustomerMapper.updateRenewalingCustomerInfo(updateParam);
			Map<String, Object> map = toListMap(renewalingCustomer,user);
			Map<String,Object> param2 = new HashMap<String,Object>();
			param2.put("userId", user.getId());
			param2.put("customerId", customerId);
			//根据潜客id和用户id查询是否存在没有跟踪完成的分配记录
			CustomerAssign assignRecode = customerAssignMapper.findIsAssign(param2);
			if(assignRecode != null){
				//如果不为空，此时不insert新的记录，而是更新该记录
				map.put("customerId", customerId);
				map.put("userId", user.getId());
				map.put("traceStatu", 0);
				map.put("traceDate", null);
				map.put("inviteStatu", null);
				map.put("inviteDate", null);
				map.put("acceptStatu", 1);
				map.put("acceptDate", null);
				map.put("returnStatu", null);
				map.put("returnDate",null);
				map.put("customerTraceId", null);
				map.put("assignDate", new Date());
				map.put("delayDate",null);
				customerAssignMapper.update2(map);
			}else{
				if(map != null){
					customerAssignMapper.insert(map);
				}
			}
			//向操作记录表insert当前操作记录,表示分配
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("customerId", map.get("customerId"));
			param.put("userId", map.get("userId"));
			param.put("operationFlag", 6);
			param.put("coverType", renewalType);
			param.put("virtualJqxdqr",virtualJqxdqr);
			operationRecordMapper.insert(param);
			
		}
	}
	


	/**
	 * 新增潜客时分配接口
	 * @param customerList
	 * @param fourSStoreId
	 * @throws Exception
	 */
	public void systemAssignRenewalCustomer(List<Customer> customerList, Integer fourSStoreId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", fourSStoreId);
		param.put("customerLevel", "Z");
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceTimeByCl(param);
		Integer dayNumber = traceDaySet.getDayNumber();
		//获取新增潜客的保险到期日
		Customer customer = customerList.get(0);
		Date virtualJqxdqr = customer.getVirtualJqxdqr();
		Integer customerId = customer.getCustomerId();
		//（2016-11-24打补丁）理由：举个例子当添加一个2017-01-15的潜客，生成的虚拟保险到期日为2016-01-15，导致不能及时分配（虽然定时任务会晚上维护）
		//所以只要把这类型的潜客的需要跟定时任务一样维护起他的虚拟保险到期日
		//如果保险虚拟保险到期日小于当前时间，当前日期在该虚拟保险到期日加上365-首次提醒天数和虚拟保险到期日加一年之前，则加一年
		//反之维持不变
		//判断虚拟保险到期日是否是小于当前时间，如果是则应该维护
		Calendar vjCal = Calendar.getInstance();
		vjCal.setTime(virtualJqxdqr);
		Calendar curCal = Calendar.getInstance();
		Date curDate = DateUtil.formatDate(curCal);
		long curDateTime = curDate.getTime();
		long oldVirtualJqxdqrTime = virtualJqxdqr.getTime();
		if(oldVirtualJqxdqrTime <= curDateTime){
			//获得该潜客今年应该被分配的最晚一天
			Calendar nextYearVjCal = Calendar.getInstance();
			nextYearVjCal.setTime(virtualJqxdqr);
			nextYearVjCal.add(Calendar.YEAR, 1);
			Date nextYearVj = DateUtil.formatDate(nextYearVjCal);
			//获得该潜客今年应该被分配的最早一天
			Calendar assignVjCal = Calendar.getInstance();
			assignVjCal.setTime(virtualJqxdqr);
			assignVjCal.add(Calendar.DAY_OF_MONTH, dayNumber);
			Date assignVj = DateUtil.formatDate(assignVjCal);
			//如果新增潜客操作时间在分配的最早一天与最晚一天之间就让潜客的虚拟保险到期日加一年使之可以被分配
			if(curDateTime >= assignVj.getTime() && curDateTime <= nextYearVj.getTime()){
				//update该潜客的虚拟保险到期日
				vjCal.add(Calendar.YEAR, 1);
				Date newVirtualJqxdqr = DateUtil.formatDate(vjCal);
				Map<String,Object> map = new HashMap<String,Object>();
				map.put("customerId", customerId);
				map.put("newVirtualJqxdqr", newVirtualJqxdqr);
				customerMapper.updateCustomerInfo(map);
				customer.setVirtualJqxdqr(newVirtualJqxdqr);
			}
		}
		Date updateAfterVirtualJqxdqr = customer.getVirtualJqxdqr();
		long newVirtualJqxdqrTime = updateAfterVirtualJqxdqr.getTime();
		//计算保险到期日提前dayNumber捞取的天数的时间
		vjCal.add(Calendar.DAY_OF_MONTH, (1-dayNumber));
		Date assignDate = DateUtil.formatDate(vjCal);
		long assignDateTime = assignDate.getTime();
		
		//如果当前日期在大于等于assignDate，小于等于virtualJqxdqr就符合分配
		if( curDateTime >= assignDateTime && curDateTime <= newVirtualJqxdqrTime ){
			//更新潜客的投保类型和分配状态
			updateCustomer(customerList);
			//查询出已经分配在将要续保的潜客表
			List<RenewalingCustomer> AssignCustomerList = renewalingCustomerMapper.findAssignCustomer(customerList);
			//分配
			systemAssign(AssignCustomerList);
			//判断是否需要加入定时短信发布临时表
			List<ModuleSet> ms = moduleSetMapper.selectByFoursStoreId(fourSStoreId);
			Integer update = 0;
			Integer updateSMS = 0;
    		for(int j=0;j<ms.size();j++){
    			if(ms.get(j).getModuleName().equals("update")){
    				update = ms.get(j).getSwitchOn();
    			}
    			if(ms.get(j).getModuleName().equals("updateSMS")){
    				updateSMS = ms.get(j).getSwitchOn();
    			}
    		}
    		if(updateSMS==1){
    			//把新增需要分配的潜客加入定时短信发布临时表
    			CustomerUpdateSms customerUpdateSms = new CustomerUpdateSms();
    			customerUpdateSms.setStoreId(fourSStoreId);
    			customerUpdateSms.setCustomerId(customerId);
    			customerUpdateSmsMapper.insert(customerUpdateSms);
    		}
    		//判断是否需要加入续险临时表
    		Store store = storeMapper.selectByPrimaryKey(fourSStoreId);
			if(store.getBhDock()==1||store.getBhDock()==2){
				if(update==1){
        			//把新增需要分配的潜客加入获取续险临时表
        			CustomerUpdate customerUpdate = new CustomerUpdate();
        			customerUpdate.setStoreId(fourSStoreId);
        			customerUpdate.setCustomerId(customerId);
        			customerUpdateMapper.insert(customerUpdate);
        		}
			}
			
			//更新潜客脱保状态
			updateInsuranceDateStatuOnTime(AssignCustomerList);
		}
		
	}
	
	
	
	/**
	 * 系统定时分配前重置潜客
	 * nextGetCusDayNum 指的是加入虚拟保险到期日是2016-8-31，那明年捞取的时候应该是2017-6-1日，nextGetCusDayNum = 2017-6-1和2016-8-31间隔的天数
	 */
	public void updateReSetCustomer(List<Customer> assignList) throws Exception{
		for(Customer customer : assignList){
			//更新虚拟保险到期日，为了重新分配
			Date newVirtualJqxdqr = getNewVirtualJqxdqr(customer.getVirtualJqxdqr());
			Map<String,Object> updateParam = new HashMap<String,Object>();
			updateParam.put("newVirtualJqxdqr", newVirtualJqxdqr);
			updateParam.put("customerId", customer.getCustomerId());
			updateParam.put("status", 1);
			updateParam.put("cusLostInsurStatu", 0);
			//重置将要分配的潜客，虚拟保险到期日更新新的一年，分配状态更新为未分配，潜客脱保状态更新为初始状态
			customerMapper.reSetCustomer(updateParam);//o
		}
	}
	
	
	
	public Date getNewVirtualJqxdqr(Date virtualJqxdqr) throws ParseException {
		//获取来年的虚拟保险到期日
		Calendar vjCalendar = Calendar.getInstance();
		vjCalendar.setTime(virtualJqxdqr);
		String nextVjYearStr = new Integer(vjCalendar.get(Calendar.YEAR)+1).toString();
		String vjMonthStr = new Integer(vjCalendar.get(Calendar.MONTH)+1).toString();
		String vjDayStr = new Integer(vjCalendar.get(Calendar.DAY_OF_MONTH)).toString();
		StringBuffer sb = new StringBuffer();
		sb.append(nextVjYearStr);
		sb.append("-");
		sb.append(vjMonthStr);
		sb.append("-");
		sb.append(vjDayStr);
		String newVjStr = sb.toString();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date newVirtualJqxdqr = sdf.parse(newVjStr);
		return newVirtualJqxdqr;
	}
	
	
	/**
	 * 系统定时分配
	 * @param assignList2 
	 * @throws Exception
	 */
	public void systemAssignRenewalCustomer(List<Customer> assignList) throws Exception {
		if(assignList.size() != 0){
			long startTime = new Date().getTime();
			//获取去年分配过的用户，为了给AssignCustomerList中的fictitiousCustomerLevel赋值
			List<RenewalingCustomer> tempCustomerList = renewalingCustomerMapper.findAssignCustomer(assignList);
			//获取将要续保的潜客
			updateCustomer(assignList);
			long endTime = new Date().getTime();
			//查询出已经分配在将要续保的潜客表
			List<RenewalingCustomer> AssignCustomerList = renewalingCustomerMapper.findAssignCustomer(assignList);
			//现在需要将tempCustomerList中的潜客级别customerLevel按一一对应放到AssignCustomerList中的fictitiousCustomerLevel中
			AssignCustomerList = replacementAdd(tempCustomerList, AssignCustomerList);
			long endTime2 = new Date().getTime();
			//分配
			systemAssign(AssignCustomerList);
			
			//判断是否需要加入定时短信发布临时表
			List<ModuleSet> ms = moduleSetMapper.selectByFoursStoreId(assignList.get(0).getFourSStoreId());
			Integer update = 0;
			Integer updateSMS = 0;
    		for(int j=0;j<ms.size();j++){
    			if(ms.get(j).getModuleName().equals("update")){
    				update = ms.get(j).getSwitchOn();
    			}
    			if(ms.get(j).getModuleName().equals("updateSMS")){
    				updateSMS = ms.get(j).getSwitchOn();
    			}
    		}
    		if(updateSMS==1){
    			//把新增需要分配的潜客加入定时短信发布临时表
    			CustomerUpdateSms customerUpdateSms = new CustomerUpdateSms();
    			for(int i=0;i<assignList.size();i++){
    				customerUpdateSms.setStoreId(assignList.get(i).getFourSStoreId());
        			customerUpdateSms.setCustomerId(assignList.get(i).getCustomerId());
        			customerUpdateSmsMapper.insert(customerUpdateSms);
    			}
    		}
    		
			//判断是否需要加入续险临时表
    		Store store = storeMapper.selectByPrimaryKey(assignList.get(0).getFourSStoreId());
			if(store.getBhDock()==1||store.getBhDock()==2){
				if(update==1){
        			//把需要分配的潜客加入获取续险临时表
        			CustomerUpdate customerUpdate = new CustomerUpdate();
        			for(int i=0;i<assignList.size();i++){
        				customerUpdate.setStoreId(assignList.get(i).getFourSStoreId());
        				customerUpdate.setCustomerId(assignList.get(i).getCustomerId());
        				customerUpdateMapper.insert(customerUpdate);
        			}
        		}
			}
			//
			long endTime3 = new Date().getTime();
			logger.info("updateCustomer方法耗时1："+(endTime-startTime)+";findAssignCustomer方法耗时2："+(endTime2-endTime)+";systemAssign方法耗时3: "+(endTime3-endTime2));
		}
	}


    /**
     * 将tempCustomerList中的customerLevel根据customerId赋值到AssignCustomerList中的fictitiousCustomerLevel
     * @param tempCustomerList
     * @param AssignCustomerList
     * @return
     */
	private List<RenewalingCustomer> replacementAdd(List<RenewalingCustomer> tempCustomerList,
			List<RenewalingCustomer> AssignCustomerList) {
		List<RenewalingCustomer> list = new ArrayList<>();
		for (RenewalingCustomer AssignCustomer : AssignCustomerList) {
			Integer assignCustomerId = AssignCustomer.getCustomerId();
			for (RenewalingCustomer tempCustomer : tempCustomerList) {
				Integer tempCustomerId = tempCustomer.getCustomerId();
				if(tempCustomerId.equals(assignCustomerId)){
					AssignCustomer.setFictitiousCustomerLevel(tempCustomer.getCustomerLevel());
					AssignCustomer.setFictitiousprincipalId(tempCustomer.getPrincipalId());
					AssignCustomer.setFictitiousprincipal(tempCustomer.getPrincipal());
					System.out.println(tempCustomer.getCustomerId()+"-----"+tempCustomer.getCustomerLevel());
					System.out.println("---------分割线---------");
				}
				list.add(AssignCustomer);
			}
		}
		
		return list;
	}
	

	/**
	 * 捞取完潜客，则根据上年的投保类型修改今年的投保类型
	 * 首次：
	 * 新转续：if当次跟踪生成保单改为“续”，否则改为“间”
	 * 间转续：if当次跟踪生成保单改为“续”，否则改为“间”
	 * 潜转续：if当次跟踪生成保单改为“续”，否则改为“潜”
	 * 续转续：if当次跟踪生成保单改为“续”，否则改为“间”
	 * @param list
	 * @return
	 * @throws Exception
	 */
	public void updateCustomer(List<Customer> list) throws Exception {
		List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
		for(Customer customer : list){
			/*customer.setCusLostInsurStatu(0);*/
			customer.setCustomerLevel("A");
			customer.setStatus(2);
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("customerLevel", "A");
			param.put("status", 2);
			param.put("customerId", customer.getCustomerId());
			Integer renewalType = customer.getRenewalType();
			Integer lastYearIsDeal = customer.getLastYearIsDeal();
			//更新潜客投保类型
			if(lastYearIsDeal == 1){//如果上一年成交了，只需将该状态重置为0；加入生成保单则会其他程序更新为1
				customer.setLastYearIsDeal(0);
				param.put("lastYearIsDeal", 0);
				/*lastYearIsDeal = 0;
				customerMapper.updateLastYearIsDeal(lastYearIsDeal,customerId);*/
				listMap.add(param);
			}else{
				if(renewalType == CoverType.XINZHUANXU){
					//如果是新转续，上一年没有成交保单，则都改为间转续
					customer.setRenewalType(4);
					param.put("renewalType", 4);
					listMap.add(param);
				}else if(renewalType == CoverType.XUZHUANXU || renewalType == CoverType.JIANZHUANXU ){
					//如果是续转续，间转续，上一年没有成交保单，则都改为间转续
					customer.setRenewalType(4);
					param.put("renewalType", 4);
					listMap.add(param);
				}else if(renewalType == CoverType.QIANZHUANXU ){
					//如果是潜转续，上一年没有成交保单，则都改为潜转续
					customer.setRenewalType(5);
					param.put("renewalType", 5);
					listMap.add(param);
				}else if(renewalType == CoverType.SHOUCI ){
					//如果是首次，上一年没有成交保单，则都改为首次
					customer.setRenewalType(6);
					param.put("renewalType", 6);
					listMap.add(param);
				}
			}
		}
		for(Map<String,Object> map : listMap){
			customerMapper.updateCustomerInfo(map);
		}

		//如果存在上一年记录，则清除上一年被分配的潜客，否则直接插入
		List<RenewalingCustomer> findAssignCustomer = renewalingCustomerMapper.findAssignCustomer(list);
		
		if(findAssignCustomer.size()>0){
			List<Customer> deleteListRenewalingCustomer = new ArrayList<Customer>();
			for (int i = 0; i < findAssignCustomer.size(); i++) {
				Customer customer = new Customer();
				customer.setCustomerId((findAssignCustomer.get(i).getCustomerId()));
				deleteListRenewalingCustomer.add(customer);
			}
			//System.out.println("deleteListRenewalingCustomer size ==>"+deleteListRenewalingCustomer.size());
			renewalingCustomerMapper.deleteExist(deleteListRenewalingCustomer);
		}
		
		//如果存在上一年分配记录，则清除上一年的分配，否则直接插入
		List<CustomerAssign> selectExistAssign = customerAssignMapper.selectExistAssign(list);
		
		if(selectExistAssign.size()>0){
			List<Customer> deleteListCustomerAssign = new ArrayList<Customer>();
			 
			for (int i = 0; i < selectExistAssign.size(); i++) {
				Customer customer = new Customer();
				customer.setCustomerId(selectExistAssign.get(i).getCustomerId());
				deleteListCustomerAssign.add(customer);
			}
			 //System.out.println("deleteListCustomerAssign size ==>"+deleteListCustomerAssign.size());
			customerAssignMapper.deleteExistAssign(deleteListCustomerAssign);
		}
		
		insertUnAssignCustomer(list);
	}

	

	private void insertUnAssignCustomer(List<Customer> list) throws Exception {
		// 将未被分配的潜客添加到将要续保的潜客表
		for(Customer customer : list){
			//现在将续保的潜客表里的负责人Id和负责人先置空，在systemAssign方法中补回去
			customer.setPrincipalId(null);
			customer.setPrincipal(null);
			renewalingCustomerMapper.insertUnAssignCustomer(customer);
		}
		
	}


	/**
	 * 将未被分配的潜客添加到将要续保的潜客表
	 * @param list
	 * @return
	 * @throws Exception
	 */
//	public void saveUnAssignCustomer(List<Customer> list) throws Exception {
///*		
//		//如果存在上一年记录，则清除上一年被分配的潜客，否则直接插入
//		int deleteNum = renewalingCustomerMapper.deleteExist(list);
//		//如果存在上一年分配记录，则清除上一年的分配，否则直接插入
//		int deleteAssignNum = customerAssignMapper.deleteExistAssign(list);*/
//		//如果存在上一年记录，则清除上一年被分配的潜客，否则直接插入
//			List<RenewalingCustomer> findAssignCustomer = renewalingCustomerMapper.findAssignCustomer(list);
//			
//			if(findAssignCustomer.size()>0){
//				List<Customer> deleteListRenewalingCustomer = new ArrayList<Customer>();
//				for (int i = 0; i < findAssignCustomer.size(); i++) {
//					Customer customer = new Customer();
//					customer.setCustomerId((findAssignCustomer.get(i).getCustomerId()));
//					deleteListRenewalingCustomer.add(customer);
//				}
//				//System.out.println("deleteListRenewalingCustomer size ==>"+deleteListRenewalingCustomer.size());
//				renewalingCustomerMapper.deleteExist(deleteListRenewalingCustomer);
//			}
//			
//			//如果存在上一年分配记录，则清除上一年的分配，否则直接插入
//			List<CustomerAssign> selectExistAssign = customerAssignMapper.selectExistAssign(list);
//			
//			if(selectExistAssign.size()>0){
//				List<Customer> deleteListCustomerAssign = new ArrayList<Customer>();
//				 
//				for (int i = 0; i < selectExistAssign.size(); i++) {
//					Customer customer = new Customer();
//					customer.setCustomerId(selectExistAssign.get(i).getCustomerId());
//					deleteListCustomerAssign.add(customer);
//				}
//				 //System.out.println("deleteListCustomerAssign size ==>"+deleteListCustomerAssign.size());
//				customerAssignMapper.deleteExistAssign(deleteListCustomerAssign);
//			}
//		for (Customer customer : list) {
//			customer.setStatus(2);
//		}
//		// 将未被分配的潜客添加到将要续保的潜客表
//		insertUnAssignCustomer(list);
//	}
//	
	
	/**
	 * 根据潜客的投保类型进行分配
	 * @param assignCustomerList
	 * @return
	 * @throws Exception
	 */
	public void systemAssign(List<RenewalingCustomer> assignCustomerList) throws Exception {
		for(RenewalingCustomer renewalingCustomer : assignCustomerList){
			Map<String, Object> map = null;
			Integer customerId = renewalingCustomer.getCustomerId();
			Integer renewalType = renewalingCustomer.getRenewalType();
			Integer fourSStoreId = renewalingCustomer.getFourSStoreId();
			Integer clerkId = renewalingCustomer.getClerkId();
			Integer principalId = renewalingCustomer.getPrincipalId();
			Date virtualJqxdqr = renewalingCustomer.getVirtualJqxdqr();
			Integer fictitiousprincipalId = renewalingCustomer.getFictitiousprincipalId();//虚拟的负责人Id，原来的
			String fictitiousprincipal = renewalingCustomer.getFictitiousprincipal();//虚拟的负责人，原来的
			//新的下发规则--失销客户分配设置：0：原负责人优先分配  1：按无负责人分配
			List<ModuleSet> ms = moduleSetMapper.selectByFoursStoreId(fourSStoreId);
			int responsible_person = 0;//默认原负责人优先分配
			for(int i=0;i<ms.size();i++){//判断用哪个分配规则
				if(ms.get(i).getModuleName().equals("responsible_person")){
					responsible_person = ms.get(i).getSwitchOn();
				}
			}
			System.out.println(renewalingCustomer.getCustomerId() +"---级别++++++----"+renewalingCustomer.getFictitiousCustomerLevel());
			String fictitiousCustomerLevel = renewalingCustomer.getFictitiousCustomerLevel();
			//查找该用户是否是存在的，或者状态是启用的
			User user = userMapper.selectByPrimaryKey(fictitiousprincipalId, fourSStoreId);
			//直接分配给原负责人   2019-05-08  yujiantong  
			if(responsible_person == 0 && "F".equals(fictitiousCustomerLevel) && user != null){
				//将大池子里的负责人Id和负责人set到小池子里面，分配时可直接分配给原负责人
				map = coverTypeAssign(renewalingCustomer, customerId, renewalType, fourSStoreId, clerkId, fictitiousprincipalId);
				map.put("userId", fictitiousprincipalId);
				renewalingCustomerMapper.updatePrincipal(customerId, fictitiousprincipalId, fictitiousprincipal);
				customerMapper.updatePrincipal(customerId, fictitiousprincipalId, fictitiousprincipal);
			}else{
				//这里也就是responsible_person=1的时候，按无负责人分配,相当于系统原来的分配方式
				map = coverTypeAssign(renewalingCustomer, customerId, renewalType, fourSStoreId, clerkId, principalId);
			}
			
			if(map != null){
				customerAssignMapper.insert(map);
				//向操作表insert当前操作记录
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("customerId", map.get("customerId"));
				param.put("userId", map.get("userId"));
				param.put("operationFlag", 6);
				param.put("coverType", renewalType);
				param.put("virtualJqxdqr", virtualJqxdqr);
				operationRecordMapper.insert(param);
			}else{
				throw new CustomerAssignException("插入分配表数据为空，分配异常！");
			}
		}
	}


	/**
	 * 投保类型分配共用方法 
	 * 将原有的方法提出来，为了新增分配方式
	 * 2019-05-08
	 */
	private Map<String, Object> coverTypeAssign(RenewalingCustomer renewalingCustomer, Integer customerId,
			Integer renewalType, Integer fourSStoreId, Integer clerkId, Integer principalId) throws Exception {
		Map<String, Object> map;
		//如果投保类型为新转续则首先分配该销售顾问，如果该模块开启
		if(renewalType == CoverType.XINZHUANXU){
			//如果业务员id为空，说明该潜客没有业务员跟踪，则分配给续保专员
			if(clerkId != null){
				//如果该业务员是销售顾问则分配给该销售顾问，否则分配续保专员
				User clerk = userMapper.findRoleByUserId(clerkId);
				if(clerk != null){
					Integer roleId = clerk.getRoleId();
					if(roleId == RoleType.XSGW){
						map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,clerkId);
					}else{
						roleId = RoleType.XBZY;
						map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
					}
				}else{
					//如果clerkId没有则分配你续保专员
					Integer roleId = RoleType.XBZY;
					map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
				}
			}else{//如果clerkId没有则分配你续保专员
				Integer roleId = RoleType.XBZY;
				map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
			}
		}else if(renewalType == CoverType.QIANZHUANXU){//如果投保类型为潜转续首先分配该服务顾问，如果该模块开启
			if(clerkId != null){
				User clerk = userMapper.findRoleByUserId(clerkId);
				if(clerk != null){
					Integer roleId = clerk.getRoleId();
					if(roleId == RoleType.FWGW){
						map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,clerkId);
					}else{
						roleId = RoleType.XBZY;
						map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
					}
				}else{
					//如果clerkId没有则分配你续保专员
					Integer roleId = RoleType.XBZY;
					map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
				}
			}else{//如果clerkId没有则分配你续保专员
				Integer roleId = RoleType.XBZY;
				map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
			}
		}else {
			//如果在捞取转换投保类型为续转续或者间转续则说明该潜客只分配给续保专员，上一年的业务员则要去掉
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("clerk", "");
			param.put("clerkId", 0);
			param.put("customerId", customerId);
			customerMapper.updateCustomerInfo(param);
			renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
			Integer roleId = RoleType.XBZY;
			map = systemAssignCustomerToWorker(renewalingCustomer,fourSStoreId,roleId,principalId);
		}
		return map;
	}
	
	
	public Map<String, Object> systemAssignCustomerToWorker(RenewalingCustomer renewalingCustomer,Integer fourSStoreId,Integer roleId,Integer workId) throws Exception {
		Integer renewalType = renewalingCustomer.getRenewalType();
		Integer customerId = renewalingCustomer.getCustomerId();
		User assignUser = systemAssignWorkerRule(roleId,workId,fourSStoreId,renewalType,customerId);
		Map<String, Object> map = null;
		if(assignUser != null){
			logger.info("分配给该工作人员的详情："+assignUser.toString());
			//根据分配到的员工，update潜客的负责人或者是业务员
			updatePrincipalOrClerk(assignUser,renewalingCustomer);
			map = toListMap(renewalingCustomer, assignUser);
		}else{
			throw new NoUserAssignException("没有工作人员可以分配。");
		}
		return map;
	}
	/**
	 * 根据分配到的员工，update潜客的负责人或者是业务员
	 * @param assignUser
	 * @param renewalingCustomer 
	 * @throws Exception 
	 */
	private void updatePrincipalOrClerk(User assignUser, RenewalingCustomer renewalingCustomer) throws Exception {
		Integer roleId = assignUser.getRoleId();
		Integer userId = assignUser.getId();
		Integer customerId = renewalingCustomer.getCustomerId();
		String name = assignUser.getUserName();
		if(roleId == RoleType.XBZY){//如果是分配给续保专员则将续保专员置入潜客表中的负责人和负责人id
			renewalingCustomerMapper.updatePrincipal(customerId, userId, name);
			customerMapper.updatePrincipal(customerId, userId, name);
		}else if(roleId == RoleType.XSGW || roleId == RoleType.FWGW){//如果是分配给销售顾问或者服务顾问则将销售顾问或者服务顾问置入潜客表中的业务员和业务员id
			renewalingCustomerMapper.updateClerk(customerId, userId, name);
			customerMapper.updateClerk(customerId, userId, name);
		}
	}
	
	
	/**
	 * 系统分配规则,每家店的潜客只能分配给该店的工作人员
	 * 2016-12-06更新
	 * 需要1：按投保类型平均分给续保专员
	 * @param roleId
	 * @param workerId
	 * @param fourSStoreId 
	 * @param renewalType 
	 * @param customerId 
	 * @return
	 * @throws Exception 
	 */
	public User systemAssignWorkerRule(Integer roleId, Integer workerId, Integer fourSStoreId, Integer renewalType, Integer customerId) throws Exception {
		User assignUser = null;
		if(workerId != null){
			User user = userMapper.findRoleByUserId2(workerId);
			if(user != null){
				//如果用户不为空,用户是续保专员并且状态是正常的，则分配给该用户
				Integer status = user.getStatus();
				if(status == 0 ){
					if(user.getRoleId() == RoleType.XBZY){
						assignUser = user;
						
					}else if(user.getRoleId() == RoleType.XSGW || user.getRoleId() == RoleType.FWGW){
						List<ModuleSet> moduleSetList = moduleSetMapper.findOpenModuleSet(fourSStoreId);
						boolean flag = isOpenModule(roleId,moduleSetList);
						if(flag == true){
							assignUser = user;
						}else{
							roleId = RoleType.XBZY;
							//获取分配该投保类型最少的潜客的工作人员
							assignUser =  findLeastCustomerByWorker(roleId,fourSStoreId,renewalType);
						}
					}
				}else if (status == 1){
					Customer customer = customerMapper.selectByPrimaryKey(customerId);
					Integer createrId = customer.getCreaterId();
					if(createrId != null){
						assignUser = user;
					}else{
						assignUser = findLeastCustomerByWorker(roleId,fourSStoreId,renewalType);
					}
				}
			}else{
				//获取分配最少的潜客的工作人员
				assignUser =  findLeastCustomerByWorker(roleId,fourSStoreId,renewalType);
			}
		}else{
			//获取分配最少的潜客的工作人员
			assignUser =  findLeastCustomerByWorker(roleId,fourSStoreId,renewalType);
		}
		return assignUser;
	}
	
	/**
	 * 根据传递过来的roleId判断该模块是否开启，是的话就返回true，否则返回false
	 * @param roleId
	 * @param moduleSetList
	 * @return
	 */
	private boolean isOpenModule(Integer roleId, List<ModuleSet> moduleSetList) {
		boolean flag = false;
		for(ModuleSet moduleSet : moduleSetList){
			String moduleName = moduleSet.getModuleName();
			if(roleId == RoleType.XSGW && moduleName.equals("sale")){
				flag = true;
			}else if(roleId == RoleType.FWGW && moduleName.equals("afterSale")){
				flag = true;
			}
		}
		return flag;
	}
	/**
	 * 获取分配该投保类型潜客最少的员工
	 * @param roleId
	 * @param fourSStoreId 
	 * @param renewalType 
	 * @return
	 * @throws Exception 
	 */
	public User findLeastCustomerByWorker(Integer roleId, Integer fourSStoreId, Integer renewalType) throws Exception {
		//根据roleId，fourSStoreId，renewalType查询出该店所有的该角色的持有潜客的数量情况，并从小到大排序
		Map<String, Object> param = new HashMap<String,Object>();
		param.put("roleId", roleId);
		param.put("fourSStoreId", fourSStoreId);
		param.put("renewalType", renewalType);
		List<Map<String,Object>> listMap = userMapper.findUserHoldCustomerNum(param);
		User assignUser = null;
		if(listMap.size() > 0){
			List<ModuleSet> ms = moduleSetMapper.selectByFoursStoreId(fourSStoreId);
			int distribution = 0;
			for(int i=0;i<ms.size();i++){//判断用哪个分配规则
				if(ms.get(i).getModuleName().equals("distribution")){
					distribution = ms.get(i).getSwitchOn();
				}
			}
			if(distribution==0){//原来的分配规则
				Map<String, Object> map = listMap.get(0);//取当前投保类型的持有潜客的最少的人
				Integer userId = (Integer)map.get("userId");
				assignUser = userMapper.selectByPrimaryKey(userId, fourSStoreId);
			}else{//新增的分配规则
				List<User> users = userMapper.findUserByDistribution(param);//查询上次分配少分配的所有人
				Map<String, Object> map1 = new HashMap<String,Object>();
				if(users==null||users.size()==0){//这种情况是上次少分配的人被禁用或者停用了，导致这次查不到少分配的人
					map1.put("storeId", fourSStoreId);
					map1.put("roleId", roleId);
					map1.put("renewalType", renewalType);
					map1.put("num", 0);
					findUserByResolveDeadlock(map1);//为解决死锁先去查询，然后根据主键更新
					//userMapper.updateUserByDistribution(map1);//出现死锁
					users = userMapper.findUserByDistribution(param);
				}
				Integer userId = users.get(0).getId();
				assignUser = userMapper.selectByPrimaryKey(userId, fourSStoreId);
				Map<String, Object> map = new HashMap<String,Object>();
				if(users.size()==1){//如果查询到少分配的的人只有一个，这个时候把这个投保类型的标志全部重置为0
					map.put("storeId", fourSStoreId);
					map.put("roleId", roleId);
					map.put("renewalType", renewalType);
					map.put("num", 0);
				}else{//如果查询倒少分配的人有多个，这个时候只需要把当前返回的人的投保类型的标志变成1
					map.put("userId", userId);
					map.put("renewalType", renewalType);
					map.put("num", 1);
				}
				findUserByResolveDeadlock(map);//为解决死锁先去查询，然后根据主键更新
				//userMapper.updateUserByDistribution(map);
			}
		}else{
			Store store = storeMapper.selectByPrimaryKey(fourSStoreId);
			Role role = roleMapper.findRoleNameByRoleId(roleId);
			String roleName = role.getRoleName();
			String storeName = store.getStoreName();
			String errorMessage = storeName+"没有角色为"+roleName+"的用户可以被分配，请检查你的用户状态或者新建该类型的用户";
			logger.info(errorMessage);
		}
		return assignUser;
	}

	/**
	 * 分配潜客出现死锁，先查出来，在根据主键更新
	 */
	public void findUserByResolveDeadlock(Map<String, Object> map){
	    	try {
		    		List<User> list = userMapper.findUserByResolveDeadlock(map);
		     		if(list.size()>0){
		    			for(int i=0;i<list.size();i++){
		        			Integer userId=list.get(i).getId();
		        			map.put("userId", userId);
		        			userMapper.updateUserByResolveDeadlock(map);
		        		}
		    		}
			} catch (Exception e) {
				logger.info("解决死锁出现异常",e);
			}
    }
	/**
	 * 将数据转成map的形式例如：[{"userId":"1","roleName":"出单员"}]这样的格式+
	 * @param userList
	 * @return
	 */
	public List<Map<String, Object>> toMap(List<User> userList) {
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		for(User user : userList){
			Map<String,Object> map = new HashMap<String,Object>();
			Integer userId = user.getId();
			String roleName = user.getRole().getRoleName();
			Integer storeId = user.getStoreId();
			Integer roleId = user.getRoleId();
			String name = user.getUserName();
			map.put("userId", userId);
			map.put("roleName", roleName);
			map.put("storeId", storeId);
			map.put("roleId", roleId);
			map.put("name", name);
			list.add(map);
		}
		return list;
	}

	/**
	 * 定时更新分配表的跟踪状态
	 * @param list 
	 * @return
	 * @throws Exception
	 */
	public Integer updateTraceStatuOnTime(List<RenewalingCustomer> list) throws Exception {
		List<Map<String,Object>> paramList = new ArrayList<Map<String,Object>>();
		for(RenewalingCustomer renewalingCustomer : list){
			Integer customerId = renewalingCustomer.getCustomerId();
			Map<String,Object> param = new HashMap<String,Object>();
			//获取该潜的的所有跟踪记录
			List<CustomerAssign> assigns = renewalingCustomer.getCustomerAssigns();
			for(CustomerAssign customerAssign : assigns){
					Integer userId = customerAssign.getUserId();
					param.put("userId", userId);
					param.put("customerId", customerId);
					paramList.add(param);
			}
		}
		int updateCount = 0;
		for(Map<String,Object> map : paramList){
			int updateNum = customerAssignMapper.updateTraceStatuOnTime(map);//????
			updateCount+=updateNum;
		}
		return updateCount;
	}
	
	
	/**
	 * 定时更新分配表的保单日期状态
	 * @throws Exception
	 */
	public void updateInsuranceDateStatuOnTime(List<RenewalingCustomer> list) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		for (RenewalingCustomer renewalingCustomer : list) {
			Integer fourSStoreId = renewalingCustomer.getFourSStoreId();
			Integer customerId = renewalingCustomer.getCustomerId();
			// 比较保险到期日与当前时间做比较
			long insuranceEndDate = renewalingCustomer.getVirtualJqxdqr().getTime();
			Calendar curCal = Calendar.getInstance();
			String yearStr = new Integer(curCal.get(Calendar.YEAR)).toString();
			String monthStr = new Integer(curCal.get(Calendar.MONTH)+1).toString();
			String dayStr = new Integer(curCal.get(Calendar.DAY_OF_MONTH)).toString();
			StringBuffer sb = new StringBuffer();
			sb.append(yearStr);
			sb.append("-");
			sb.append(monthStr);
			sb.append("-");
			sb.append(dayStr);
			String curDateStr = sb.toString();
			SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd");
			Date curDate = sdf.parse(curDateStr);
			long currentTime = curDate.getTime();
			
			curCal.add(Calendar.DATE, 7);
			long timeAfter = curCal.getTimeInMillis();
			Integer cusLostInsurStatu = renewalingCustomer.getCusLostInsurStatu() == null ? 0 : renewalingCustomer.getCusLostInsurStatu();
			if(insuranceEndDate >= currentTime && insuranceEndDate <=timeAfter){
				if(cusLostInsurStatu != 1){
					// 如果检测到时将 则向操作表insert一条修改将脱保的操作记录
					Map<String, Object> operationParam = new HashMap<String, Object>();
						//该潜客分配在哪个用户
						List<CustomerAssign> assignList = customerAssignMapper.findAssignRecodeByCustomerId(customerId);
						User NeedStatisticalWorker = findNeedStatisticalWorker(assignList);
						if(NeedStatisticalWorker != null){
							logger.info("该潜客在"+NeedStatisticalWorker.getUserName()+"手上变为将脱保");
							operationParam.put("userId",NeedStatisticalWorker.getId());
							operationParam.put("customerId", renewalingCustomer.getCustomerId());
							operationParam.put("operationFlag", 7);
							operationRecordMapper.insert(operationParam);
						}
				}
				param.put("cusLostInsurStatu", 1);
				param.put("customerId", renewalingCustomer.getCustomerId());
				param.put("fourSStoreId", fourSStoreId);
				renewalingCustomerMapper.updateInsuracneDateStatuOnTime(param);
				customerMapper.updateInsuracneDateStatuOnTime(param);
			} else if (insuranceEndDate < currentTime) {
				if(cusLostInsurStatu != 2){
					Map<String, Object> operationParam = new HashMap<String, Object>();
					//该潜客分配在哪个用户
					List<CustomerAssign> assignList = customerAssignMapper.findAssignRecodeByCustomerId(customerId);
					User NeedStatisticalWorker = findNeedStatisticalWorker(assignList);
					if(NeedStatisticalWorker != null){
						logger.info("该潜客在"+NeedStatisticalWorker.getUserName()+"手上变为已脱保");
						operationParam.put("userId",NeedStatisticalWorker.getId());
						operationParam.put("customerId", renewalingCustomer.getCustomerId());
						operationParam.put("operationFlag", 8);
						operationRecordMapper.insert(operationParam);
					}
				}
				param.put("cusLostInsurStatu", 2);
				param.put("customerId", renewalingCustomer.getCustomerId());
				renewalingCustomerMapper.updateInsuracneDateStatuOnTime(param);
				customerMapper.updateInsuracneDateStatuOnTime(param);
			}else{
				param.put("cusLostInsurStatu", 0);
				param.put("customerId", renewalingCustomer.getCustomerId());
				renewalingCustomerMapper.updateInsuracneDateStatuOnTime(param);
				customerMapper.updateInsuracneDateStatuOnTime(param);
			}
		}
	}
	
	public User findNeedStatisticalWorker(List<CustomerAssign> assigns) throws Exception {
		User needStatisticalUser = null;
		for(CustomerAssign customerAssign : assigns){
			Integer traceStatu = customerAssign.getTraceStatu();
			if(traceStatu != null && traceStatu != 3){
				Integer userId = customerAssign.getUserId();
				needStatisticalUser = userMapper.findRoleByUserId(userId);
			}
		}
		return needStatisticalUser;
	}
	
	public Map<String, Object> toListMap(RenewalingCustomer renewalingCustomer,User assignUser) {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerId", renewalingCustomer.getCustomerId());
		param.put("traceStatu", 0);
		param.put("traceDate", null);
		param.put("inviteStatu", null);
		param.put("inviteDate", null);
		param.put("acceptStatu", 1);
		param.put("acceptDate", null);
		param.put("returnStatu", null);
		param.put("returnDate", null);
		param.put("customerTraceId", null);
		param.put("assignDate", new Date());
		param.put("delayDate", null);
		param.put("userId", assignUser.getId());
		return param;
	}
}
