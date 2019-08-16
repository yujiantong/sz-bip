package com.bofide.bip.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

import javax.annotation.Resource;
import javax.xml.parsers.DocumentBuilder;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.bofide.bip.exception.InsuranceBillImportException;
import com.bofide.bip.mapper.ApprovalBillMapper;
import com.bofide.bip.mapper.CommonMapper;
import com.bofide.bip.mapper.CustTraceRecordMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.FactorageMapper;
import com.bofide.bip.mapper.GiftManagementMapper;
import com.bofide.bip.mapper.GiftPackageDetailMapper;
import com.bofide.bip.mapper.GivingInformationRecordMapper;
import com.bofide.bip.mapper.InsuTypeMapper;
import com.bofide.bip.mapper.InsuranceBillMapper;
import com.bofide.bip.mapper.InsuranceCompMapper;
import com.bofide.bip.mapper.InsuranceTraceMapper;
import com.bofide.bip.mapper.InsuranceTraceRecodeMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.InsuranceBill;
import com.bofide.bip.po.InsuranceBillExpand;
import com.bofide.bip.po.InsuranceTrace;
import com.bofide.bip.po.InsuranceTraceRecode;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.po.ApprovalBill;
import com.bofide.bip.po.CustTraceRecodeVO;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.CustomerTraceRecode;
import com.bofide.bip.po.Factorage;
import com.bofide.bip.po.GiftManagement;
import com.bofide.bip.po.GiftPackageDetail;
import com.bofide.bip.po.GivingInformation;
import com.bofide.bip.po.InsuType;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.User;
import com.bofide.common.util.DateUtil;

/**
 *出单服务类
 * 
 * @author lingzhenqing
 *
 */
@Service(value = "insuranceService")
@Transactional
public class InsuranceService {
	private static Logger logger = Logger.getLogger(InsuranceService.class);
	private static Integer INSURANCEWRITER_ROLEID = 1;
	private static Integer PRINCIPAL_ROLEID = 2;
	
	@Resource(name = "insuranceBillMapper")
	private InsuranceBillMapper insuranceBillMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Resource(name = "insuranceTraceMapper")
	private InsuranceTraceMapper insuranceTraceMapper;
	@Resource(name = "insuranceTraceRecodeMapper")
	private InsuranceTraceRecodeMapper insuranceTraceRecodeMapper;
	@Resource(name = "custTraceRecordMapper")
	private CustTraceRecordMapper custTraceRecordMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	@Resource(name = "approvalBillMapper")
	private ApprovalBillMapper approvalBillMapper;
	@Autowired
	private CustomerService customerService;
	@Autowired
	private UserService userService;
	@Autowired
	private CommonService commonService;
	@Resource(name = "commonMapper")
	private CommonMapper commonMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Autowired
	private ApprovalBillService approvalBillService;
	@Resource(name = "givingInformationRecordMapper")
	private GivingInformationRecordMapper givingInformationRecordMapper;
	@Resource(name = "giftManagementMapper")
	private GiftManagementMapper giftManagementMapper;
	@Resource(name = "giftPackageDetailMapper")
	private GiftPackageDetailMapper giftPackageDetailMapper;
	@Resource(name = "insuTypeMapper")
	private InsuTypeMapper insuTypeMapper;
	@Resource(name = "insuranceCompMapper")
	private InsuranceCompMapper insuranceCompMapper;
	@Resource(name = "factorageMapper")
	private FactorageMapper factorageMapper;
	
	
	public InsuranceBill findDetail(Integer insuranceBillId) throws Exception {
		InsuranceBill insuranceBill = insuranceBillMapper.findDetail(insuranceBillId);
		return insuranceBill;
	}

	public List<InsuranceTrace> findInsuranceTrace(Integer insuranceBillId) throws Exception {
		List<InsuranceTrace> list = insuranceTraceMapper.findInsuranceTrace(insuranceBillId);
		return list;
	}

	public List<InsuranceTraceRecode> findRecode(Integer insuranceBillId) {
		List<InsuranceTraceRecode> list = insuranceTraceRecodeMapper.findRecode(insuranceBillId);
		return list;
	}
	
