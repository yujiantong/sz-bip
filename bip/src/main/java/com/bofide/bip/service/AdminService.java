package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.bofide.bip.mapper.ApprovalBillMapper;
import com.bofide.bip.mapper.BlocMapper;
import com.bofide.bip.mapper.CarBrandMapper;
import com.bofide.bip.mapper.CarModelMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerBJRecodeMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.GivingInformationRecordMapper;
import com.bofide.bip.mapper.InsuranceBillMapper;
import com.bofide.bip.mapper.InsuranceCompMapper;
import com.bofide.bip.mapper.InsuranceTraceMapper;
import com.bofide.bip.mapper.InsuranceTraceRecodeMapper;
import com.bofide.bip.mapper.InsuranceTypeMapper;
import com.bofide.bip.mapper.MessageMapper;
import com.bofide.bip.mapper.ModuleSetMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.ReasonMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.ReportMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.TraceDaySetMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Bloc;
import com.bofide.bip.po.CarBrand;
import com.bofide.bip.po.CarModel;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.InsuranceType;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.Reason;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.po.User;
import com.bofide.common.util.SecurityUtils;

/**
 *系统管理服务类
 *
 */
@Service(value = "adminService")
public class AdminService {
	
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	@Resource(name = "insuranceTypeMapper")
	private InsuranceTypeMapper insuranceTypeMapper;
	@Resource(name = "insuranceCompMapper")
	private InsuranceCompMapper insuranceCompMapper;
	@Resource(name = "carBrandMapper")
	private CarBrandMapper carBrandMapper;
	@Resource(name = "carModelMapper")
	private CarModelMapper carModelMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "traceDaySetMapper")
	private TraceDaySetMapper traceDaySetMapper;
	@Resource(name = "moduleSetMapper")
	private ModuleSetMapper moduleSetMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Resource(name = "operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "messageMapper")
	private MessageMapper messageMapper;
	@Resource(name = "approvalBillMapper")
	private ApprovalBillMapper approvalBillMapper;
	@Resource(name="insuranceTraceRecodeMapper")
	private InsuranceTraceRecodeMapper insuranceTraceRecodeMapper;
	@Resource(name="insuranceTraceMapper")
	private InsuranceTraceMapper insuranceTraceMapper;
	@Resource(name="insuranceBillMapper")
	private InsuranceBillMapper insuranceBillMapper;
	@Resource(name="customerBJRecodeMapper")
	private CustomerBJRecodeMapper customerBJRecodeMapper;
	@Resource(name="reportMapper")
	private ReportMapper reportMapper;
	@Resource(name="givingInformationRecordMapper")
	private GivingInformationRecordMapper givingInformationRecordMapper;
	@Resource(name="blocMapper")
	private BlocMapper blocMapper;
	@Resource(name="reasonMapper")
	private ReasonMapper reasonMapper;
	
	/**
	 * 新增4S店
	 * 
	 * @param store
	 *            4s店实体bean
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public Integer insertStore(Store store) throws Exception {
		//新增结果兼storeId 新增成功则返回storeId,否则返回-1
		Integer storeId = -1;
		// 保存4s店信息前，校验该AM账号是否存在
		String storeShortName = store.getShortStoreName();
		Store exitsStore = storeMapper.selectByShortName(storeShortName);
		Map<String, Object> param = new HashMap<>();
		param.put("jtShortName", storeShortName);
		param.put("jtDeleted", 0);
		List<Bloc> blocList = blocMapper.findByCondition(param);
		if (exitsStore == null && blocList.size() == 0) {
			//密码加密
			String serPassword = SecurityUtils.encryptAES(store.getAdminPassword(),SecurityUtils.BOFIDE_KEY);
			store.setAdminPassword(serPassword);
			// 保存4s店信息
			storeMapper.insert(store);
			storeId = store.getStoreId();
			// 同步ADMIN账号到user表
			syncAMAccout(store);;
			//初始化4s店客户级别跟踪天数数据
			initTraceDaySetData(storeId);
			//初始化4s店模块开启数据
			initModuleSetData(storeId);
			//初始化回退失销原因配置数据
			initReasonSetData(storeId);
		}
		return storeId;
		
	}
	/**
	 * 按条件校验4s店的信息是否存在, true表示存在, false表示不存在
	 */
	public boolean findExistStoreByCondition(Map<String,Object> param) throws Exception{
		String shortStoreName = param.get("shortStoreName") == null ? "" : param.get("shortStoreName").toString();
		List<Store> list = storeMapper.findStoreByCondition(param);
		//校验店中是否已经存在校验项
		if (list.size() > 0) {
			return true;
		} else {
			if ("".equals(shortStoreName)) {
				return false;
			} else {
				//对于4s店缩写名的校验, 还需要校验集团是不是已经有了该缩写名
				Map<String, Object> blocMap = new HashMap<>();
				blocMap.put("jtShortName", shortStoreName);
				blocMap.put("jtDeleted", 0);
				List<Bloc> blocList = blocMapper.findExistByCondition(blocMap);
				if (blocList.size() > 0) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
	
	/**
	 * 删除4S店(软删除)
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public void deleteStore(Integer storeId) throws Exception{
		
		storeMapper.updateByPrimaryKey(storeId);
		
	 }	
	
	/**
	 * 查询4S店
	 * 
	 * @return storeList 4S店list
	 * @throws Exception
	 */
	public List<Store> findStore(Map<String, Object> param) throws Exception{
		
		List<Store> storeList = storeMapper.findBandedStore(param);
		
		return storeList;
		
	 }
	
	/**
	 * 修改4S店
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public void updateStore(Store store) throws Exception{
		Store sto = storeMapper.selectByPrimaryKey(store.getStoreId());
		if(sto.getJtId()!=store.getJtId()){
			store.setUnitId(null);
		}
		storeMapper.updateStore(store);
		
		//营销短信计费功能模块
		ModuleSet moduleSet = new ModuleSet();
		moduleSet.setFourSStoreId(store.getStoreId());
		moduleSet.setModuleName("updateSMS");
		if(store.getUpdateSMS()==0){
			moduleSet.setSwitchOn(0);
		}else{
			moduleSet.setSwitchOn(1);
		}
		moduleSetMapper.updateByFoursIdAndMoName(moduleSet);
	 }	
	
	/**
	 * 新增险种
	 * @param insuranceType 险种实体bean
	 * @return typeId 险种id
	 * @throws Exception
	 */
	public Integer insertInsuranceType(InsuranceType insuranceType) throws Exception{
		int typeId = 0;//险种id  为-1时，表示该险种已存在，新增失败
		String typeName = insuranceType.getTypeName();
		//根据险种名字查询险种记录
		InsuranceType insuranceTypeRecord = insuranceTypeMapper.selectByTypeName(typeName);
		if(ObjectUtils.isEmpty(insuranceTypeRecord)){
			insuranceTypeMapper.insert(insuranceType);
			typeId = insuranceType.getTypeId();
		}else{
			typeId = -1;
		}
		
		return typeId;
		
	 }
	
	/**
	 * 删除险种
	 * @param typeId 险种id
	 * @return
	 * @throws Exception
	 */
	public void deleteInsuranceType(Integer typeId) throws Exception{
		
		insuranceTypeMapper.deleteByPrimaryKey(typeId);
		
	 }
	
	/**
	 * 查询险种
	 * 
	 * @return typeList 险种list
	 * @throws Exception
	 */
	public List<InsuranceType> findInsuranceType(Map<String, Object> map) throws Exception{
		
		List<InsuranceType> typeList = insuranceTypeMapper.selectAll(map);
		
		return typeList;
		
	 }
	
	/**
	 * 新增保险公司
	 * @param company 保险公司实体bean
	 * @return
	 * @throws Exception
	 */
	public Integer insertInsuranceComp(InsuranceComp company) throws Exception{
		int companyId = 0;
		InsuranceComp companyRecord =  insuranceCompMapper.selectByCompanyName(company.getInsuranceCompName());
		if(ObjectUtils.isEmpty(companyRecord)){
			insuranceCompMapper.insert(company);
			companyId = company.getInsuranceCompId();
		}else{
			companyId = -1;
		}
		
		return companyId;
		
	 }
	
	/**
	 * 删除保险公司
	 * @param insuranceCompId 保险公司id
	 * @return
	 * @throws Exception
	 */
	public void deleteInsuranceComp(Integer insuranceCompId) throws Exception{
		
		insuranceCompMapper.deleteByPrimaryKey(insuranceCompId);
		
	 }
	
	/**
	 * 查询保险公司
	 * 
	 * @return companyList 保险公司list
	 * @throws Exception
	 */
	public List<InsuranceComp> findInsuranceComp() throws Exception{
		
		List<InsuranceComp> companyList = insuranceCompMapper.selectAll();
		
		return companyList;
		
	 }
	
	/**
	 * 修改保险公司
	 * @param company 保险公司实体bean
	 * @return
	 * @throws Exception
	 */
	public void updateInsuranceComp(InsuranceComp company) throws Exception{
		
		insuranceCompMapper.updateCompanyType(company);
		
	 }
	
	/**
	 * 新增汽车品牌
	 * @param carBrand 汽车品牌实体bean
	 * @return
	 * @throws Exception
	 */
	public Integer insertCarBrand(CarBrand carBrand) throws Exception{
		//新增结果兼品牌id  新增失败返回-1，厂家ID为空返回-2，否则返回品牌id，
		Integer brandId = -1;
		//新增前,查询品牌是否已存在
		if(carBrand.getVenderId()==null){
			brandId = -2;
			return brandId;
		}
		CarBrand oldCarBrand = carBrandMapper.selectByBrandName(carBrand.getBrandName());
		if(oldCarBrand == null){
			 carBrandMapper.insert(carBrand);
			 brandId = carBrand.getBrandId();
		}
		return brandId;
	 }
	
	/**
	 * 修改汽车品牌
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public void updateCarBrand(CarBrand carBrand) throws Exception{
		
		carBrandMapper.updateCarBrand(carBrand);
		
	 }	
	/**
	 * 删除汽车品牌
	 * @param brandId 品牌id
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public void deleteCarBrand(Integer brandId) throws Exception{
		//删除品牌
		carBrandMapper.deleteByPrimaryKey(brandId);
		//删除品牌下所有汽车型号
		carModelMapper.deleteByBrandId(brandId);
		
	 }
	
	/**
	 * 查询汽车品牌
	 * 
	 * @return carBrandList 汽车品牌list
	 * @throws Exception
	 */
	public List<CarBrand> findCarBrand(Map<String, Object> map) throws Exception{
		
		List<CarBrand> carBrandList = carBrandMapper.selectAll(map);
		/*//拼装品牌下的所有汽车型号
		List<CarBrand> carBrandModelList = new ArrayList<CarBrand>();
		for (CarBrand carBrand : carBrandList) {
			Integer brandId = carBrand.getBrandId();
			List<CarModel> carModelList = carModelMapper.selectByBrandId(brandId);
			carBrand.setCarModelList(carModelList);
			carBrandModelList.add(carBrand);
		}*/
		
		return carBrandList;
		
	 }
	
	/**
	 * 按品牌名称首字母大小排序查询所有品牌
	 * @return carBrandList 汽车品牌list
	 * @throws Exception
	 */
	public List<CarBrand> findCarBrandByOrder(Map<String, Object> map) throws Exception{
		return carBrandMapper.selectAllByOrder(map);
	}
	
	/**
	 * 新增汽车型号
	 * @param carModel 型号实体bean
	 * @return
	 * @throws Exception
	 */
	public Integer insertCarModel(CarModel carModel) throws Exception{
		
		carModelMapper.insert(carModel);
		Integer modelId = carModel.getModelId();
		return modelId;
	 }
	
	/**
	 * 删除汽车型号
	 * @param modelId 型号id
	 * @return
	 * @throws Exception
	 */
	public void deleteCarModel(Integer modelId) throws Exception{
		
		carModelMapper.deleteByPrimaryKey(modelId);
		
	 }
	
	/**
	 * 查询汽车型号
	 * @param brandId 品牌id
	 * @return carModelList 汽车型号list
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public List<Map> findCarModel(Integer brandId) throws Exception{
		
		List<Map> carModelList = carModelMapper.selectByBrandId(brandId);
		
		return carModelList;
		
	 }
	
	/**
	 * 查询4s店下的汽车品牌以及型号
	 * 
	 * @return storeId 4s店id
	 * @throws Exception
	 */
	public List<CarBrand> findCarBrandAndModel(Integer storeId) throws Exception{
		List<CarBrand> carBrandList = new ArrayList<CarBrand>();
		//根据4s店id查询其汽车品牌
		Store store = storeMapper.selectByPrimaryKey(storeId);
		if(store==null){
			return null;
		}
		String carBrands = store.getCarBrand();
		if(StringUtils.isNotEmpty(carBrands)){
			String[] carBrandArr = carBrands.split("/");
			//根据品牌名称查询品牌所有信息
			for (String brandName : carBrandArr) {
				CarBrand carBrand = carBrandMapper.selectByBrandName(brandName);
				if(carBrand != null){
					Integer brandId = carBrand.getBrandId();
					List<CarModel> carModelList = carModelMapper.findByBrandId(brandId);
					carBrand.setCarModelList(carModelList);
					carBrandList.add(carBrand);
				}
			}
		}else{
			return null;
		}
		
		return carBrandList;
	 }
	
	/**
	 * 建店时同步am账号到用户表
	 * @param store 4s店实体bean
	 * @throws Exception 
	 */
	public void syncAMAccout(Store store) throws Exception {
		// 同步ADMIN账号到user表
		User user = new User();
		user.setStoreId(store.getStoreId());
		user.setLoginName(store.getAdminAccount());
		user.setPassword(store.getAdminPassword());
		user.setRoleId(14);// 4S管理员角色id
		user.setUserName(store.getAdminAccount());
		user.setCreateDate(new Date());
		user.setDeleted(0);
		userMapper.insert(user);
		// 同步发短信账号到user表
		User messageUser = new User();
		messageUser.setStoreId(store.getStoreId());
		String messageLoginName = store.getShortStoreName()+"_message";
		messageUser.setLoginName(messageLoginName);
		messageUser.setPassword(store.getAdminPassword());
		messageUser.setRoleId(20);// 短信发送角色id
		messageUser.setUserName(messageLoginName);
		messageUser.setCreateDate(new Date());
		messageUser.setDeleted(0);
		userMapper.insert(messageUser);
	}
	
	/**
	 * 初始化客户级别跟踪天数设置数据
	 * @param storeId 4s店id
	 */
	public void initTraceDaySetData(Integer storeId){
		TraceDaySet custA = new TraceDaySet();
		TraceDaySet custB = new TraceDaySet();
		TraceDaySet custC = new TraceDaySet();
		TraceDaySet custD = new TraceDaySet();
		TraceDaySet custZ = new TraceDaySet();
		custA.setFourSStoreId(storeId);
		custA.setCustomerLevel("A");
		custA.setDayNumber(3);
		custB.setFourSStoreId(storeId);
		custB.setCustomerLevel("B");
		custB.setDayNumber(7);
		custC.setFourSStoreId(storeId);
		custC.setCustomerLevel("C");
		custC.setDayNumber(14);
		custD.setFourSStoreId(storeId);
		custD.setCustomerLevel("D");
		custD.setDayNumber(30);
		custZ.setFourSStoreId(storeId);
		custZ.setCustomerLevel("Z");
		custZ.setDayNumber(90);
		traceDaySetMapper.insert(custA);
		traceDaySetMapper.insert(custB);
		traceDaySetMapper.insert(custC);
		traceDaySetMapper.insert(custD);
		traceDaySetMapper.insert(custZ);
	}
	
	/**
	 * 初始化模块开启设置数据
	 * @param storeId 4s店id
	 */
	public void initModuleSetData(Integer storeId) {
		//财务模块
		ModuleSet finance = new ModuleSet();
		//销售模块
		ModuleSet sale = new ModuleSet();
		//售后模块
		ModuleSet afterSale = new ModuleSet();
		//更新续险信息模块
		ModuleSet update = new ModuleSet();
		//营销短信模块
		ModuleSet updateSMS = new ModuleSet();
		//台帐模块
		ModuleSet accountModule = new ModuleSet();
		//平均分配潜客模块
		ModuleSet distribution = new ModuleSet();
		//客服模块
		ModuleSet csModule = new ModuleSet();
		
		//出单员模块
		ModuleSet asmModule = new ModuleSet();
				
		finance.setModuleName("finance");
		finance.setSwitchOn(1);
		finance.setFourSStoreId(storeId);
		sale.setModuleName("sale");
		sale.setSwitchOn(1);
		sale.setFourSStoreId(storeId);
		afterSale.setModuleName("afterSale");
		afterSale.setSwitchOn(1);
		afterSale.setFourSStoreId(storeId);
		update.setModuleName("update");
		update.setSwitchOn(0);
		update.setFourSStoreId(storeId);
		updateSMS.setModuleName("updateSMS");
		updateSMS.setSwitchOn(0);
		updateSMS.setFourSStoreId(storeId);
		accountModule.setModuleName("accountModule");
		accountModule.setSwitchOn(0);
		accountModule.setFourSStoreId(storeId);
		distribution.setModuleName("distribution");
		distribution.setSwitchOn(0);
		distribution.setFourSStoreId(storeId);
		csModule.setModuleName("csModule");
		csModule.setSwitchOn(1);
		csModule.setFourSStoreId(storeId);
		asmModule.setModuleName("asmModule");
		asmModule.setSwitchOn(1);
		asmModule.setFourSStoreId(storeId);
		
		moduleSetMapper.insert(finance);
		moduleSetMapper.insert(sale);
		moduleSetMapper.insert(afterSale);
		moduleSetMapper.insert(update);
		moduleSetMapper.insert(updateSMS);
		moduleSetMapper.insert(accountModule);
		moduleSetMapper.insert(distribution);
		moduleSetMapper.insert(csModule);
		moduleSetMapper.insert(asmModule);
	}
	
	/**
	 * 初始化回退失销原因配置数据
	 * @param storeId 4s店id
	 * @throws Exception 
	 */
	public void initReasonSetData(Integer storeId) throws Exception {
		String[] reasons = {
				"竞争店续保","电销购买","网销购买","朋友关系购买","车已卖","多次联系不成功",
				"电话有误","位置因素","团车险购买","异地投保","其他"
			}; 
		//插入默认的11个原因
		for(int i=0;i<reasons.length;i++){
			Reason reason = new Reason();
			reason.setStoreId(storeId);
			reason.setReason(reasons[i]);
			reason.setSort(i+1);
			reason.setStatus(1);
			reason.setDisable(0);
			
			reasonMapper.insert(reason);
		}
	}

	public void updateFormatStoreById(Integer storeId) throws Exception {
		//配置需要删除的报表的数据表
		String[] reportTable = {
				"bf_bip_report_day_comestore","bf_bip_report_day_insurancebill_count",
				"bf_bip_report_day_invite","bf_bip_report_day_invite_comestore",
				"bf_bip_report_day_trace_count","bf_bip_report_loss_reason",
				"bf_bip_report_day_xbltjbb_zhxbl","bf_bip_report_day_xbltjbb_dqxbl",
				"bf_bip_report_month_customer_holder","bf_bip_report_month_kpi_bill_count",
				"bf_bip_report_day_kpi_cdy","bf_bip_report_day_kpi_cover_type",
				"bf_bip_report_day_kpi_xbzy","bf_bip_report_day_kpi_xbzy_detail",
				"bf_bip_report_month_kpi_cdy","bf_bip_report_month_kpi_xbzy",
				"bf_bip_report_month_kpi_xbzy_detail","bf_bip_report_return_reason",
				"bf_bip_report_month_kpi_cover_type_gzyy","bf_bip_report_month_kpi_cover_type_ddcd",
				"bf_bip_report_month_kpi_cover_type_zhxb","bf_bip_report_month_kpi_cover_type_dqxb",
				"bf_bip_report_month_kpi_cover_type_resource","bf_bip_report_month_kpi_cover_type_xbwcl",
				"bf_bip_report_month_customer_trend",//潜客流转分析报表
				"bf_bip_report_month_customer_trend_detail",//潜客流转分析报表明细表
				"bf_bip_report_day_insurance",//保险公司业务占比表
				"bf_bip_report_day_need_trace",//统计当天没做业务之前,应跟踪里面的潜客数
				"bf_bip_report_day_exception","bf_bip_report_day_exception_detail",
				"bf_bip_report_day_kpi_fwgw","bf_bip_report_day_kpi_xsgw",
				"bf_bip_report_sylcqk","bf_bip_report_month_kpi_company"
			};
		//删除分配表的数据
		customerAssignMapper.deleteByStoreId(storeId);
		//删除潜客跟踪记录表的数据
		customerTraceRecodeMapper.deleteByStoreId(storeId);
		//删除操作记录表的数据
		operationRecordMapper.deleteByStoreId(storeId);
		//刪除大池子的潜客信息数据
		customerMapper.deleteByStoreId(storeId);
		//删除小池子的潜客信息数据
		renewalingCustomerMapper.deleteByStoreId(storeId);
		//删除信息表的数据
		messageMapper.deleteByStoreId(storeId);
		//删除赠送信息临时表(bf_bip_giving_information)的数据
		approvalBillMapper.deleteByStoreId(storeId);
		//删除审批单临时表(bf_bip_approval_bill)的数据
		approvalBillMapper.deleteByStoreId2(storeId);
		//删除赠送信息表(bf_bip_giving_information_record)的数据
		givingInformationRecordMapper.deleteByStoreId(storeId);
		//删除审批单临时表(bf_bip_approval_bill_record)的数据
		approvalBillMapper.deleteByStoreId3(storeId);
		//删除保单跟踪记录表
		insuranceTraceRecodeMapper.deleteByStoreId(storeId);
		//删除保单跟踪表数据
		insuranceTraceMapper.deleteByStoreId(storeId);
		//删除保单表数据
		insuranceBillMapper.deleteByStoreId(storeId);
		//删除报价表数据
		customerBJRecodeMapper.deleteByStoreId(storeId);
		//删除配置好的报表的数据表的数据
		for(int i=0;i<reportTable.length;i++){
			reportMapper.deleteReportDataByStoreId(storeId, reportTable[i]);
		}
	}
	
	/**
	 * 根据险种ID查询险种
	 * @param typeId
	 * @return
	 * @throws Exception
	 */
	public InsuranceType findInsuByTypeId(Integer typeId) throws Exception{
		InsuranceType insuranceType = insuranceTypeMapper.findInsuByTypeId(typeId);
		return insuranceType;
	}
	
	/**
	 * 修改险种 
	 * @param map
	 * @throws Exception
	 */
	public void updateInsu(Map<String, Object> map) throws Exception{
		Integer deleted = (Integer)map.get("deleted");
		if(deleted!=null&&deleted==1){
			String typeName = (String)map.get("typeName");
			List<InsuranceComp> insuranceComps= insuranceCompMapper.selectAll();
			if(insuranceComps!=null&&insuranceComps.size()>0){
				for(int i=0;i<insuranceComps.size();i++){
					if(insuranceComps.get(i).getTypeName()!=null&&insuranceComps.get(i).getTypeName().length()>0){
						String typeNames[] = insuranceComps.get(i).getTypeName().split("/");
						String newTypeNames = "";
						boolean boo = false;
						for(int j=0;j<typeNames.length;j++){
							if(typeNames[j].equals(typeName)){
								boo = true;
								continue;
							}else{
								if(newTypeNames.length()==0){
									newTypeNames = typeNames[j];
								}else{
									newTypeNames = newTypeNames+"/"+typeNames[j];
								}
							}
						}
						if(boo){
							insuranceComps.get(i).setTypeName(newTypeNames);
							insuranceCompMapper.updateCompanyType(insuranceComps.get(i));
						}
					}
				}
			}
		}else{
			String oldTypeName = (String)map.get("oldTypeName");
			String typeName = (String)map.get("typeName");
			if(!StringUtils.isEmpty(oldTypeName)&&!StringUtils.isEmpty(typeName)&&!oldTypeName.equals(typeName)){
				List<InsuranceComp> insuranceComps= insuranceCompMapper.selectAll();
				if(insuranceComps!=null&&insuranceComps.size()>0){
					for(int i=0;i<insuranceComps.size();i++){
						if(insuranceComps.get(i).getTypeName()!=null&&insuranceComps.get(i).getTypeName().length()>0){
							String typeNames[] = insuranceComps.get(i).getTypeName().split("/");
							String newTypeNames = "";
							boolean boo = false;
							for(int j=0;j<typeNames.length;j++){
								if(typeNames[j].equals(oldTypeName)){
									boo = true;
									if(newTypeNames.length()==0){
										newTypeNames = typeName;
									}else{
										newTypeNames = newTypeNames+"/"+typeName;
									}
								}else{
									if(newTypeNames.length()==0){
										newTypeNames = typeNames[j];
									}else{
										newTypeNames = newTypeNames+"/"+typeNames[j];
									}
								}
							}
							if(boo){
								insuranceComps.get(i).setTypeName(newTypeNames);
								insuranceCompMapper.updateCompanyType(insuranceComps.get(i));
							}
						}
					}
				}
			}
		}
		insuranceTypeMapper.updateInsu(map);
	}
	/**
	 * 修改充值金额
	 * @param store
	 * @throws Exception
	 */
	public void messageRecharge(Store store) throws Exception{
		storeMapper.messageRecharge(store);
	}
}
