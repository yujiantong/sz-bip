package com.bofide.bip.service;


import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.vo.CustomerTraceRecodeVo;

/**
 *出单服务类
 * 
 * @author lingzhenqing
 *
 */
@Service(value = "renewalingCustomerService")
public class RenewalingCustomerService {

	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Resource(name="customerMapper")
	private CustomerMapper customerMapper;
	
	/**
	 * 根据潜客id查询潜客信息和跟踪记录
	 * 
	 * @param customerId 客户id
	 * @throws Exception 
	 */
	public RenewalingCustomer findTraceRecordByCustomerId(Integer  customerId) throws Exception{
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		List<CustomerTraceRecode> customerTraceRecodes = customerTraceRecodeMapper.findTraceRecordByCustomerId(customerId);
		if(renewalingCustomer != null){
			renewalingCustomer.setCustomerTraceRecodes(customerTraceRecodes);
		}
		return renewalingCustomer;
	}

	/**
	 * 根据潜客id查询潜客跟踪记录（批量）
	 * 
	 * @param customerIdList 潜客id List
	 * @throws Exception
	 */
	public List<CustomerTraceRecodeVo> findTraceRecordByCustomerIdList(List<Integer>  customerIdList) throws Exception{
		if(customerIdList!=null&&customerIdList.size()>0){
		List<CustomerTraceRecodeVo> customerTraceRecodeVoList = customerTraceRecodeMapper.findCustomerInfoByCustomerIdList(customerIdList);
		return customerTraceRecodeVoList;
		}
		return null;
	}

	

	public RenewalingCustomer findRenewalingCustomer(Integer customerId) throws Exception {
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.findCustomerInfoByCustomerId(customerId);
		return renewalingCustomer;
	}
	/**
	 * 查询出1：应跟踪日期小于等于当前日期，
	 * 2：没有做过延期并且延期到期日已经失效并且脱保状态是已脱保，
	 * 3：和是已跟踪了的潜客
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findWillTraceCustomer(Integer storeId) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findWillTraceCustomer(storeId);
		return list;
	}

	public List<RenewalingCustomer> findUpdateCustomerLostStatu(Integer storeId) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findUpdateCustomerLostStatu(storeId);
		return list;
		
	}

	public List<RenewalingCustomer> findRCByStoreId(Integer fourSStoreId) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findRCByStoreId(fourSStoreId);
		return list;
	}

	public List<RenewalingCustomer> findAssignCustomer(List<Customer> assignList) throws Exception {
		List<RenewalingCustomer> list = renewalingCustomerMapper.findAssignCustomer(assignList);
		return list;
	}
	
	/**
	 * 根据userId查询今日邀约的潜客列表
	 * @param param
	 * @return
	 */
	public List<Map<String, Object>> findJRYYCustomerListByUserId(Map<String, Object> param)throws Exception {
		List<Map<String, Object>> list = renewalingCustomerMapper.findJRYYCustomerListByUserId(param);
		return list;
	}

	public Integer findJRYYCustomerListCountByUserId(Map<String, Object> param)throws Exception {
		return renewalingCustomerMapper.findJRYYCustomerListCountByUserId(param);
	}
	
	/*public List<RenewalingCustomer> findAssignCustomer(List<Customer> list) {
		List<RenewalingCustomer> AssignCustomerList = renewalingCustomerMapper.findAssignCustomer(list);
		return AssignCustomerList;
	}*/

	/**
	 * 已激活查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByJiHuo(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> lists = renewalingCustomerMapper.findByJiHuo(param);
		return lists;
	}
	
	/**
	 * 已激活查询总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByJiHuo(Map<String, Object> param) throws Exception {
		int policyCount = renewalingCustomerMapper.countFindByJiHuo(param);
		return policyCount;
	}
	
	/**
	 * 查询到店未出单潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findDdwcdCus(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> lists = renewalingCustomerMapper.findDdwcdCus(param);
		return lists;
	}
	
	/**
	 * 查询到店未出单潜客的总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countDdwcdCus(Map<String, Object> param) throws Exception {
		int policyCount = renewalingCustomerMapper.countDdwcdCus(param);
		return policyCount;
	}
	
	/**
	 * 已回退查询潜客
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<RenewalingCustomer> findByYiHuiTui(Map<String, Object> param) throws Exception {
		List<RenewalingCustomer> lists = renewalingCustomerMapper.findByYiHuiTui(param);
		return lists;
	}
	
	/**
	 * 已回退查询潜客总数
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int countFindByYiHuiTui(Map<String, Object> param) throws Exception {
		int policyCount = renewalingCustomerMapper.countFindByYiHuiTui(param);
		return policyCount;
	}
 
	/**
	 * 已回退查询潜客总数
	 * @param param 总经理
	 * @return
	 * @throws Exception
	 */
	public int findByReturnStatuGzjlCount(Map<String, Object> param) throws Exception {
		int policyCount = renewalingCustomerMapper.countFindByReturnStatuGzjl(param);
		return policyCount;
	}
	/**
	 * 根据车架号查询记录
	 * @param chassisNumber
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public RenewalingCustomer selectBychaNum(String chassisNumber,Integer storeId) throws Exception {
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.selectBychaNum(chassisNumber,storeId);
		return renewalingCustomer;
	}

	public int findCountByApprovalCategory(Map<String, Object> param) throws Exception {
		Integer returnApproveNum = renewalingCustomerMapper.findCountByApprovalCategory(param);
		if(returnApproveNum==null){
			return 0;
		}else{
			return returnApproveNum;
		}
	}
	
	public int countFindByRoleId(Map<String, Object> param) throws Exception {
		return renewalingCustomerMapper.countFindByRoleId(param);
	}
	/**
     * 查询刚导入的潜客，需要更新保险信息的潜客(小池子)
     * @param i
     * @return
     */
	public RenewalingCustomer  selectByPrimaryKey(Integer customerId,Integer storeId) throws Exception  {
		RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.selectByPrimaryKey(customerId,storeId);
		return renewalingCustomer;
	}
	/**
     * 更新刚导入的潜客，需要更新保险信息的潜客(小池子)
     * @param i
     * @return
     */
	public int updateBxMessageList(List<RenewalingCustomer> list) throws Exception {
		return renewalingCustomerMapper.updateBxMessageList(list);
	}
	/**
	 * 更新刚导入的潜客，需要更新保险信息的潜客(小池子)单个
	 * @param customer
	 */
	public int updateBxMessage(RenewalingCustomer renewalingCustomer) {
		return renewalingCustomerMapper.updateBxMessage(renewalingCustomer);		
	}
}