	/**
	 * 新增保单
	 * @param insuranceBill 保单bean
	 * @param recordList 跟踪列表
	 * @param userName
	 * @param approvalBill
	 * @throws Exception
	 */
	@SuppressWarnings("deprecation")
	public void saveInsuranceBill(InsuranceBill insuranceBill,List<CustTraceRecodeVO> recordList, 
			Integer userId, String userName, ApprovalBill approvalBill,
			List<InsuType> insuTypeList) throws Exception{
		logger.info("----------------新增保单Service开始-------------");
		String traceContext = "";
		//存保单信息
		InsuranceComp insuranceComp = insuranceCompMapper.selectByCompanyName(insuranceBill.getInsuranceCompName());
		if(insuranceBill.getCoverType() == 1){
			if(insuranceBill.getSfdk() !=null && insuranceBill.getSfdk() ==1){
				//查询该店的该保险公司的新保商业险(贷款)手续费率
				Factorage syxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
						"binsuranceNewLoan");
				insuranceBill.setSyxsxfRate(syxFactorage.getInsuPercent());
				//查询该店的该保险公司的新保交强险(贷款)手续费率
				Factorage jqxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
						"cinsuranceNewLoan");
				insuranceBill.setJqxsxfRate(jqxFactorage.getInsuPercent());
			}else{
				//查询该店的该保险公司的新保商业险(全款)手续费率
				Factorage syxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
						"binsuranceNew");
				insuranceBill.setSyxsxfRate(syxFactorage.getInsuPercent());
				//查询该店的该保险公司的新保交强险(全款)手续费率
				Factorage jqxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
						"cinsuranceNew");
				insuranceBill.setJqxsxfRate(jqxFactorage.getInsuPercent());
			}
		}else{
			//查询该店的该保险公司的续保商业险手续费率
			Factorage syxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
					"binsurance");
			insuranceBill.setSyxsxfRate(syxFactorage.getInsuPercent());
			//查询该店的该保险公司的续保交强险手续费率
			Factorage jqxFactorage = factorageMapper.selectFactorage(insuranceComp.getInsuranceCompId(), insuranceBill.getFourSStoreId(), 
					"cinsurance");
			insuranceBill.setJqxsxfRate(jqxFactorage.getInsuPercent());
		}
		insuranceBill.setCdrq(insuranceBill.getInsurDate());
		insuranceBill.setChassisNumber(insuranceBill.getChassisNumber().toUpperCase());
		if(approvalBill != null){
			approvalBill.setChassisNumber(insuranceBill.getChassisNumber().toUpperCase());
			if(insuranceBill.getJqxrqEnd() != null){
				insuranceBill.setApprovalBillId(approvalBill.getId());
			}
		}
		int renewalType = 0;
		if(insuranceBill.getCoverType() == 1){
			renewalType = 2;
		}else{
			renewalType = 3;
		}
		
		
		//判断潜客表是否存在这个潜客
		Customer customer = customerMapper.findCustomerByCarNum(insuranceBill.getChassisNumber(),insuranceBill.getFourSStoreId());
		
		//插入一条跟踪记录
		if(customer!=null){
			if(insuranceBill.getJqxrqEnd() != null){
				traceContext = "操作人：" + userName + "；操作：出单";
				customerService.addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customer.getCustomerId(),
						traceContext, traceContext, null, null, userId);
			}else{
				traceContext = "操作人：" + userName + "；操作：出单--商业险";
				customerService.addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customer.getCustomerId(),
						traceContext, traceContext, null, null, userId);
			}
		}
		
		if(insuranceBill.getJqxrqEnd() != null){
			if (customer == null) {
				// 不存在则插入该潜客信息
				customer = new Customer();
				customer.setFourSStoreId(insuranceBill.getFourSStoreId());
				customer.setFourSStore(insuranceBill.getFoursStore());
				customer.setCarLicenseNumber(insuranceBill.getCarLicenseNumber());
				customer.setChassisNumber(insuranceBill.getChassisNumber());
				customer.setEngineNumber(insuranceBill.getEngineNumber());
				customer.setRegistrationDate(insuranceBill.getRegistrationDate());
				customer.setCarBrand(insuranceBill.getCarBrand());
				customer.setVehicleModel(insuranceBill.getVehicleModel());
				customer.setSyxrqEnd(insuranceBill.getSyxrqEnd());
				customer.setJqxrqEnd(insuranceBill.getJqxrqEnd());
				customer.setRenewalType(renewalType);
				customer.setRenewalWay(insuranceBill.getRenewalWay());
				customer.setCarOwner(insuranceBill.getCarOwner());
				customer.setInsuredLY(insuranceBill.getInsured());
				customer.setCertificateNumber(insuranceBill.getCertificateNumber());
				customer.setContact(insuranceBill.getContact());
				customer.setContactWay(insuranceBill.getContactWay());
				customer.setAddress(insuranceBill.getAddress());
				customer.setCustomerSource(insuranceBill.getCustomerSource());
				customer.setCustomerCharacter(insuranceBill.getCustomerCharacter());
				customer.setInsuranceNumber(insuranceBill.getCinsuranceNumber());
				customer.setInsurNumber(insuranceBill.getInsurNumber());
				customer.setPrincipalId(insuranceBill.getPrincipalId());
				customer.setPrincipal(insuranceBill.getPrincipal());
				customer.setClerkId(insuranceBill.getClerkId());
				customer.setClerk(insuranceBill.getClerk());
				customer.setStatus(1);
				customer.setLastYearIsDeal(1);
				customer.setCustomerLevel("O");
				customer.setInsuranceCompLY(insuranceBill.getInsuranceCompName());
				customer.setPrivilegeProLY(insuranceBill.getPrivilegePro());
				customer.setInsurDateLY(insuranceBill.getInsurDate());
				customer.setInsuranceCoverageLY(insuranceBill.getPremiumCount());
				customer.setInsuranceTypeLY(insuranceBill.getInsuranceType());
				//设置虚拟virtualJqxdqr的值,出单新增潜客输入的交强险结束日期比较特殊,可以直接作为虚拟结束日期处理
				customer.setVirtualJqxdqr(insuranceBill.getJqxrqEnd());
				customer.setDefeatFlag(0);

				customerMapper.insert(customer);
				
				//插入一条跟踪记录
				traceContext = "操作人：" + userName + "；操作：出单";
				customerService.addTraceRecord(customer.getPrincipalId(), customer.getPrincipal(), customer.getCustomerId(),
						traceContext, traceContext, null, null, userId);
				
				String content = "";
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("storeId", customer.getFourSStoreId());
				param.put("operatorId", insuranceBill.getInsuranceWriterId());
				param.put("operatorName",userName);
				param.put("customerId", customer.getCustomerId());
				param.put("chassisNumber", customer.getChassisNumber());
				param.put("content", content);
				param.put("userId", 0);
				if(insuranceBill.getPrincipalId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人为："+customer.getPrincipal();
					param.replace("content", content);
					param.replace("userId", customer.getPrincipalId());
					commonService.insertMessage(param);
				}
				if(insuranceBill.getClerkId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，业务员为："+customer.getClerk();
					param.replace("content", content);
					param.replace("userId", customer.getClerkId());
					commonService.insertMessage(param);
				}
			} else {
				// 存在则修改该潜客相关信息
				Map<String, Object> map = new HashMap<>();
				map.put("renewalType", renewalType);
				map.put("insurNumber", insuranceBill.getInsurNumber());
				map.put("jqxrqEnd", insuranceBill.getJqxrqEnd());
				map.put("syxrqEnd", insuranceBill.getSyxrqEnd());
				map.put("customerId", customer.getCustomerId());
				map.put("lastYearIsDeal",1);
				map.put("cusLostInsurStatu", 0);
				map.put("status",1);
				map.put("insuranceCompLY",insuranceBill.getInsuranceCompName());
				map.put("privilegeProLY",insuranceBill.getPrivilegePro());
				map.put("insurDateLY",new SimpleDateFormat("yyyy-MM-dd").format(insuranceBill.getInsurDate()));
				map.put("insuranceCoverageLY",insuranceBill.getPremiumCount());
				map.put("insuranceTypeLY",insuranceBill.getInsuranceType());
				map.put("customerLevel", "O");
				map.put("newVirtualJqxdqr", insuranceBill.getJqxrqEnd());
				map.put("insuredLY", insuranceBill.getInsured());
				
				// 修改大池子潜客的本店投保次数和投保类型等信息
				customerMapper.updateCustomerInfo(map);
				// 修改小池子潜客的本店投保次数和投保类型
				renewalingCustomerMapper.updateRenewalingCustomerInfo(map);
			
				//把该潜客分配信息里的跟踪状态更新为跟踪完成
				Map<String, Object> assignMap = new HashMap<>();
				assignMap.put("customerId", customer.getCustomerId());
				assignMap.put("traceStatu", 3);
				assignMap.put("traceDate", new Date());
				customerAssignMapper.updateSelectiveByDifferentId(assignMap);
				
				User xbzg = userMapper.findXBZGByStoreId(customer.getFourSStoreId());
				String content = "";
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("storeId", customer.getFourSStoreId());
				param.put("operatorId", insuranceBill.getInsuranceWriterId());
				param.put("operatorName",userName);
				param.put("customerId", customer.getCustomerId());
				param.put("chassisNumber", customer.getChassisNumber());
				param.put("content", content);
				param.put("userId", 0);
				//给负责人发个人通知
				if(customer.getPrincipalId()!=null&&customer.getPrincipalId().equals
						(insuranceBill.getPrincipalId())){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人为："+customer.getPrincipal();
					param.replace("content", content);
					param.replace("userId", customer.getPrincipalId());
					commonService.insertMessage(param);
				
				}else if(customer.getPrincipalId()!=null&&!customer.getPrincipalId().equals
						(insuranceBill.getPrincipalId())){
					if (insuranceBill.getPrincipalId()==null&&!StringUtils.isEmpty(customer.getPrincipal())) {
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，负责人由:'"+customer.getPrincipal()+"'变更为：无负责人";
						param.replace("content", content);
						param.replace("userId", customer.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}else if(insuranceBill.getPrincipalId()!=null){
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，负责人由:'"+customer.getPrincipal()+"'变更为：'"+insuranceBill.getPrincipal()+"'";
						param.replace("content", content);
						param.replace("userId", customer.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", insuranceBill.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}else if(customer.getPrincipalId()==null&&insuranceBill.getPrincipalId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人由原'无负责人'变更为：'"+insuranceBill.getPrincipal()+"'";
					param.replace("content", content);
					param.replace("userId", insuranceBill.getPrincipalId());
					commonService.insertMessage(param);
					param.replace("userId", xbzg.getId());
					commonService.insertMessage(param);
				}
			
				if(customer.getClerkId()!=null&&customer.getClerkId().equals
						(insuranceBill.getClerkId())){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，业务员为："+customer.getClerk();
					param.replace("content", content);
					param.replace("userId", customer.getClerkId());
					commonService.insertMessage(param);
				
				}else if(customer.getClerkId()!=null&&!customer.getClerkId()
						.equals(insuranceBill.getClerkId())){
					if(insuranceBill.getClerkId()==null&&!StringUtils.isEmpty(customer.getClerk())){
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，业务员由:'"+customer.getClerk()+"'变更为：无业务员";
						param.replace("content", content);
						param.replace("userId", customer.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}else if(insuranceBill.getClerkId()!=null){
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，业务员由:'"+customer.getClerk()+"'变更为：'"+insuranceBill.getClerk()+"'";
						param.replace("content", content);
						param.replace("userId", customer.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", insuranceBill.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}else if(customer.getClerkId()==null&&insuranceBill.getClerkId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人由原无业务员变更为："+insuranceBill.getClerk();
					param.replace("content", content);
					param.replace("userId", insuranceBill.getClerkId());
					commonService.insertMessage(param);
					param.replace("userId", xbzg.getId());
					commonService.insertMessage(param);
				}
			}
		}
		
		//保存保单
		insuranceBillMapper.insert(insuranceBill);
		//保存保单的商业险险种信息
		if (insuTypeList != null && insuTypeList.size() > 0) {
			for (int i = 0; i < insuTypeList.size(); i++) {
				InsuType insuType = insuTypeList.get(i);
				insuType.setInsuId(insuranceBill.getInsuranceBillId());
				insuType.setStoreId(insuranceBill.getFourSStoreId());
				insuType.setType(1);
				insuTypeMapper.insert(insuType);
			}
		}
		
		if(insuranceBill.getJqxrqEnd() != null){
			if(approvalBill != null){
				//去年做过审批单，今年不做直接出单，会导致添加审批单时主键冲突，程序异常，现在通过投保日期和当前日期来过滤，前台也通过投保日期校验该保单是否有审批单   2018-06-27 yujiantong
				if(approvalBill.getInsurDate().getYear()==new Date().getYear()){
					//保存该保单的审批单记录
					approvalBillService.insertApprovalBill(approvalBill);
					//保存审批单的商业险险种信息
					if (insuTypeList != null && insuTypeList.size() > 0) {
						for (int i = 0; i < insuTypeList.size(); i++) {
							InsuType insuType = insuTypeList.get(i);
							insuType.setInsuId(approvalBill.getId());
							insuType.setStoreId(approvalBill.getFourSStoreId());
							insuType.setType(2);
							insuTypeMapper.insert(insuType);
						}
					}
					//保存该保单的赠送记录
					List<GivingInformation> givingInformationList = approvalBill.getGivingInformations();
					if(givingInformationList!=null&&givingInformationList.size()>0){
						for(int k =0;k<givingInformationList.size();k++){
							GivingInformation givingInformation = givingInformationList.get(k);
							givingInformation.setApprovalBillId(approvalBill.getId());
							givingInformation.setGivingInformationId(0);
							if(givingInformation.getGiftType() != null){
								if(givingInformation.getGiftType()==4 || givingInformation.getGiftType()==5){
									//如果是积分赠品或储值卡赠品, 初始积分剩余数量 = 积分卡数量 * 每张积分卡的额度, 
									//初始储值卡剩余金额 = 储值卡数量 * 每张储值卡的额度
									givingInformation.setSurplusNum(givingInformation.getAmount()*givingInformation.getQuota());
								}else {
									givingInformation.setSurplusNum(givingInformation.getAmount());
								}
							}
							givingInformationRecordMapper.insertGivingInformationRecord(givingInformation);
							if(givingInformation.getGiftType()!=null && givingInformation.getGiftType()==3){
								Map<String, Object> givingMap = new HashMap<>();
								givingMap.put("storeId", insuranceBill.getFourSStoreId());
								givingMap.put("giftCode", givingInformation.getGiftCode());
								GiftManagement giftManagement = giftManagementMapper.findGiftByCode(givingMap);
								List<GiftPackageDetail> gifts = giftPackageDetailMapper.findGiftDetailByPackageId(giftManagement.getId());
								if(gifts!=null&&gifts.size()>0){
									Integer givingInformationId = givingInformation.getId();
									Integer amount = givingInformation.getAmount();
									for(int i=0;i<gifts.size();i++){
										double discount = 0;
										givingInformation.setId(null);
										givingInformation.setGiftCode(gifts.get(i).getGiftCode());
										givingInformation.setGiftName(gifts.get(i).getGiftName());
										givingInformation.setGiftType(gifts.get(i).getGiftType());
										givingInformation.setGuidePrice(gifts.get(i).getGuidePrice());
										givingInformation.setSalePrice(gifts.get(i).getSalePrice());
										givingInformation.setActualPrice(gifts.get(i).getActualPrice());
										givingInformation.setAmount(amount*gifts.get(i).getNumber());
										givingInformation.setSurplusNum(amount*gifts.get(i).getNumber());
										if(givingInformation.getDiscount()!=null){
											discount = givingInformation.getDiscount();
										}
										givingInformation.setSellingPrice(givingInformation.getGuidePrice()*(1-discount/100));
										givingInformation.setAmountMoney(givingInformation.getAmount()*givingInformation.getSellingPrice());
										givingInformation.setGivingInformationId(givingInformationId);
										givingInformationRecordMapper.insertGivingInformationRecord(givingInformation);
									}
								}
							}
						}
					}
				}
			}
			//插入保单更新记录
			if(recordList != null && recordList.size() > 0){//有潜客跟踪记录
				Integer customerId = recordList.get(0).getCustomerId();
				//查询潜客跟踪记录详情
				List<CustomerTraceRecode> custRecords= customerTraceRecodeMapper.selectByCustId(customerId);
				//遍历保存保单跟踪记录
				for (CustomerTraceRecode customerTraceRecode : custRecords) {
					InsuranceTraceRecode insuRecord = new InsuranceTraceRecode();
					insuRecord.setInsuranceId(insuranceBill.getInsuranceBillId());
					insuRecord.setNextTraceDate(customerTraceRecode.getNextTraceDate());
					insuRecord.setRenewalType(customerTraceRecode.getRenewalType());
					insuRecord.setCustomerLevel(customerTraceRecode.getCustomerLevel());
					insuRecord.setTraceContext(customerTraceRecode.getTraceContext());
					insuRecord.setCurrentTraceDate(customerTraceRecode.getCurrentTraceDate());
					//保存
					insuranceTraceRecodeMapper.insert(insuRecord);
				}
				
				//查询跟踪记录统计结果
				//List<CustTraceRecodeVO> traceRecodes = custTraceRecordMapper.selectRecordsByCustId(customerId);
				//保存保单跟踪统计数据
				for (CustTraceRecodeVO traceRecodeVO : recordList) {
					//封装数据
					InsuranceTrace trace = new InsuranceTrace();
					trace.setInsuranceBillId(insuranceBill.getInsuranceBillId());
					trace.setPrincipal(traceRecodeVO.getPrincipal());
					trace.setTraceClcye(traceRecodeVO.getTraceClcye());
					trace.setTraceNumber(traceRecodeVO.getTraceCount());
					trace.setCoverType(traceRecodeVO.getRenewalType());
					trace.setAdvanceOutDate(traceRecodeVO.getOutBillDay());
					trace.setIsInvite(traceRecodeVO.getIsInvite());
					trace.setInviteNumber(traceRecodeVO.getInviteNumber());
					trace.setIsInviteToStore(traceRecodeVO.getIsComeStore());
					//新增跟踪明细
					insuranceTraceMapper.insert(trace);
				}
			}
		}else{
			if(customer!=null&&customer.getCustomerId()!=null){
				User xbzg = userMapper.findXBZGByStoreId(customer.getFourSStoreId());
				String content = "";
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("storeId", customer.getFourSStoreId());
				param.put("operatorId", insuranceBill.getInsuranceWriterId());
				param.put("operatorName",userName);
				param.put("customerId", customer.getCustomerId());
				param.put("chassisNumber", customer.getChassisNumber());
				param.put("content", content);
				param.put("userId", 0);
				//给负责人发个人通知
				if(customer.getPrincipalId()!=null&&customer.getPrincipalId().equals
						(insuranceBill.getPrincipalId())){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人为："+customer.getPrincipal();
					param.replace("content", content);
					param.replace("userId", customer.getPrincipalId());
					commonService.insertMessage(param);
				
				}else if(customer.getPrincipalId()!=null&&!customer.getPrincipalId().equals
						(insuranceBill.getPrincipalId())){
					if (insuranceBill.getPrincipalId()==null) {
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，负责人由:'"+customer.getPrincipal()+"'变更为：无负责人";
						param.replace("content", content);
						param.replace("userId", customer.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}else{
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，负责人由:'"+customer.getPrincipal()+"'变更为：'"+insuranceBill.getPrincipal()+"'";
						param.replace("content", content);
						param.replace("userId", customer.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", insuranceBill.getPrincipalId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}else if(customer.getPrincipalId()==null&&insuranceBill.getPrincipalId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人由原'无负责人'变更为：'"+insuranceBill.getPrincipal()+"'";
					param.replace("content", content);
					param.replace("userId", insuranceBill.getPrincipalId());
					commonService.insertMessage(param);
					param.replace("userId", xbzg.getId());
					commonService.insertMessage(param);
				}
			
				if(customer.getClerkId()!=null&&customer.getClerkId().equals
						(insuranceBill.getClerkId())){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，业务员为："+customer.getClerk();
					param.replace("content", content);
					param.replace("userId", customer.getClerkId());
					commonService.insertMessage(param);
				
				}else if(customer.getClerkId()!=null&&!customer.getClerkId()
						.equals(insuranceBill.getClerkId())){
					if(insuranceBill.getClerkId()==null){
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，业务员由:'"+customer.getClerk()+"'变更为：无业务员";
						param.replace("content", content);
						param.replace("userId", customer.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}else{
						content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
							+"，业务员由:'"+customer.getClerk()+"'变更为：'"+insuranceBill.getClerk()+"'";
						param.replace("content", content);
						param.replace("userId", customer.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", insuranceBill.getClerkId());
						commonService.insertMessage(param);
						param.replace("userId", xbzg.getId());
						commonService.insertMessage(param);
					}
				}else if(customer.getClerkId()==null&&insuranceBill.getClerkId()!=null){
					content = userName + "新增保单成功，潜客车架号为：" +customer.getChassisNumber()
						+"，负责人由原无业务员变更为："+insuranceBill.getClerk();
					param.replace("content", content);
					param.replace("userId", insuranceBill.getClerkId());
					commonService.insertMessage(param);
					param.replace("userId", xbzg.getId());
					commonService.insertMessage(param);
				}
				
			}
		}
		logger.info("----------------新增保单Service结束-------------");
	}
	
	/**
	 * 查询潜客信息
	 * 
	 * @param chassisNumber 车架号
	 * @throws Exception
	 */
	public RenewalingCustomer findCust(String  chassisNumber,Integer storeId) throws Exception{
		RenewalingCustomer renewalingCustomer = new RenewalingCustomer();
		renewalingCustomer = renewalingCustomerMapper.selectBychaNum(chassisNumber,storeId);
		if(renewalingCustomer == null){
			Customer customer = customerMapper.findCustomerByCarNum(chassisNumber, storeId);
			if(customer!=null){
				renewalingCustomer = saveRenewalingCustoemrByCustomer(customer);
			}else{
				return renewalingCustomer;
			}
		}
		return renewalingCustomer;
	}
	private RenewalingCustomer saveRenewalingCustoemrByCustomer(Customer customer) throws ParseException {
		RenewalingCustomer renewalingCustomer = new RenewalingCustomer();
		String fourSStore = null;
		String carOwner = null;
	    String insured = null;
	    String contact = null;
	    String contactWay = null;
	    String address = null;
	    String chassisNumber = null;
	    String engineNumber = null;
	    String insuranceCompLY = null;
	    Date syxrqEnd = null;
	    Date jqxrqEnd = null;
	    String carBrand = null;
	    String vehicleModel = null;
	    String carLicenseNumber = null;
	    Date registrationDate = null;
	    Integer renewalType = null;
	    String solicitMemberLY = null;
	    String insuranceTypeLY = null;
	    String renewalWay = null;
	    Integer insurNumber = null;
	    Date insurDateLY = null;
	    Integer isMaintainAgain = null;
	    Integer maintainNumberLY = null;
	    Integer accidentNumberLY = null;
	    Integer accidentOutputValueLY = null;
	    String serviceConsultant = null;
	    String customerLevel = null;
	    String remark = null;
	    String principal = null;
	    Integer principalId = null;
	    String privilegeProLY = null;
	    Double insuranceCoverageLY = null;
	    String insuranceNumber = null;
	    String certificateNumber = null;
	    Integer serviceConsultantId = null;
	    String customerSource = null;
	    String customerCharacter = null;
	    Integer sfgyx = null;
	    Integer status = null;
	    String clerk = null;
	    Integer clerkId = null;
	    String customerDescription = null;
	    Integer lastYearIsDeal = null;
	    Integer cusLostInsurStatu = null;
	    long remainLostInsurDay = 0;
	    
	    //拿出customer的数据
		fourSStore = customer.getFourSStore();
		carOwner = customer.getCarOwner();
		insured = customer.getInsured();
		contact = customer.getContact();
		contactWay = customer.getContactWay();
		address = customer.getAddress();
		chassisNumber = customer.getChassisNumber();
		engineNumber = customer.getEngineNumber();
		insuranceCompLY = customer.getInsuranceCompLY();
		syxrqEnd = customer.getSyxrqEnd();
		jqxrqEnd = customer.getJqxrqEnd();
		carBrand = customer.getCarBrand();
		vehicleModel = customer.getVehicleModel();
		carLicenseNumber = customer.getCarLicenseNumber();
		registrationDate = customer.getRegistrationDate();
		renewalType = customer.getRenewalType();
		solicitMemberLY = customer.getSolicitMemberLY();
	    insuranceTypeLY = customer.getInsuranceTypeLY();
	    renewalWay = customer.getRenewalWay();
	    insurNumber = customer.getInsurNumber();
	    insurDateLY = customer.getInsurDateLY();
	    isMaintainAgain = customer.getIsMaintainAgain();
	    maintainNumberLY = customer.getMaintainNumberLY();
	    accidentNumberLY = customer.getAccidentNumberLY();
	    accidentOutputValueLY = customer.getAccidentOutputValueLY();
	    serviceConsultant = customer.getServiceConsultant();
	    customerLevel = customer.getCustomerLevel();
	    remark = customer.getRemark();
	    principal = customer.getPrincipal();
	    principalId = customer.getPrincipalId();
	    privilegeProLY = customer.getPrivilegeProLY();
	    insuranceCoverageLY = customer.getInsuranceCoverageLY();
	    insuranceNumber = customer.getInsuranceNumber();
	    certificateNumber = customer.getCertificateNumber();
	    serviceConsultantId = customer.getServiceConsultantId();
	    customerSource = customer.getCustomerSource();
	    customerCharacter = customer.getCustomerCharacter();
	    sfgyx = customer.getSfgyx();
	    status = customer.getStatus();
	    clerk = customer.getClerk();
	    clerkId = customer.getClerkId();
	    customerDescription = customer.getCustomerDescription();
	    lastYearIsDeal = customer.getLastYearIsDeal();
	    cusLostInsurStatu = customer.getCusLostInsurStatu();
	    remainLostInsurDay = customer.getRemainLostInsurDay();
	    
		//把数据封装到renewalingCustomer对象中
		renewalingCustomer.setCustomerId(customer.getCustomerId());
		renewalingCustomer.setFourSStoreId(customer.getFourSStoreId());
		renewalingCustomer.setFourSStore(fourSStore);
		renewalingCustomer.setCarOwner(carOwner);
		renewalingCustomer.setInsured(insured);
		renewalingCustomer.setContact(contact);
		renewalingCustomer.setAccidentNumberLY(accidentNumberLY);
		renewalingCustomer.setAccidentOutputValueLY(accidentOutputValueLY);
		renewalingCustomer.setAddress(address);
		renewalingCustomer.setCarBrand(carBrand);
		renewalingCustomer.setCarLicenseNumber(carLicenseNumber);
		renewalingCustomer.setCertificateNumber(certificateNumber);
		renewalingCustomer.setChassisNumber(chassisNumber);
		renewalingCustomer.setClerk(clerk);
		renewalingCustomer.setClerkId(clerkId);
		renewalingCustomer.setContact(contact);
		renewalingCustomer.setContactWay(contactWay);
		renewalingCustomer.setCusLostInsurStatu(cusLostInsurStatu);;
		renewalingCustomer.setCustomerCharacter(customerCharacter);
		renewalingCustomer.setCustomerDescription(customerDescription);
		renewalingCustomer.setCustomerLevel(customerLevel);
		renewalingCustomer.setCustomerSource(customerSource);
		renewalingCustomer.setEngineNumber(engineNumber);
		renewalingCustomer.setInsuranceCompLY(insuranceCompLY);
		renewalingCustomer.setInsuranceCoverageLY(insuranceCoverageLY);
		renewalingCustomer.setInsuranceNumber(insuranceNumber);
		renewalingCustomer.setInsuranceTypeLY(insuranceTypeLY);
		renewalingCustomer.setInsurDateLY(insurDateLY);
		renewalingCustomer.setInsured(insured);
		renewalingCustomer.setInsurNumber(insurNumber);
		renewalingCustomer.setIsMaintainAgain(isMaintainAgain);
		renewalingCustomer.setJqxrqEnd(jqxrqEnd);
		renewalingCustomer.setLastYearIsDeal(lastYearIsDeal);
		renewalingCustomer.setMaintainNumberLY(maintainNumberLY);
		renewalingCustomer.setPrincipal(principal);
		renewalingCustomer.setPrincipalId(principalId);
		renewalingCustomer.setPrivilegeProLY(privilegeProLY);
		renewalingCustomer.setRegistrationDate(registrationDate);
		renewalingCustomer.setRemainLostInsurDay(remainLostInsurDay);
		renewalingCustomer.setRemark(remark);
		renewalingCustomer.setRenewalType(renewalType);
		renewalingCustomer.setRenewalWay(renewalWay);
		renewalingCustomer.setServiceConsultant(serviceConsultant);
		renewalingCustomer.setServiceConsultantId(serviceConsultantId);
		renewalingCustomer.setSfgyx(sfgyx);
		renewalingCustomer.setSolicitMemberLY(solicitMemberLY);
		renewalingCustomer.setStatus(status);
		renewalingCustomer.setSyxrqEnd(syxrqEnd);
		renewalingCustomer.setVehicleModel(vehicleModel);
		return renewalingCustomer;
	}
	/**
	 * 查询跟踪记录
	 * 
	 * @param customerId 客户id
	 * @throws Exception
	 */
	public List<CustTraceRecodeVO> findRecords(Integer  customerId) throws Exception{
		List<CustTraceRecodeVO> traceRecodes = custTraceRecordMapper.selectRecordsByCustId(customerId);
		return traceRecodes;
	}
	 /** 
	 * 保单根据承保类型查询
	 * @param covertype 
	 * @return 
	 * @throws Exception 
	 * 
	 */
	public List<InsuranceBill> findByCovertypeAndCdrq(Map<String, Object> param) throws Exception {
		List<InsuranceBill> billList = insuranceBillMapper.findByCovertypeAndCdrq(param);
		for(int i=0;i<billList.size();i++){
			InsuranceBill bill = billList.get(i);
			Map<String, Object> map = new HashMap<>();
			map.put("insuId", bill.getInsuranceBillId());
			map.put("type", 1);
			List<InsuType> insuTypes = insuTypeMapper.selectByCondition(map);
			bill.setInsuTypes(insuTypes);
			addCheSuntbje(bill);
		}
		return billList;
	}
	
	 /** 
	 * 续保专员按投保类型查询保单
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public List<InsuranceBill> findRCInsuranceBill(Map<String, Object> param) throws Exception {
		List<InsuranceBill> insuranceBillList = insuranceBillMapper.findRCInsuranceBill(param);
		for (int i = 0; i < insuranceBillList.size(); i++) {
			InsuranceBill bill = insuranceBillList.get(i);
			addCheSuntbje(bill);
		}
		return insuranceBillList;
	}
	
	/** 
	 * 统计"续保专员按投保类型查询保单"数量
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public int countFindRCInsuranceBill(Map<String, Object> param) throws Exception {
		Integer policyCount = insuranceBillMapper.countFindRCInsuranceBill(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/** 
	 * 销售或者服务顾问按投保类型查询保单
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public List<InsuranceBill> findSCOrSAInsuranceBill(Map<String, Object> param) throws Exception {
		List<InsuranceBill> insuranceBillList = insuranceBillMapper.findSCOrSAInsuranceBill(param);
		for (int i = 0; i < insuranceBillList.size(); i++) {
			InsuranceBill bill = insuranceBillList.get(i);
			addCheSuntbje(bill);
		}
		return insuranceBillList;
	}
	
	/** 
	 * 统计"销售或者服务顾问按投保类型查询保单"数量
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public int countFindSCOrSAInsuranceBill(Map<String, Object> param) throws Exception {
		Integer policyCount = insuranceBillMapper.countFindSCOrSAInsuranceBill(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/** 
	 * 销售或者服务经理按投保类型查询保单
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public List<InsuranceBill> findSeMOrSaMInsuranceBill(Map<String, Object> param) throws Exception {
		List<InsuranceBill> insuranceBillList = insuranceBillMapper.findSeMOrSaMInsuranceBill(param);
		for (int i = 0; i < insuranceBillList.size(); i++) {
			InsuranceBill bill = insuranceBillList.get(i);
			addCheSuntbje(bill);
		}
		return insuranceBillList;
	}
	
	/** 
	 * 统计"销售或者服务经理按投保类型查询保单"数量
	 * @param map 
	 * @return 
	 * @throws Exception 
	 */
	public int countFindSeMOrSaMInsuranceBill(Map<String, Object> param) throws Exception {
		Integer policyCount = insuranceBillMapper.countFindSeMOrSaMInsuranceBill(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	/** 
	 * 统计"保单根据承保类型查询"数量
	 * @param covertype 
	 * @return 
	 * 
	 */
	public int countFindByCovertypeAndCdrq(Map<String, Object> param) {
		Integer policyCount = insuranceBillMapper.countFindByCovertypeAndCdrq(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/** 
	 * 根据不同情况查询保单,保单的多功能查询
	 * @param insuranceBill 
	 * @return 
	 * @throws Exception 
	 * 
	 */
	public List<InsuranceBill> findByMoreCondition(InsuranceBillExpand insuranceBill) throws Exception {
		//系统出现重复保单，现在将主键不同，其他字段信息完全相同的保单删除
		List<InsuranceBill> list=insuranceBillMapper.findRepeatBill(insuranceBill.getFourSStoreId());
		if(list.size()>0){
			for (InsuranceBill bill : list) {
				insuranceBillMapper.deleteByPrimaryKey(bill.getInsuranceBillId());
			}	
		}
		List<InsuranceBill> billList = insuranceBillMapper.findByMoreCondition(insuranceBill);
		for(int i=0;i<billList.size();i++){
			InsuranceBill bill = billList.get(i);
			Map<String, Object> map = new HashMap<>();
			map.put("insuId", bill.getInsuranceBillId());
			map.put("type", 1);
			List<InsuType> insuTypes = insuTypeMapper.selectByCondition(map);
			bill.setInsuTypes(insuTypes);
			addCheSuntbje(bill);
		}
		return billList;
	}

	/**
	 * 查询时将商业险种的车损价格单独取出存入对象
	 * @param bill
	 */
	private void addCheSuntbje(InsuranceBill bill) {
		String insuranceType = bill.getInsuranceType();
		String chesuntbje = "";
		if(insuranceType!=null && insuranceType.length()>0){
			String types[] = insuranceType.split(",");
			String cheSunStr = "";//车损投保金额，比如"车损-30000"
			for (int i = 0; i < types.length; i++) {
				if(types[i].indexOf("车损") > -1){
					cheSunStr = types[i];
				}
			}
			if(cheSunStr.indexOf("车损") > -1 && cheSunStr.indexOf("-") > -1){
				chesuntbje = cheSunStr.substring(cheSunStr.indexOf("-")+1);
			}
		}
		bill.setChesuntbje(chesuntbje);
	}
	
	/** 
	 * 统计"根据不同情况查询保单,保单的多功能查询"数量
	 * @param covertype 
	 * @return 
	 * @throws Exception 
	 * 
	 */
	public int countFindByMoreCondition(InsuranceBillExpand insuranceBill) throws Exception {
		Integer policyCount = insuranceBillMapper.countFindByMoreCondition(insuranceBill);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/**
	 * 确认客户邀约到店
	 * 
	 * @param customerId 客户id
	 * @param storeId 
	 * @param principalId 
	 * @return
	 * 
	 */
	public int updateConfirmIntoStore(Integer customerId, Integer userId, String userName,
		Integer storeId, Integer principalId,String principal,Integer holderId) throws Exception {
		int result = 0;// 0：确认潜客进店 1：已到店 
		Integer comeStoreNumber = 0;//到店次数;
		
		//插入一条跟踪记录
		String traceContext = "操作人：" + userName + "；操作：确认到店";
		customerService.addTraceRecord(principalId, principal, customerId, traceContext, traceContext, null, null, userId);
		
		RenewalingCustomer reCustomer = renewalingCustomerMapper.selectByPrimaryKey(customerId, storeId);
		if(reCustomer != null){
			if(reCustomer.getComeStoreNumber() != null){
				comeStoreNumber = reCustomer.getComeStoreNumber();
			}
		}
		// 首先,如果是邀约进店,获取具体跟踪记录id
		CustomerAssign customerAssign = customerAssignMapper.selectByCustUser(customerId, holderId);
		if (customerAssign != null) {
			Integer customerTraceId = customerAssign.getCustomerTraceId();
			if(customerTraceId != null){//邀约到店
				//根据跟踪记录id,查询本次跟踪是否到店
				CustomerTraceRecode custTraceRecode = customerTraceRecodeMapper.selectByPrimaryKey(customerTraceId);
				Integer comeStoreVaule = custTraceRecode.getComeStore();
				// 校验该客户是否已经到店
				if (null == comeStoreVaule || comeStoreVaule != 1) {// 没有到店
					Map<String,Object> param = new HashMap<String,Object>();
					param.put("customerId", customerId);
					param.put("isComeStore", 1);
					param.put("comeStoreDate", new Date());
					comeStoreNumber += 1;
					param.put("comeStoreNumber", comeStoreNumber);
					// 修改潜客表是否到店字段
					renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
					// 修改潜客跟踪记录表是否到店字段
					customerTraceRecodeMapper.updateByTraceId(customerTraceId);
				} else {// 已经到店
					result = 1;
				}
			}else{
				//有持有人,直接到店
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("customerId", customerId);
				param.put("isComeStore", 1);
				param.put("comeStoreDate", new Date());
				comeStoreNumber += 1;
				param.put("comeStoreNumber", comeStoreNumber);
				// 修改潜客表是否到店字段
				renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
			}
		}else{
			//没有持有人,直接到店
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("customerId", customerId);
			param.put("isComeStore", 1);
			param.put("comeStoreDate", new Date());
			comeStoreNumber += 1;
			param.put("comeStoreNumber", comeStoreNumber);
			// 修改潜客表是否到店字段
			renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
		}
		
		return result;
	}
	
	/** 
	 * 根据多条件查询邀约客户
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @return 
	 * 
	 */
	public List<RenewalingCustomer> findCustByCondition(Map param) throws Exception{
		
		List<RenewalingCustomer> customters =  renewalingCustomerMapper.findCustomerByCondition(param);
		List<RenewalingCustomer> custList = new ArrayList<RenewalingCustomer>();
		for (RenewalingCustomer renewalingCustomer : customters) {
			Date firtAcceptDate = renewalingCustomer.getFirstAcceptDate();

			Date insuranceEndDate = renewalingCustomer.getVirtualJqxdqr();
			Date now = new Date();
			//计算持有天数
			if(ObjectUtils.isEmpty(firtAcceptDate)){//非空校验
				renewalingCustomer.setHadDays(0);
			}else{
				long hadDays = DateUtil.getDistanceDays(now, firtAcceptDate);
				renewalingCustomer.setHadDays(hadDays);
			}
			//判断是否将脱保
			/*long lastDays = DateUtil.getDistanceDays(insuranceEndDate, now);
			if(lastDays <= 7){
				renewalingCustomer.setOutInsurance(true);
			}else{
				renewalingCustomer.setOutInsurance(false);
			}*/
			custList.add(renewalingCustomer);
		}
		
		return custList;
	}
	
	/** 
	 * 统计"根据多条件查询邀约客户"数量
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @return 
	 * 
	 */
	public int  countFindCustByCondition(Map param) throws Exception{
		Integer policyCount = renewalingCustomerMapper.countFindCustByCondition(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	/** 
	 * 统计"根据多条件查询邀约客户跟踪记录"数量
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @return 
	 * 
	 */
	public int  countFindCustByConditionGzjl(Map param) throws Exception{
		Integer policyCount = renewalingCustomerMapper.countFindCustByConditionGzjl(param);
		if(policyCount == null){
			return 0;
		}else{
			return policyCount;
		}
	}
	
	
	/**
	 * 查询上一年的保单信息
	 * @param chassisNumber
	 * @return
	 * @throws Exception 
	 */
	public InsuranceBill findLastYearInsurBillInfo(String chassisNumber,Integer fourSStoreId) throws Exception {
		InsuranceBill insuranceBill = insuranceBillMapper.findLastYearInsurBillInfo(chassisNumber,fourSStoreId);
//		InsuranceBill LastInsuranceBill = null;
//		//获取所有保单的保险开始日的年份
//		if(insuranceBill != null){
//			Date jqxrqStart = insuranceBill.getJqxrqStart();
//			Calendar jsCalendar = Calendar.getInstance();
//			jsCalendar.setTime(jqxrqStart);
//			int jsYear = jsCalendar.get(Calendar.YEAR);
//			Calendar calendar = Calendar.getInstance();
//			int curYear = calendar.get(Calendar.YEAR);
//			int lastYear = calendar.get(Calendar.YEAR)-1;
//			if(jsYear == lastYear || jsYear == curYear){
//				LastInsuranceBill = insuranceBill;
//			}
//		}
		return insuranceBill;
	}
	
	/**
	 * 更新保单信息
	 * @param map
	 * @param insuTypeList
	 * @throws Exception 
	 */
	public void updateInsuranceBillInfo(Map<String, Object> map,List<InsuType> insuTypeList) throws Exception {
		String chassisNumber = (String) map.get("chassisNumber");
		Integer fourSStoreId = (Integer) map.get("fourSStoreId");
		Integer insuranceBillId = (Integer) map.get("insuranceBillId");
		String newInsurDate = (String) map.get("insurDate");
		map.put("chassisNumber", chassisNumber.toUpperCase());
		InsuranceBill bill = insuranceBillMapper.findDetail(insuranceBillId);
		String oldInsurDate = null;
		if(bill.getInsurDate() != null){
			oldInsurDate = new SimpleDateFormat("yyyy-MM-dd").format(bill.getInsurDate());
		}
		//如果修改了投保日期,则修改相应车架号潜客的投保日期
		if(newInsurDate !=null){
			if(!newInsurDate.equals(oldInsurDate)){
				Customer customer = customerMapper.findCustomerByCarNum(chassisNumber, fourSStoreId);
				if(customer != null){
					Map<String, Object> param = new HashMap<>();
					param.put("customerId", customer.getCustomerId());
					param.put("insurDateLY", newInsurDate);
					//修改改潜客大池子的投保日期
					customerMapper.updateCustomerInfo(param);
					//修改改潜客小池子的投保日期
					renewalingCustomerMapper.updateRenewalingCustomerInfo(param);
				}
			}
		}
		
		//修改保单信息
		insuranceBillMapper.updateInsuranceBillInfo(map);
		//更新保单的商业险险种信息
		if(insuTypeList != null && insuTypeList.size() > 0){
			//先删除对应保单的商业险险种信息
			Map<String, Object> insuMap = new HashMap<>();
			insuMap.put("insuId", insuranceBillId);
			insuMap.put("type", 1);
			insuTypeMapper.deleteByInsuIdAndType(insuMap);
			//再插入对应保单的商业险险种信息
			for (int i = 0; i < insuTypeList.size(); i++) {
				InsuType insuType = insuTypeList.get(i);
				insuType.setInsuId(insuranceBillId);
				insuType.setStoreId(fourSStoreId);
				insuType.setType(1);
				insuTypeMapper.insert(insuType);
			}
		}
	}
	
	/**
	 * 保单导入
	 * @param insuranceBillList
	 * @return 
	 * @throws InsuranceBillImportException 
	 */
	public List<Map<String, Object>> saveInsuranceFromImport(List<InsuranceBill> insuranceBillList) {
		List<Map<String,Object>> errorMessage = new ArrayList<>();
		for(int i=0;i<insuranceBillList.size();i++){
			InsuranceBill insuranceBill = insuranceBillList.get(i);
			try {
				insuranceBill.setChassisNumber(insuranceBill.getChassisNumber().toUpperCase());
				//已经存在的保单直接跳过,在controller做过校验了,在这里面的都是未存在的保单
				boolean existBill = false;
				boolean existJqxBill = false;
				boolean existSyxBill = false;
				String jqxDateFlag = "JqxrqEnd";
				String syxDateFlag = "SyxrqEnd";
				existJqxBill = commonService.verifyInsuranceBill(insuranceBill.getJqxrqEnd(), insuranceBill.getChassisNumber(),
						insuranceBill.getFourSStoreId(),jqxDateFlag);
				if(insuranceBill.getSyxrqEnd() != null){
					existSyxBill = commonService.verifyInsuranceBill(insuranceBill.getSyxrqEnd(), insuranceBill.getChassisNumber(),
							insuranceBill.getFourSStoreId(),syxDateFlag);
				}
				if(existJqxBill){
					existBill = true;
				}
				if(existSyxBill){
					existBill = true;
				}
				if(!existBill){
					String coverTypeName = insuranceBill.getCoverTypeName().getCoverTypeName();
					int coverType = commonMapper.findCoverTypeByName(coverTypeName);
					
					insuranceBill.setCoverType(coverType);
					//查询负责人id
//					Integer principalId = userMapper.findUserIdByUserName(insuranceBill.getFourSStoreId(),
//							insuranceBill.getPrincipal(), PRINCIPAL_ROLEID);
//					insuranceBill.setPrincipalId(principalId);
					List<User> users = userMapper.findUserIdByUserName(insuranceBill.getFourSStoreId(),
							insuranceBill.getPrincipal(), PRINCIPAL_ROLEID);
					if(users.size() > 0){
						User user = RandomOne(users);
						insuranceBill.setPrincipalId(user.getId());
					}
					//查询出单员id
//					Integer insuranceWriterId = userMapper.findUserIdByUserName(insuranceBill.getFourSStoreId(),
//							insuranceBill.getInsuranceWriter(), INSURANCEWRITER_ROLEID);
					List<User> insuranceWriters = userMapper.findUserIdByUserName(insuranceBill.getFourSStoreId(),
							insuranceBill.getInsuranceWriter(), INSURANCEWRITER_ROLEID);
					if(insuranceWriters.size() > 0){
						User user = RandomOne(insuranceWriters);
						insuranceBill.setInsuranceWriterId(user.getId());
					}
					//查询业务员id
					//Integer clerkId = userMapper.findClerkIdByUserName(insuranceBill.getFourSStoreId(),insuranceBill.getClerk());
					//查询业务员id
					List<User> list = userService.findClerkIdByUserName(insuranceBill.getFourSStoreId(),insuranceBill.getClerk());
					Integer clerkId = null;
					if(list.size() > 0){
						User user = customerService.RandomOne(list);
						Integer id = user.getId();
						clerkId = id;
					}
					insuranceBill.setClerkId(clerkId);
					insuranceBill.setCdrq(insuranceBill.getInsurDate());
					insuranceBill.setPremiumCount(insuranceBill.getCinsuranceCoverage() + insuranceBill.getBinsuranceCoverage() + insuranceBill.getVehicleTax());
					insuranceBillMapper.insert(insuranceBill);
				}else{
					logger.info("车架号为: "+insuranceBill.getChassisNumber()+" 的同期保单已经存在,跳过导入");
					Map<String, Object> duplicateMap = new HashMap<>();
					duplicateMap.put("errorType", "duplicate");
					duplicateMap.put("errorRow", insuranceBill.getRowNumber());
					duplicateMap.put("errorString", "同期保单已经存在,跳过导入");
					errorMessage.add(duplicateMap);
				}
			} catch (Exception e) {
				logger.error("导入失败,程序异常!", e);
				Map<String, Object> errorMap = new HashMap<>();
				errorMap.put("errorType", "error");
				errorMap.put("errorRow", insuranceBill.getRowNumber());
				errorMap.put("errorString", "数据异常");
				errorMessage.add(errorMap);
			}
		}
		return errorMessage;
	}
	
	
	/**
	 * 新增保单
	 * @param insuranceBill 保单bean
	 * @param insuTypeList 
	 * @throws Exception
	 */
	public void saveOldInsuranceBill(InsuranceBill insuranceBill,List<InsuType> insuTypeList) throws Exception{
		insuranceBill.setCdrq(insuranceBill.getInsurDate());
		insuranceBill.setChassisNumber(insuranceBill.getChassisNumber().toUpperCase());
		insuranceBillMapper.insert(insuranceBill);
		//保存保单的商业险险种信息
		if (insuTypeList != null && insuTypeList.size() > 0) {
			for (int i = 0; i < insuTypeList.size(); i++) {
				InsuType insuType = insuTypeList.get(i);
				insuType.setInsuId(insuranceBill.getInsuranceBillId());
				insuType.setStoreId(insuranceBill.getFourSStoreId());
				insuType.setType(1);
				insuTypeMapper.insert(insuType);
			}
		}
	}
	
	public User RandomOne(List<User> list) {
		 Random r = new Random();
		 User user = list.get(r.nextInt(list.size()));
		 return user;
	}
	
	/**
	 * 总经理删除保单
	 * @param insuranceBill 保单bean
	 * @param userName 
	 * @throws Exception
	 */
	public void deleteBill(Integer insuranceBillId) throws Exception{
		insuranceTraceMapper.deleteByInsuranceBillId(insuranceBillId);
		insuranceTraceRecodeMapper.deleteByInsuranceBillId(insuranceBillId);
		//删除赠送记录
		givingInformationRecordMapper.deleteForInsuranceBill(insuranceBillId);
		//删除审批单
		approvalBillMapper.deleteForInsuranceBill(insuranceBillId);
		insuranceBillMapper.deleteByPrimaryKey(insuranceBillId);
	}
	
	/**
	 * 校验同期保单是否存在
	 * @param endTime 用于校验的日期
	 * @param chassisNumber 车架号
	 * @param storeId 4s店id
	 * @param dateFlag 校验的日期的类型,可以是商业险结束日期,标志是"SyxrqEnd";也可以是交强险结束日期,标志是"JqxrqEnd"
	 * @throws Exception
	 */
	public InsuranceBill findExistInsuranceBill(Date endTime,
			String chassisNumber, Integer storeId, String dateFlag) throws Exception {
		InsuranceBill insuranceBill = null;
		//获取年份
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(endTime);
		int year = calendar.get(Calendar.YEAR);
		List<InsuranceBill> insuranceBills = insuranceBillMapper.verifyInsuranceBill(chassisNumber,year,storeId,dateFlag);
		if(insuranceBills.size()>0){
			insuranceBill = insuranceBills.get(0);
		}
		return insuranceBill;
	}
	
	/**
	 * 按车架号校验本月是否已出单
	 * @throws Exception
	 */
	public Integer findExistBillThisMonth(Map<String,Object> param) throws Exception {
		return insuranceBillMapper.findExistBillThisMonth(param);
	}
	
	/**
	 * APP今日创建保单
	 * @throws Exception
	 */
	public List<Map<String, Object>> findBillTodayCreate(Map<String,Object> param) throws Exception {
		return insuranceBillMapper.findBillTodayCreate(param);
	}
	
	
	/**
	 * APP今日创建保单数
	 * @throws Exception
	 */
	public Integer findBillTodayCreateCount(Map<String,Object> param) throws Exception {
		return insuranceBillMapper.findBillTodayCreateCount(param);
	}
	
	/**
	 * 根据条件统计保费总额度
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public double sumPremiumCount(InsuranceBillExpand record) throws Exception {
		Double sumPremium = insuranceBillMapper.sumPremiumCount(record);
		if(sumPremium==null){
			return 0;
		}else{
			return sumPremium;
		}
	}
	
	/**
	 * 查询所有没有被迁移数据的保单
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findBillAll() throws Exception {
		return insuranceBillMapper.findBillAll();
	}
	
	/**
	 * 保单和审批单中间表新增方法
	 * @param insuType
	 * @throws Exception
	 */
	public void insertInsuType(InsuType insuType) throws Exception{
		insuTypeMapper.insert(insuType);
	}
	
	/**
	 * 修改保单
	 * @param map
	 * @throws Exception
	 */
	public void updateInsuranceBill(Map<String,Object> map) throws Exception{
		insuranceBillMapper.updateInsuranceBillInfo(map);
	}
	
	/**
	 * 中间表新增和待迁移表修改一致性
	 * @param map
	 * @throws Exception
	 */
	public void updateInsuTypeAndBill(Map<String,Object> map,Integer num) throws Exception{
		Integer insuranceBillId = (Integer)map.get("insuranceBillId");
		Integer approvalId = (Integer)map.get("id");
		Integer fourSStoreId = (Integer)map.get("fourSStoreId");
		String insuranceType = "";
		if(num==1){
			insuranceType = (String)map.get("insuranceType");
		}else{
			insuranceType = (String)map.get("insurancTypes");
		}
		if(!StringUtils.isEmpty(insuranceType)&&insuranceType.trim().length()>0){
			String types[] = insuranceType.split(",");
			for(int j=0;j<types.length;j++){
				InsuType insuType = new InsuType();
				if(num==1){
					insuType.setInsuId(insuranceBillId);
				}else{
					insuType.setInsuId(approvalId);
				}
				insuType.setStoreId(fourSStoreId);
				insuType.setTypeName(types[j]);
				insuType.setCoverage(0.00);
				insuType.setType(num);
				insertInsuType(insuType);
			}
		}
		Map<String,Object> map1 = new HashMap<>();
		map1.put("updateStatus", 1);
		if(num==1){
			map1.put("insuranceBillId", insuranceBillId);
			updateInsuranceBill(map1);
		}else if(num==2){
			map1.put("id", approvalId);
			approvalBillService.updateApprovalRecord(map1);
		}else if(num==3){
			map1.put("id", approvalId);
			approvalBillService.updateApproval(map1);
		}
	}
	
}
