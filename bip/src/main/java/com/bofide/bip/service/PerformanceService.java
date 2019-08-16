package com.bofide.bip.service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CommonMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.InsuranceBillMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.StatisticMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.InsuranceBill;
import com.bofide.bip.po.User;

@Service(value = "performanceService")
public class PerformanceService {
	@Resource(name="userMapper")
	private UserMapper userMapper;
	@Resource(name="insuranceBillMapper")
	private InsuranceBillMapper insuranceBillMapper;
	@Resource(name="renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name="customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Resource(name="customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name="statisticMapper")
	private StatisticMapper statisticMapper;
	@Resource(name="commonMapper")
	private CommonMapper commonMapper;
	@Resource(name="operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	/**
	 * 根据该主管的id寻找其所有下属 
	 * @param storeId2 
	 * @param userId
	 * @return
	 * @throws Exception 
	 */
	
	public List<User> findStatisticaUndering(Integer roleId, Integer storeId) throws Exception {
		List<User> userList = userMapper.findStatisticaUndering(roleId,storeId);
		return userList;
	}
	/**
	 * 查询所有的续保专员对应得所有新保的保单
	 * @param userList
	 * @param endTime 
	 * @param startTime 
	 * @param coverType 
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String, Object>> statisticalNewInsur(List<User> userList, String statisticTime, Integer coverType) throws Exception {
		List<Map<String,Object>> lsitMap = new ArrayList<Map<String,Object>>();
		for(User user : userList){
			Map<String,Object> param = new HashMap<String,Object>();
			Map<String,Object> result = new HashMap<String,Object>();
			Integer id = user.getId();
			param.put("clerkId", id);
			param.put("coverType", coverType);
			param.put("statisticTime", statisticTime);
			//获取user信息;principal：负责人；position:职务
			String clerk = user.getUserName();
			String position = user.getRole().getRoleName();
			//统计该user的下的所有新保的总数
			int newInsurCount = insuranceBillMapper.findNewInsurBillNum(param);
			//查询所有的user的下的新保的信息
			List<InsuranceBill> list = insuranceBillMapper.findInsurBillByPrincipalId(param);
			double binsuranceCoverageSum = 0;
			for(InsuranceBill insuranceBill : list){
				Double binsuranceCoverage = insuranceBill.getBinsuranceCoverage();
				if(binsuranceCoverage != null){
					binsuranceCoverageSum += binsuranceCoverage;
				}
			}
			result.put("userId", id);
			result.put("clerk", clerk);
			result.put("position", position);
			result.put("newInsurCount", newInsurCount);
			result.put("binsuranceCoverageSum", String.format("%.2f", binsuranceCoverageSum));
			//商业险单价 = 商业险保费/新保数量
			float binsuranceAvg = 0; 
			if(newInsurCount == 0 || binsuranceCoverageSum == 0){
				binsuranceAvg = 0;
			}else{
				binsuranceAvg = (float) (binsuranceCoverageSum/newInsurCount);
			}
			result.put("binsuranceAvg", String.format("%.2f", binsuranceAvg));
			lsitMap.add(result);
		}
		return lsitMap;
	}
	
	/**
	 * 查询续保专员的潜客的统计信息
	 * @param renewalType
	 * @param userList
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String, Object>> statistical(Integer renewalType, List<User> userList, 
			String statisticTime,Integer storeId) throws Exception {
		List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
		double traceOnTimeRate = 0;//准时跟进率
		double inviteRate = 0;//潜客邀约率
		double comeStoreRate = 0;//邀约到店率
		double yyddcjl = 0;//邀约到店成交率
		double ddcjl = 0;//到店成交率
		double dqxbl = 0;//当期续保率
		double zhxbl = 0;//综合续保率
		double bfhj = 0;//保费合计
		double syxbfhj = 0;//商业险保费合计
		double syxdjbf = 0;//商业险单均保费
		Integer curAssignCusNum = 0;//当前潜客
		Integer dqxbs = null;//当期成交保单的潜客
		
		double avgCoverage = 0;//当期单均保费
		
		Integer xbsyxcds = 0;//查询出user的续保商业险出单数, 按投保类型统计
		Integer traceCustomerNum = null;//跟踪潜客的所有记录数
		Integer traceCustomerOnTimeNum = null;//跟踪潜客的准时跟踪的记录数
		Integer yyrs = 0;//邀约成功的潜客
		
		for(User user : userList){
			//获取user信息;principal：负责人；position:职务
			String principal = user.getUserName();
			String position = user.getRole().getRoleName();
			Map<String,Object> param = new HashMap<String,Object>();
			Map<String,Object> param2 = new HashMap<String,Object>();
			Map<String,Object> result = new HashMap<String,Object>();
			Integer userId = user.getId();
			param.put("userId", userId);
			param.put("storeId", storeId);
			param.put("renewalType", renewalType);
			param.put("renewalTypeStr", commonMapper.findCoverTypeNameById(renewalType));
			param.put("coverType", renewalType);
			param.put("acceptStatu", 1);
			param.put("statisticTime", statisticTime);
			param2.put("userId", userId);
			param2.put("coverType", renewalType);
			//根据投保类型renewalType查询该user下的分配的所有潜客;全部潜客
			Integer assignCusNumNoTime = statisticMapper.findAllCustomer(param2);
			
			//根据投保类型和负责人id查询负责人的所有跟踪记录
			
			//准时跟进率 ：(应跟踪次数-未准时跟进数)/应跟踪次数(每天一开始应跟踪里面的潜客数+接收的产生的应跟踪次数+下次跟踪日期是当天的跟踪)
			traceCustomerNum = customerTraceRecodeMapper.findTraceRecodeNumByPrincipal(param);
			//异常报表中,未准时跟踪作为准时跟进率的未准时跟进
			Integer wzsgzs  = customerTraceRecodeMapper.findWzsgzsInExcetion(param);
			//准时跟进数 = 应跟踪次数-未准时跟进数
			traceCustomerOnTimeNum = traceCustomerNum - wzsgzs;
			traceOnTimeRate = traceCustomerNum == 0 ? 0 : ((double)traceCustomerOnTimeNum/(double)traceCustomerNum);
			
			//统计周期内邀约人数
			yyrs = statisticMapper.countInviteSuccessCusNum(param);
			//统计上月留存潜客数
			Integer sylcqks = statisticMapper.countSylcqk(param);
			//统计本月新下发潜客数
			Integer byxxfqks = statisticMapper.countXxfqks(param);
			//邀月率 = 邀约人数/(上月留存潜客+本月新下发的潜客)
			inviteRate = (sylcqks+byxxfqks) == 0 ? 0 : ((double)yyrs/(double)(sylcqks+byxxfqks));
			//邀约到店率:周期内邀约到店的潜客(按到店时间)/周期预计到店人数
			//邀约到店数
			Integer comeStoreNum = statisticMapper.countComeStoreCusNum(param);
			//预计到店人数
			Integer yjddrs = statisticMapper.countYjddrs(param);
			comeStoreRate = yjddrs == 0 ? 0 : ((double)comeStoreNum/(double)yjddrs);
			
			//邀约到店成交率：邀约到店成交数/邀约到店数
			//邀约到店成交数
			Integer yyddcjs = statisticMapper.countComeStoreDealCusesNum(param);
			yyddcjl = comeStoreNum == 0 ? 0 : ((double)yyddcjs/(double)comeStoreNum);
			
			//到店成交率：到店成交的潜客数/到店的潜客数
			//到店成交数
			Integer ddcds = statisticMapper.getJxDdcjs(param);
			//到店数(邀约到店+自然到店)
			Integer dds = statisticMapper.getJxDds(param);
			ddcjl = dds == 0 ? 0 : ((double)ddcds/(double)dds);
			
			//根据投保类型renewalType和保险到期日时间查询该user下的分配的所有潜客;当期潜客
			curAssignCusNum = operationRecordMapper.findDqqks(param);
			List<InsuranceBill> dealInsurance = null;
			dealInsurance = insuranceBillMapper.findDealInsuranceNum(param);
			//获取当期潜客成交数
			dqxbs = insuranceBillMapper.countDqxbs(param);
			//当期续保率  = 统计周期到期的潜客的成交保单数/全部潜客数中本月交强险到期客户数
			dqxbl = curAssignCusNum == 0 ? 0 : ((double)dqxbs/(double)curAssignCusNum);
			
			Integer zhxbs = 0;
			Integer qnZhxbs = 0;//去年同期综合续保数
			//统计周期内出单数
			zhxbs = insuranceBillMapper.countZhxbs(param);
			//计算去年统计周期内出单数
			qnZhxbs = insuranceBillMapper.countQnZhxbs(param);
			//综合续保率 = 统计周期内出单数/去年统计周期内出单数
			zhxbl = qnZhxbs == 0 ? 0 : ((double)zhxbs/(double)qnZhxbs);
			
			//保费合计：coverageSumNoTime;商业险总保费：bInsurCoverageSumNoTime;交强险总保费：cInsurCoverageSumNoTime;车船税总费用：vehicleTaxSumNoTime
			Map<String,Double> detailSumNoTime = insuranceBillMapper.coverageSumNoTime(param);
			syxbfhj = detailSumNoTime.get("bInsurCoverageSumNoTime");
			bfhj = detailSumNoTime.get("premiumCountNoTime");
			
			//当期商业险总保费
			double bInsurCoverageSum = 0;//当期商业险金额
			double dqsyxs = 0;//当期商业险数
			for(InsuranceBill insuranceBill : dealInsurance){
				Double binsuranceCoverage = insuranceBill.getBinsuranceCoverage();
				if(binsuranceCoverage != null){
					dqsyxs += 1;
					bInsurCoverageSum += binsuranceCoverage;
				}
			}
			//当期商业险单均保费 = 当期商业险总保费/当期商业险数
			avgCoverage = dqsyxs == 0 ? 0 : (bInsurCoverageSum/dqsyxs);
			//商业险单均保费 = 商业险总保费/续保商业险出单数
			//查询出该user的所有的续保商业险出单数,按投保日期来统计
			xbsyxcds = renewalingCustomerMapper.findAllDealInsuranceNoTime(param);
			syxdjbf = xbsyxcds == 0 ? 0 : (syxbfhj/xbsyxcds);
			
			DecimalFormat df = new DecimalFormat("#.##%"); 
			result.put("userId", userId);//续保专员的id
			result.put("principal", principal);//负责人
			result.put("position", position);//职务
			result.put("assignCusNumNoTime", assignCusNumNoTime);//全部潜客
			result.put("traceOnTimeRate", df.format(traceOnTimeRate));//准时跟进率
			result.put("inviteRate", df.format(inviteRate));//潜客邀约率
			result.put("comeStoreRate", df.format(comeStoreRate));//邀约到店率
			result.put("comStoreDealRate", df.format(yyddcjl));//邀约到店成交率
			result.put("ddcjl", df.format(ddcjl));//到店成交率
			result.put("curRenewalRate", df.format(dqxbl));//当期续保率
			result.put("syntheticalRenewalRate", df.format(zhxbl));//综合续保率
			result.put("coverageSumNoTime", String.format("%.2f", bfhj));//保费合计
			result.put("bInsurCoverageSumNoTime", String.format("%.2f", syxbfhj));//商业险保费合计
			result.put("avgCoverageNoTime", String.format("%.2f", syxdjbf));//商业险单均保费
			result.put("curAssignCusNum", curAssignCusNum);//当前潜客
			result.put("curInsuranceNum",dqxbs);//当前续保数
			result.put("bInsurCoverageSum", String.format("%.2f", bInsurCoverageSum));//当前商业险合计
			result.put("avgCoverage", String.format("%.2f", avgCoverage));//当期商业险单均保费
			listMap.add(result);
		}
		return listMap;
	}
}
